import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Lock,
  Check,
  Tag,
  Smartphone,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Loader2,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// Helper to load Razorpay SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    selectedPlan,
    chef,
    dietPlan,
    deliveryAddress: stateAddress,
  } = location.state || {};

  useEffect(() => {
    if (!selectedPlan && !chef) {
      navigate("/browse-chefs");
    }
  }, [selectedPlan, chef, navigate]);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: stateAddress?.street || "",
    city: stateAddress?.city || "",
    state: stateAddress?.state || "",
    zipCode: stateAddress?.zipCode || "",
    phone: stateAddress?.phone || user?.phone || "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Determine what we are paying for
  let orderItem = null;
  let basePrice = 0;
  let orderType = "plan";

  if (selectedPlan) {
    orderItem = selectedPlan;
    basePrice =
      selectedPlan.price?.weekly ||
      selectedPlan.price?.monthly ||
      selectedPlan.price?.quarterly ||
      0;
    orderType = "plan";
  } else if (chef) {
    const pricePerMeal = chef.pricePerMeal || 150;
    const mealsPerDay = dietPlan?.mealsPerDay || 3;
    basePrice = pricePerMeal * mealsPerDay * 7; // Weekly
    orderItem = {
      name: `Weekly Meal Plan by Chef ${chef.name}`,
      description: "Personalized meal preparation based on your diet plan",
      chefId: chef.id,
    };
    orderType = "dish";
  } else {
    orderItem = {
      name: "Monthly Plan",
      price: { monthly: 8999 },
    };
    basePrice = 8999;
  }

  const gst = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + gst - discount;

  const handleApplyCoupon = () => {
    const validCoupons = {
      WELCOME10: 0.1,
      SAVE20: 0.2,
      NEWUSER: 0.15,
      MEALWELL15: 0.15,
    };

    const code = couponCode.toUpperCase().trim();
    if (validCoupons[code]) {
      const discountPercent = validCoupons[code];
      const newDiscount = Math.round(basePrice * discountPercent);
      setDiscount(newDiscount);
      setError(null);
    } else {
      setDiscount(0);
      setError("Invalid coupon code");
    }
  };

  const handlePayment = async () => {
    setError(null);
    setSuccess(false);

    // Validate delivery address
    if (
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.zipCode ||
      !deliveryAddress.phone
    ) {
      setError("Please fill in all delivery details.");
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(deliveryAddress.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setProcessing(true);

    try {
      // Load Razorpay SDK
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error(
          "Razorpay SDK failed to load. Please check your internet connection."
        );
      }

      // 1. Create Pending Order
      const orderData = {
        items: [
          {
            name: orderItem.name,
            quantity: 1,
            price: totalAmount,
            type: orderType,
            nutritionalInfo: dietPlan
              ? {
                  calories: dietPlan.calories,
                  protein: dietPlan.protein,
                  carbs: dietPlan.carbs,
                  fats: dietPlan.fats,
                }
              : null,
          },
        ],
        totalAmount: totalAmount,
        status: "pending",
        paymentStatus: "pending",
        notes: dietPlan
          ? `Diet Plan ID: ${dietPlan.id || "generated"} | Meals/Day: ${
              dietPlan.mealsPerDay || 3
            } | Types: ${
              dietPlan.selectedMealTypes
                ? dietPlan.selectedMealTypes.join(", ")
                : "All"
            }`
          : "Standard Plan",
        deliveryAddress: deliveryAddress,
        chefId: chef ? chef.id : undefined,
      };

      const orderRes = await api.post("/orders", orderData);
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || "Failed to create order");
      }
      const order = orderRes.data.data;

      // 2. Create Razorpay Order
      const paymentRes = await api.post("/payments/create-order", {
        amount: totalAmount,
        orderId: order._id,
      });

      if (!paymentRes.data.success) {
        throw new Error(
          paymentRes.data.message || "Failed to create payment order"
        );
      }

      const { razorpayOrderId, amount, currency, key } = paymentRes.data.data;

      // 3. Open Razorpay Checkout
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "MealWell",
        description: orderItem.name,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            setProcessing(true);
            // 4. Verify Payment
            const verifyRes = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });

            if (verifyRes.data.success) {
              setSuccess(true);
              setTimeout(() => {
                navigate("/order-tracking", {
                  state: { orderId: order._id },
                });
              }, 2000);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            setError(
              err.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
            setProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: deliveryAddress.phone.replace(/\D/g, ""),
        },
        theme: {
          color: "#10b981",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            setError("Payment was cancelled");
          },
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(
          response.error.description ||
            "Payment failed. Please try again or use a different payment method."
        );
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment flow error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your order has been confirmed. Redirecting to order tracking...
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Complete Your <span className="text-emerald-600">Order</span>
          </h1>
          <p className="text-lg text-gray-600">
            Secure checkout powered by Razorpay
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 border border-emerald-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900 mb-2">
                      {orderItem.name}
                    </h3>
                    {chef && (
                      <p className="text-sm text-gray-600 mb-1">
                        Chef: {chef.name}
                      </p>
                    )}
                    {dietPlan && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {dietPlan.selectedMealTypes?.map((type) => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-white rounded-full text-xs font-bold text-emerald-700 border border-emerald-200"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-600">
                      ₹{basePrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Base Price</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-semibold">₹{gst.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-black text-gray-900 border-t pt-4 mt-4">
                  <span>Total</span>
                  <span className="text-emerald-600">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Delivery Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">
                  Delivery Details
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.street}
                    onChange={(e) =>
                      setDeliveryAddress({
                        ...deliveryAddress,
                        street: e.target.value,
                      })
                    }
                    placeholder="123 Main St, Apt 4B"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          city: e.target.value,
                        })
                      }
                      placeholder="Mumbai"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.state}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          state: e.target.value,
                        })
                      }
                      placeholder="Maharashtra"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.zipCode}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          zipCode: e.target.value,
                        })
                      }
                      placeholder="400001"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={deliveryAddress.phone}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          phone: e.target.value,
                        })
                      }
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 mb-1">
                      Secure Payment via Razorpay
                    </h3>
                    <p className="text-sm text-gray-600">
                      All payments are processed securely. We support Cards, UPI,
                      Net Banking, and Wallets.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </motion.div>
              )}

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-emerald-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay Securely ₹{totalAmount.toLocaleString()}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                By continuing, you agree to our Terms & Conditions and Privacy
                Policy
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Coupon Code */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Tag className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-gray-900">Have a Coupon?</h3>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleApplyCoupon();
                      }
                    }}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
                  >
                    Apply
                  </button>
                </div>
                {discount > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-emerald-700">
                      ₹{discount.toLocaleString()} discount applied!
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Try: WELCOME10, SAVE20, NEWUSER, MEALWELL15
                </p>
              </div>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl shadow-xl p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6" />
                <h3 className="font-black text-lg">Secure Checkout</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>256-bit SSL Encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>PCI DSS Compliant</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>No card details stored</span>
                </li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
            >
              <h3 className="font-black text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+91 1800-123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>support@mealwell.com</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
