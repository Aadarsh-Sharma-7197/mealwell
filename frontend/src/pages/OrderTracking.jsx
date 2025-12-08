import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  Home,
  Phone,
  MapPin,
} from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      if (response.data.success) {
        // If we have orders, only update state if data changed to avoid re-renders/flickers
        // For simplicity, just updating state is fine for this demo
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      // Don't set error state on polling failure to avoid UI disruption
      if (loading) setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders to show only paid orders (for tracking)
  const trackableOrders = orders.filter(
    (order) => order.paymentStatus === "paid" && order.status !== "cancelled"
  );

  // Update activeOrderId when orders change
  useEffect(() => {
    if (trackableOrders.length > 0 && !activeOrderId) {
      setActiveOrderId(trackableOrders[0]._id);
    } else if (activeOrderId && !trackableOrders.find((o) => o._id === activeOrderId)) {
      if (trackableOrders.length > 0) {
        setActiveOrderId(trackableOrders[0]._id);
      } else {
        setActiveOrderId(null);
      }
    }
  }, [trackableOrders, activeOrderId]);

  const activeOrder = trackableOrders.find((o) => o._id === activeOrderId) || trackableOrders[0];

  const getStepFromStatus = (order) => {
    if (!order) return 0;
    
    // If payment is not paid, show pending
    if (order.paymentStatus !== "paid") {
      return 0;
    }
    
    // Use deliveryStatus timestamps to determine current step
    const deliveryStatus = order.deliveryStatus || {};
    
    if (deliveryStatus.delivered) return 4;
    if (deliveryStatus.out_for_delivery) return 3;
    if (deliveryStatus.ready) return 2;
    if (deliveryStatus.preparing) return 2;
    if (deliveryStatus.confirmed) return 1;
    
    // Fallback to status if deliveryStatus not available
    switch (order.status) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "preparing":
        return 2;
      case "ready":
        return 2;
      case "out_for_delivery":
        return 3;
      case "delivered":
        return 4;
      default:
        return order.paymentStatus === "paid" ? 1 : 0;
    }
  };

  const currentStep = activeOrder ? getStepFromStatus(activeOrder) : 0;

  const trackingSteps = [
    { id: 1, label: "Order Confirmed", icon: CheckCircle },
    { id: 2, label: "Chef Preparing", icon: Clock },
    { id: 3, label: "Out for Delivery", icon: Truck },
    { id: 4, label: "Delivered", icon: Home },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-gray-600">
          Loading your orders...
        </div>
      </div>
    );

  if (trackableOrders.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          No trackable orders
        </h2>
        <p className="text-gray-600 mb-6">
          {orders.length === 0
            ? "You haven't placed any orders yet."
            : "Complete payment to start tracking your orders."}
        </p>
        <button
          onClick={() => navigate("/browse-chefs")}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
        >
          Browse Chefs
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600">
            Real-time updates on your meal delivery
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Orders
              </h2>
              <div className="space-y-3">
                {trackableOrders.map((order) => (
                  <button
                    key={order._id}
                    onClick={() => setActiveOrderId(order._id)}
                    className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                      activeOrderId === order._id
                        ? "bg-emerald-50 border-emerald-500"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-2xl">
                        🍽️
                      </div>
                      <div className="flex-grow">
                        <div className="font-bold text-gray-900">
                          #{order.orderNumber || order._id.slice(-6)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.items.map((i) => i.name).join(", ")}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "out_for_delivery"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs font-bold text-emerald-600 ml-auto">
                        ₹{order.finalAmount || order.totalAmount}
                      </div>
                    </div>
                    {order.paymentStatus === "paid" && (
                      <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Paid
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Delivery Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Address</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {activeOrder?.deliveryAddress?.street},{" "}
                      {activeOrder?.deliveryAddress?.city}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Contact</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {activeOrder?.deliveryAddress?.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Tracking Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  🥗
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-black text-gray-900 mb-1">
                    {activeOrder?.items.map((i) => i.name).join(", ")}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    {activeOrder?.chefId && (
                      <>
                        <span className="font-semibold">
                          Chef: {typeof activeOrder.chefId === 'object' 
                            ? (activeOrder.chefId.userId?.name || activeOrder.chefId._id || 'Unknown')
                            : activeOrder.chefId}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Order ID: {activeOrder?._id}
                  </div>
                </div>
              </div>

              {/* Estimated Time */}
              {activeOrder?.status !== "delivered" && activeOrder?.paymentStatus === "paid" && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-emerald-700 mb-1">
                        {activeOrder.deliveryStatus?.confirmed
                          ? "Order Confirmed"
                          : "Estimated Delivery"}
                      </div>
                      {activeOrder.deliveryStatus?.confirmed ? (
                        <div className="text-lg font-bold text-emerald-600">
                          Tracking started on{" "}
                          {new Date(activeOrder.deliveryStatus.confirmed).toLocaleString()}
                        </div>
                      ) : (
                        <div className="text-3xl font-black text-emerald-600">
                          30-45 mins
                        </div>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <Clock className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                </div>
              )}
              
              {activeOrder?.paymentStatus !== "paid" && (
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-yellow-600" />
                    <div>
                      <div className="text-sm font-bold text-yellow-800 mb-1">
                        Payment Pending
                      </div>
                      <div className="text-sm text-yellow-700">
                        Complete payment to start tracking your order
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tracking Steps */}
              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const isCompleted = step.id <= currentStep;
                  const isActive = step.id === currentStep;

                  return (
                    <div key={step.id} className="relative">
                      {/* Connector Line */}
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`absolute left-6 top-12 w-1 h-20 ${
                            isCompleted ? "bg-emerald-500" : "bg-gray-200"
                          }`}
                        />
                      )}

                      {/* Step */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-center gap-4 mb-8"
                      >
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-all ${
                            isCompleted
                              ? "bg-emerald-500 text-white shadow-lg"
                              : "bg-gray-200 text-gray-400"
                          } ${isActive ? "ring-4 ring-emerald-200" : ""}`}
                        >
                          <step.icon className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <div
                            className={`font-bold ${
                              isCompleted ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </div>
                          {isActive && (
                            <div className="text-sm text-emerald-600 font-semibold animate-pulse">
                              In Progress
                            </div>
                          )}
                          {isCompleted && activeOrder?.deliveryStatus && (
                            <div className="text-xs text-gray-500 mt-1">
                              {step.id === 1 && activeOrder.deliveryStatus.confirmed
                                ? new Date(activeOrder.deliveryStatus.confirmed).toLocaleString()
                                : step.id === 2 && activeOrder.deliveryStatus.preparing
                                ? new Date(activeOrder.deliveryStatus.preparing).toLocaleString()
                                : step.id === 2 && activeOrder.deliveryStatus.ready
                                ? new Date(activeOrder.deliveryStatus.ready).toLocaleString()
                                : step.id === 3 && activeOrder.deliveryStatus.out_for_delivery
                                ? new Date(activeOrder.deliveryStatus.out_for_delivery).toLocaleString()
                                : step.id === 4 && activeOrder.deliveryStatus.delivered
                                ? new Date(activeOrder.deliveryStatus.delivered).toLocaleString()
                                : ""}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

