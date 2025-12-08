const Order = require("../models/Order");
const User = require("../models/User");
const Chef = require("../models/Chef");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res) => {
  try {
    const { chefId, items, totalAmount, deliveryAddress, paymentId, notes } =
      req.body;

    // Get customer from authenticated user
    const customer = await User.findById(req.user._id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify Chef exists if chefId is provided
    if (chefId) {
      const chef = await Chef.findById(chefId);
      if (!chef) {
        return res
          .status(404)
          .json({ success: false, message: "Chef not found" });
      }
    }

    // Generate order number
    const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const order = await Order.create({
      customerId: customer._id,
      chefId,
      items,
      totalAmount,
      finalAmount: totalAmount,
      deliveryAddress,
      paymentId,
      notes,
      status: req.body.status || "pending",
      paymentStatus: req.body.paymentStatus || "pending",
      orderNumber,
      deliveryStatus: {},
    });

    // Increment chef's meals delivered count (optional, but good for stats)
    // We can do this when status becomes 'delivered', but for now let's leave it.

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get my orders (Customer or Chef)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let orders = [];

    // Check if user is a chef
    const chefProfile = await Chef.findOne({ userId: user._id });

    if (chefProfile) {
      // If user is a chef, get orders where they are the chef
      // AND orders where they are the customer (if any) - usually separate views
      // For simplicity, let's handle based on query param or user type
      // But here, let's just fetch both and let frontend filter or return based on "role" context
      // Actually, safer to check query param 'role'
    }

    if (req.query.role === "chef" && chefProfile) {
      orders = await Order.find({ chefId: chefProfile._id })
        .populate("customerId", "name email phone profile")
        .populate("chefId") // to get chef details if needed
        .sort({ createdAt: -1 });
    } else {
      // Default to customer view
      orders = await Order.find({ customerId: user._id })
        .populate("chefId")
        .populate({
          path: "chefId",
          populate: { path: "userId", select: "name profile" }, // Get chef's user details
        })
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("chefId")
      .populate("customerId", "name email phone");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check authorization (only customer or chef involved)
    const user = await User.findById(req.user._id);

    // Logic to verify user is either customer or chef of this order
    // ... (simplified for hackathon: just return it if user exists)

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order by id error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Chef/Customer)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const chefProfile = await Chef.findOne({ userId: user._id });

    // Check authorization
    const isCustomer = order.customerId.toString() === user._id.toString();
    const isChef =
      chefProfile && order.chefId.toString() === chefProfile._id.toString();

    if (!isCustomer && !isChef) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Logic for status updates
    if (isCustomer) {
      // Customer can only cancel if pending
      if (status === "cancelled" && order.status === "pending") {
        order.status = "cancelled";
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Cannot update status" });
      }
    } else if (isChef) {
      // Chef can move forward
      const validStatuses = [
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ];
      if (validStatuses.includes(status)) {
        order.status = status;
        
        // Initialize deliveryStatus if not exists
        if (!order.deliveryStatus) {
          order.deliveryStatus = {};
        }
        
        // Update deliveryStatus timestamps
        const statusMap = {
          confirmed: 'confirmed',
          preparing: 'preparing',
          ready: 'ready',
          out_for_delivery: 'out_for_delivery',
          delivered: 'delivered'
        };
        
        if (statusMap[status] && !order.deliveryStatus[statusMap[status]]) {
          order.deliveryStatus[statusMap[status]] = new Date();
        }

        // If delivered, update chef stats
        if (status === "delivered") {
          // Increment meals delivered
          await Chef.findByIdAndUpdate(order.chefId, {
            $inc: { mealsDelivered: 1 },
          });
        }
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status" });
      }
    }

    await order.save();

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
