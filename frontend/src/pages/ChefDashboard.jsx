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
  Calendar,
  User,
  Filter,
  Search,
  Download,
  Eye,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShoppingBag,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChefHat,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
// @ts-ignore
import "jspdf-autotable";

export default function ChefDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [stats, setStats] = useState({
    pending: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    rating: 4.8,
    totalCustomers: 0,
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
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

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter((order) => order.paymentStatus === paymentFilter);
    }

    setFilteredOrders(filtered);
  };

  const calculateStats = (ordersData) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const pending = ordersData.filter((o) =>
      ["pending", "confirmed", "preparing"].includes(o.status)
    ).length;

    const totalEarnings = ordersData
      .filter((o) => o.paymentStatus === "paid")
      .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    const monthlyEarnings = ordersData
      .filter(
        (o) =>
          o.paymentStatus === "paid" &&
          new Date(o.createdAt) >= startOfMonth
      )
      .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    const uniqueCustomers = new Set(
      ordersData.map((o) => o.customerId?._id || o.customerId).filter(Boolean)
    ).size;

    const completedOrders = ordersData.filter(
      (o) => o.status === "delivered"
    ).length;

    const cancelledOrders = ordersData.filter(
      (o) => o.status === "cancelled"
    ).length;

    setStats({
      pending,
      totalEarnings,
      monthlyEarnings,
      rating: 4.8, // Could fetch from chef profile
      totalCustomers: uniqueCustomers,
      totalOrders: ordersData.length,
      completedOrders,
      cancelledOrders,
    });
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders(); // Refresh orders
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // emerald-600
    doc.text("Chef Dashboard - Order Report", pageWidth / 2, 20, { align: "center" });

    // Add chef info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Chef: ${user?.name || "N/A"}`, 14, 35);
    doc.text(`Email: ${user?.email || "N/A"}`, 14, 42);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 49);

    // Add statistics
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.text("Statistics Summary", 14, 65);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Orders: ${stats.totalOrders}`, 14, 75);
    doc.text(`Pending Orders: ${stats.pending}`, 14, 82);
    doc.text(`Completed Orders: ${stats.completedOrders}`, 14, 89);
    doc.text(`Total Earnings: ₹${stats.totalEarnings.toLocaleString()}`, 14, 96);
    doc.text(`Monthly Earnings: ₹${stats.monthlyEarnings.toLocaleString()}`, 14, 103);
    doc.text(`Total Customers: ${stats.totalCustomers}`, 14, 110);

    // Prepare table data
    const tableData = filteredOrders.map((order) => [
      order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`,
      order.customerId?.name || "Unknown",
      order.items?.map((i) => `${i.name} (x${i.quantity})`).join(", ") || "N/A",
      `₹${order.totalAmount?.toLocaleString() || 0}`,
      order.paymentStatus?.toUpperCase() || "PENDING",
      order.status?.replace(/_/g, " ").toUpperCase() || "PENDING",
      new Date(order.createdAt).toLocaleDateString(),
    ]);

    // Add orders table
    let yPosition = 120;
    
    if (tableData.length > 0) {
      doc.autoTable({
        startY: yPosition,
        head: [["Order #", "Customer", "Items", "Amount", "Payment", "Status", "Date"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [16, 185, 129], // emerald-600
          textColor: 255,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 35 },
          2: { cellWidth: 50 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 30 },
          6: { cellWidth: 25 },
        },
        margin: { left: 14, right: 14 },
      });
    } else {
      doc.setFontSize(12);
      doc.text("No orders to display", 14, yPosition + 10);
    }

    // Add footer on each page
    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount} | Generated by MealWell`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }
    };

    addFooter();

    // Save the PDF
    const fileName = `Chef_Dashboard_Report_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      preparing: "bg-purple-100 text-purple-700 border-purple-200",
      ready: "bg-indigo-100 text-indigo-700 border-indigo-200",
      out_for_delivery: "bg-orange-100 text-orange-700 border-orange-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      failed: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Prepare chart data
  const getChartData = () => {
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return (
          orderDate.toDateString() === date.toDateString() &&
          o.paymentStatus === "paid"
        );
      });

      last7Days.push({
        date: dateStr,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      });
    }
    return last7Days;
  };

  const getStatusDistribution = () => {
    const statusCounts = {};
    orders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                <ChefHat className="w-10 h-10 text-emerald-600" />
                Chef Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back, <span className="font-semibold text-emerald-600">{user?.name}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/chef-menu"
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg hover:shadow-xl"
              >
                Manage Menu
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Orders"
            value={stats.pending}
            icon={Package}
            color="text-blue-600"
            bgColor="bg-blue-100"
            trend={stats.pending > 0 ? "+" + stats.pending : "0"}
            trendUp={false}
          />
          <StatCard
            title="Total Earnings"
            value={`₹${stats.totalEarnings.toLocaleString()}`}
            icon={DollarSign}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
            trend={`₹${stats.monthlyEarnings.toLocaleString()} this month`}
            trendUp={true}
          />
          <StatCard
            title="Rating"
            value={stats.rating.toFixed(1)}
            icon={Star}
            color="text-yellow-600"
            bgColor="bg-yellow-100"
            trend="Based on reviews"
            trendUp={true}
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            color="text-purple-600"
            bgColor="bg-purple-100"
            trend={`${stats.totalOrders} total orders`}
            trendUp={true}
          />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed Orders</p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.completedOrders}</h3>
              </div>
              <div className="p-4 rounded-xl bg-green-100">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Cancelled Orders</p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.cancelledOrders}</h3>
              </div>
              <div className="p-4 rounded-xl bg-red-100">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Success Rate</p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  {stats.totalOrders > 0
                    ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
                    : 0}%
                </h3>
              </div>
              <div className="p-4 rounded-xl bg-blue-100">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Revenue (₹)"
                  dot={{ fill: "#10b981", r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Orders"
                  dot={{ fill: "#3b82f6", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStatusDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getStatusDistribution().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"][index % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">All Orders</h2>
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg hover:shadow-xl"
                  title="Download Orders Report as PDF"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-1 md:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full md:w-64"
                  />
                </div>
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {/* Payment Filter */}
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending Payment</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold text-sm">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="p-4">
                        <span className="font-bold text-emerald-600">
                          {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                            {order.customerId?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {order.customerId?.name || "Unknown Customer"}
                            </div>
                            <div className="text-xs text-gray-500">{order.customerId?.email || ""}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-700">
                          {order.items?.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="text-sm">
                              {item.name} (x{item.quantity})
                            </div>
                          ))}
                          {order.items?.length > 2 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{order.items.length - 2} more
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString() || 0}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus?.toUpperCase() || "PENDING"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status?.replace(/_/g, " ").toUpperCase() || "PENDING"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {order.status === "pending" && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, "confirmed")}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Accept Order"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {order.status === "confirmed" && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, "preparing")}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Start Preparing"
                            >
                              <Clock className="w-5 h-5" />
                            </button>
                          )}
                          {order.status === "preparing" && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, "ready")}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                              title="Mark Ready"
                            >
                              <Package className="w-5 h-5" />
                            </button>
                          )}
                          {order.status === "ready" && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, "out_for_delivery")}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                              title="Out for Delivery"
                            >
                              <TrendingUp className="w-5 h-5" />
                            </button>
                          )}
                          {order.status === "out_for_delivery" && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, "delivered")}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Mark Delivered"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="w-16 h-16 text-gray-300" />
                        <p className="text-gray-500 text-lg">No orders found</p>
                        <p className="text-gray-400 text-sm">
                          {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
                            ? "Try adjusting your filters"
                            : "Orders will appear here once customers place them"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-bold text-lg text-gray-900">
                    {selectedOrder.orderNumber || `#${selectedOrder._id.slice(-8).toUpperCase()}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status?.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(
                      selectedOrder.paymentStatus
                    )}`}
                  >
                    {selectedOrder.paymentStatus?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.customerId?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedOrder.customerId?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {selectedOrder.customerId?.phone || selectedOrder.deliveryAddress?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder.deliveryAddress && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Address
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-gray-900">
                      {selectedOrder.deliveryAddress.street}
                      <br />
                      {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}{" "}
                      {selectedOrder.deliveryAddress.zipCode}
                    </p>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ₹{item.price}
                        </p>
                        {item.nutritionalInfo && (
                          <p className="text-xs text-gray-400 mt-1">
                            {item.nutritionalInfo.calories} cal | {item.nutritionalInfo.protein}g protein
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-bold text-2xl text-emerald-600">
                      ₹{selectedOrder.totalAmount?.toLocaleString() || 0}
                    </p>
                  </div>
                  {selectedOrder.paymentId && (
                    <div>
                      <p className="text-sm text-gray-500">Payment ID</p>
                      <p className="font-semibold text-gray-900">{selectedOrder.paymentId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">Special Notes</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bgColor, trend, trendUp }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-black text-gray-900">{value}</h3>
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trendUp ? "text-emerald-600" : "text-gray-500"}`}>
              {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-xl ${bgColor}`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
}
