import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Receipt,
  Calendar,
  CreditCard,
  Package,
  CheckCircle,
  MapPin,
  ChefHat,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/payments/history");
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPaymentHistory}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/customer"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Receipt className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">
                Payment History
              </h1>
              <p className="text-gray-600 mt-1">
                View all your past transactions and orders
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Payments
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {payments.length}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Spent
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(
                    payments.reduce((sum, p) => sum + (p.amount || 0), 0)
                  )}
                </h3>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Receipt className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Active Orders
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {
                    payments.filter(
                      (p) =>
                        !["delivered", "cancelled"].includes(p.status)
                    ).length
                  }
                </h3>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              All Transactions
            </h2>
          </div>

          {payments.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Payment History
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't made any payments yet.
              </p>
              <Link
                to="/browse-chefs"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
              >
                Browse Chefs
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {payments.map((payment, index) => (
                <motion.div
                  key={payment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() =>
                    setSelectedPayment(
                      selectedPayment?._id === payment._id ? null : payment
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">
                              Order #{payment.orderNumber}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : payment.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {payment.status.replace(/_/g, " ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(payment.createdAt)}
                            </div>
                            {payment.chefName && (
                              <div className="flex items-center gap-1">
                                <ChefHat className="w-4 h-4" />
                                {payment.chefName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="ml-16 mb-3">
                        <div className="text-sm text-gray-600">
                          <strong>Items:</strong>{" "}
                          {payment.items
                            ?.map((item) => `${item.name} (x${item.quantity})`)
                            .join(", ") || "N/A"}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedPayment?._id === payment._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="ml-16 mt-4 pt-4 border-t border-gray-200 space-y-3"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Payment ID
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {payment.paymentId || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Razorpay Order ID
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {payment.razorpayOrderId || "N/A"}
                              </p>
                            </div>
                          </div>

                          {payment.deliveryAddress && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Delivery Address
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {payment.deliveryAddress.street},{" "}
                                {payment.deliveryAddress.city},{" "}
                                {payment.deliveryAddress.state} -{" "}
                                {payment.deliveryAddress.zipCode}
                              </p>
                              {payment.deliveryAddress.phone && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Phone: {payment.deliveryAddress.phone}
                                </p>
                              )}
                            </div>
                          )}

                          {payment.items && payment.items.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 mb-2">
                                Order Details
                              </p>
                              <div className="space-y-2">
                                {payment.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {item.name}
                                      </p>
                                      {item.nutritionalInfo && (
                                        <p className="text-xs text-gray-500">
                                          {item.nutritionalInfo.calories} kcal
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-bold text-gray-900">
                                        {formatCurrency(item.price * item.quantity)}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Qty: {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {payment.deliveryStatus && (
                            <div>
                              <p className="text-xs text-gray-500 mb-2">
                                Delivery Timeline
                              </p>
                              <div className="space-y-1 text-xs">
                                {payment.deliveryStatus.confirmed && (
                                  <p className="text-gray-600">
                                    ✓ Confirmed:{" "}
                                    {formatDate(payment.deliveryStatus.confirmed)}
                                  </p>
                                )}
                                {payment.deliveryStatus.preparing && (
                                  <p className="text-gray-600">
                                    ✓ Preparing:{" "}
                                    {formatDate(payment.deliveryStatus.preparing)}
                                  </p>
                                )}
                                {payment.deliveryStatus.ready && (
                                  <p className="text-gray-600">
                                    ✓ Ready:{" "}
                                    {formatDate(payment.deliveryStatus.ready)}
                                  </p>
                                )}
                                {payment.deliveryStatus.out_for_delivery && (
                                  <p className="text-gray-600">
                                    ✓ Out for Delivery:{" "}
                                    {formatDate(
                                      payment.deliveryStatus.out_for_delivery
                                    )}
                                  </p>
                                )}
                                {payment.deliveryStatus.delivered && (
                                  <p className="text-gray-600">
                                    ✓ Delivered:{" "}
                                    {formatDate(
                                      payment.deliveryStatus.delivered
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          <Link
                            to="/order-tracking"
                            className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
                          >
                            Track Order
                          </Link>
                        </motion.div>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-2xl font-black text-emerald-600">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Paid</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

