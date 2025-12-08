import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Plus,
  Calendar,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function ChefDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    earnings: 0,
    rating: 4.8, // Placeholder
    customers: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Fetch orders for this chef.
      // The backend should filter by the logged-in chef's ID if we don't pass one,
      // OR we might need to pass ?chefId=... if the backend requires it.
      // However, usually /api/orders for a chef role should return their orders.
      // Let's assume /api/orders returns relevant orders based on role.
      const response = await api.get("/orders", {
        params: { role: "chef" },
      });

      if (response.data.success) {
        const fetchedOrders = response.data.data;
        setOrders(fetchedOrders);
        calculateStats(fetchedOrders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const pending = ordersData.filter((o) =>
      ["pending", "confirmed", "preparing"].includes(o.status)
    ).length;
    const earnings = ordersData
      .filter((o) => o.paymentStatus === "paid")
      .reduce((acc, curr) => acc + curr.totalAmount, 0);

    // Count unique customers
    const uniqueCustomers = new Set(ordersData.map((o) => o.userId)).size;

    setStats((prev) => ({
      ...prev,
      pending,
      earnings,
      customers: uniqueCustomers,
    }));
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });

      // Update local state
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );

      // Re-calculate stats if needed
      calculateStats(
        orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chef Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, Chef {user?.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Orders"
            value={stats.pending}
            icon={Package}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            title="Total Earnings"
            value={`₹${stats.earnings}`}
            icon={DollarSign}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
          />
          <StatCard
            title="Rating"
            value={stats.rating}
            icon={Star}
            color="text-yellow-600"
            bgColor="bg-yellow-100"
          />
          <StatCard
            title="Total Customers"
            value={stats.customers}
            icon={Users}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/chef-menu"
              className="flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700"
            >
              Manage Menu <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            {order.userId?.name?.charAt(0) || "U"}
                          </div>
                          <span className="text-gray-700">
                            {order.userId?.name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {order.items.map((i) => i.name).join(", ")}
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {order.status === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "confirmed")
                              }
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Accept Order"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {order.status === "confirmed" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "preparing")
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Start Preparing"
                            >
                              <Clock className="w-5 h-5" />
                            </button>
                          )}
                          {order.status === "preparing" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "ready")
                              }
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                              title="Mark Ready"
                            >
                              <Package className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    preparing: "bg-purple-100 text-purple-700",
    ready: "bg-indigo-100 text-indigo-700",
    out_for_delivery: "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
