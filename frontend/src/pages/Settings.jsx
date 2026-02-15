import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  Check,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import api from "../api/axios";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, logout, updateUser } = useAuth();
  const fileInputRef = React.useRef(null);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    address: "",
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
      notifications: {
          email: true,
          push: true,
          sms: false,
          promo: true
      },
      dietary: [],
      units: "metric"
  });

  // Security state
  const [securityData, setSecurityData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (activeTab === "billing") {
      const fetchOrders = async () => {
        try {
          const res = await api.get("/orders");
          if (res.data.success) {
            setOrders(res.data.data);
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.profile?.location || "",
        address: user.profile?.address || "",
      });
      if (user.preferences) {
          setPreferences(user.preferences);
      }
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("phone", profileData.phone);
      formData.append("location", profileData.location);
      formData.append("address", profileData.address);
      formData.append("preferences", JSON.stringify(preferences));

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("avatar", file);

      setLoading(true);
      try {
          const response = await axios.put(
              `${import.meta.env.VITE_API_URL}/auth/profile`,
              formData,
              {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                      "Content-Type": "multipart/form-data",
                  },
              }
          );
           if (response.data.success) {
              setMessage({ type: "success", text: "Photo updated successfully!" });
              updateUser(response.data.user);
          }
      } catch (error) {
           console.error("Photo upload error:", error);
           setMessage({ type: "error", text: "Failed to upload photo" });
      } finally {
          setLoading(false);
      }
  };

  const handlePasswordUpdate = async () => {
      if (securityData.newPassword !== securityData.confirmPassword) {
          setMessage({ type: "error", text: "New passwords do not match" });
          return;
      }
      setLoading(true);
      setMessage({ type: "", text: "" });

      try {
          const response = await axios.put(
              `${import.meta.env.VITE_API_URL}/auth/updatepassword`,
              {
                  currentPassword: securityData.currentPassword,
                  newPassword: securityData.newPassword,
              },
              {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
              }
          );
          if (response.data.success) {
              setMessage({ type: "success", text: "Password updated successfully!" });
              setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
          }
      } catch (error) {
           setMessage({ type: "error", text: error.response?.data?.message || "Failed to update password" });
      } finally {
          setLoading(false);
      }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "help", label: "Help", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
                <Link to="/">
                  <button
                    onClick={() => {
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-all mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </Link>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Profile Picture */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Profile Information
                    </h2>
                    {message.text && (
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                          message.type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {message.type === "success" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        {message.text}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg overflow-hidden">
                      {user?.profile?.avatar ? (
                        <img
                          src={user.profile.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.name?.charAt(0) || "U"
                      )}
                    </div>
                    <div>
                      <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handlePhotoUpload} 
                          className="hidden" 
                          accept="image/*"
                      />
                      <button 
                          onClick={() => fileInputRef.current.click()}
                          className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all mb-2"
                      >
                        Change Photo
                      </button>
                      <p className="text-sm text-gray-500">
                        JPG, PNG or GIF. Max size 2MB
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              location: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      rows="3"
                      placeholder="Enter your full address"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() =>
                        setProfileData({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          location: user.profile?.location || "",
                          address: user.profile?.address || "",
                        })
                      }
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProfileUpdate}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  {Object.entries(preferences.notifications || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <div className="font-bold text-gray-900 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="text-sm text-gray-500">Enable notification for {key}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setPreferences({
                              ...preferences,
                              notifications: {
                                  ...preferences.notifications,
                                  [key]: e.target.checked
                              }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  ))}
                  <button
                      onClick={handleProfileUpdate}
                      disabled={loading}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                      Save Preferences
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Security Settings
                </h2>

                 {message.text && (
                      <div
                        className={`mb-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                          message.type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {message.text}
                      </div>
                    )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Enter current password"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button 
                      onClick={handlePasswordUpdate}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Billing History
                </h2>
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div>
                          <div className="font-bold text-gray-900">
                            {order.items[0]?.name || "Meal Plan"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-600">
                            ₹{order.totalAmount}
                          </div>
                          <div className="text-xs uppercase font-semibold text-gray-500">
                            {order.paymentStatus}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No recent transactions found.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "help" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Help & Support
                </h2>

                <div className="space-y-6">
                   <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                      <h3 className="flex items-center gap-2 font-bold text-emerald-800 mb-2">
                         <HelpCircle className="w-5 h-5" />
                         Need urgent help?
                      </h3>
                      <p className="text-emerald-700 text-sm mb-4">
                         Our support team is available 24/7 to assist you.
                      </p>
                      <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all">
                         Chat with Support
                      </button>
                   </div>
                    {/* Add more help sections as needed */}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
