import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Star, TrendingUp, Clock, CheckCircle, AlertCircle, Users, Plus, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChefDashboard() {
  const stats = [
    { label: 'Pending Orders', value: '8', icon: Package, colorClass: 'bg-orange-100', iconColorClass: 'text-orange-600', trend: '+2' },
    { label: 'This Week Earnings', value: '₹12,450', icon: DollarSign, colorClass: 'bg-green-100', iconColorClass: 'text-green-600', trend: '+15%' },
    { label: 'Rating', value: '4.8', icon: Star, colorClass: 'bg-yellow-100', iconColorClass: 'text-yellow-600', trend: '+0.2' },
    { label: 'Total Customers', value: '234', icon: Users, colorClass: 'bg-purple-100', iconColorClass: 'text-purple-600', trend: '+12' }
  ];

  const recentOrders = [
    { id: '#MW2847', customer: 'Rahul Sharma', meal: 'Grilled Chicken Salad', status: 'preparing', time: '12:30 PM', amount: '₹350' },
    { id: '#MW2846', customer: 'Priya Kumar', meal: 'Quinoa Buddha Bowl', status: 'ready', time: '1:00 PM', amount: '₹380' },
    { id: '#MW2845', customer: 'Amit Singh', meal: 'Protein Smoothie Bowl', status: 'completed', time: '8:00 AM', amount: '₹280' }
  ];

  const weeklyEarnings = [
    { day: 'Mon', amount: 1850 },
    { day: 'Tue', amount: 2100 },
    { day: 'Wed', amount: 1950 },
    { day: 'Thu', amount: 2300 },
    { day: 'Fri', amount: 2050 },
    { day: 'Sat', amount: 1800 },
    { day: 'Sun', amount: 400 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'preparing': return 'bg-orange-100 text-orange-700';
      case 'ready': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Chef Dashboard</h1>
            <p className="text-gray-600">Manage your orders and track earnings</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link 
              to="/chef-menu"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Dish
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.colorClass} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColorClass}`} />
                </div>
                <span className="text-xs text-emerald-600 font-bold">{stat.trend}</span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Recent Orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                <button className="text-emerald-600 font-semibold text-sm hover:text-emerald-700">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900">{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{order.customer}</div>
                      <div className="text-sm font-semibold text-gray-900">{order.meal}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {order.time}
                        </span>
                        <span className="font-bold text-emerald-600">{order.amount}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {order.status === 'preparing' && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm">
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all text-sm">
                          Complete
                        </button>
                      )}
                      {order.status === 'completed' && (
                        <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-semibold text-sm flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Weekly Earnings Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Earnings</h2>
              <div className="flex items-end justify-between h-64 gap-2">
                {weeklyEarnings.map((data, i) => {
                  const maxAmount = Math.max(...weeklyEarnings.map(d => d.amount));
                  const height = (data.amount / maxAmount) * 100;
                  
                  return (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs font-bold text-gray-500">₹{data.amount}</div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-emerald-500 to-green-400 rounded-t-xl min-h-[20%] hover:from-emerald-600 hover:to-green-500 transition-all cursor-pointer"
                      />
                      <div className="text-xs font-semibold text-gray-600">{data.day}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/chef-menu"
                  className="w-full p-4 bg-emerald-50 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Manage Menu
                </Link>
                <button className="w-full p-4 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Set Availability
                </button>
                <Link
                  to="/profile"
                  className="w-full p-4 bg-purple-50 text-purple-700 rounded-xl font-semibold hover:bg-purple-100 transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-lg font-bold mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Total Orders</span>
                  <span className="text-2xl font-black">156</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Total Earnings</span>
                  <span className="text-2xl font-black">₹48,900</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Avg Rating</span>
                  <span className="text-2xl font-black">4.8 ⭐</span>
                </div>
              </div>
            </div>

            {/* Top Dishes */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Dishes</h3>
              <div className="space-y-3">
                {[
                  { name: 'Grilled Chicken Salad', orders: 45 },
                  { name: 'Quinoa Buddha Bowl', orders: 38 },
                  { name: 'Protein Smoothie Bowl', orders: 32 }
                ].map((dish, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{dish.name}</div>
                      <div className="text-xs text-gray-500">{dish.orders} orders</div>
                    </div>
                    <div className="text-2xl">🍽️</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
