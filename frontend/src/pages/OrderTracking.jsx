import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock, Truck, Home, Phone, MapPin } from 'lucide-react';
import MapView from '../components/MapView';

export default function OrderTracking() {
  const [activeOrder, setActiveOrder] = useState(1);

  const orders = [
    {
      id: 1,
      orderId: '#MW2847',
      meal: 'Grilled Chicken Salad',
      mealImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop',
      chef: 'Priya Sharma',
      chefImage: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=100&auto=format&fit=crop',
      status: 'preparing',
      estimatedTime: '25 mins',
      currentStep: 2,
      address: '123, Green Park, New Delhi - 110016',
      phone: '+91 98765 43210'
    },
    {
      id: 2,
      orderId: '#MW2846',
      meal: 'Quinoa Buddha Bowl',
      mealImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop',
      chef: 'Raj Patel',
      chefImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&auto=format&fit=crop',
      status: 'delivered',
      deliveredAt: '12:45 PM',
      currentStep: 4,
      address: '123, Green Park, New Delhi - 110016',
      phone: '+91 98765 43210'
    }
  ];

  const currentOrder = orders.find(o => o.id === activeOrder);

  const trackingSteps = [
    { id: 1, label: 'Order Confirmed', icon: CheckCircle, time: '12:00 PM' },
    { id: 2, label: 'Chef Preparing', icon: Clock, time: '12:15 PM' },
    { id: 3, label: 'Out for Delivery', icon: Truck, time: currentOrder.status === 'delivered' ? '12:30 PM' : 'Pending' },
    { id: 4, label: 'Delivered', icon: Home, time: currentOrder.status === 'delivered' ? currentOrder.deliveredAt : 'Pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Real-time updates on your meal delivery</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Active Orders</h2>
              <div className="space-y-3">
                {orders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => setActiveOrder(order.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                      activeOrder === order.id
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={order.mealImage}
                        alt={order.meal}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-grow">
                        <div className="font-bold text-gray-900">{order.orderId}</div>
                        <div className="text-sm text-gray-600">{order.meal}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img 
                        src={order.chefImage}
                        alt={order.chef}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="text-xs text-gray-500">by {order.chef}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Address</div>
                    <div className="text-sm font-semibold text-gray-900">{currentOrder.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Contact</div>
                    <div className="text-sm font-semibold text-gray-900">{currentOrder.phone}</div>
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
                <img 
                  src={currentOrder.mealImage}
                  alt={currentOrder.meal}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                />
                <div className="flex-grow">
                  <h2 className="text-2xl font-black text-gray-900 mb-1">{currentOrder.meal}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <img 
                      src={currentOrder.chefImage}
                      alt={currentOrder.chef}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>Prepared by {currentOrder.chef}</span>
                  </div>
                  <div className="text-sm text-gray-500">Order ID: {currentOrder.orderId}</div>
                </div>
              </div>

              {/* Estimated Time */}
              {currentOrder.status !== 'delivered' && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-emerald-700 mb-1">Estimated Delivery</div>
                      <div className="text-3xl font-black text-emerald-600">{currentOrder.estimatedTime}</div>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <Clock className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Tracking Steps */}
              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const isCompleted = step.id <= currentOrder.currentStep;
                  const isActive = step.id === currentOrder.currentStep;

                  return (
                    <div key={step.id} className="relative">
                      {/* Connector Line */}
                      {index < trackingSteps.length - 1 && (
                        <div className={`absolute left-6 top-12 w-1 h-20 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                        }`} />
                      )}

                      {/* Step */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-center gap-4 mb-8"
                      >
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-400'
                        } ${isActive ? 'ring-4 ring-emerald-200' : ''}`}>
                          <step.icon className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-bold ${
                              isCompleted ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </h3>
                            <span className={`text-sm font-semibold ${
                              isCompleted ? 'text-emerald-600' : 'text-gray-400'
                            }`}>
                              {step.time}
                            </span>
                          </div>
                          {isActive && currentOrder.status !== 'delivered' && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-emerald-600 font-medium mt-1"
                            >
                              In progress...
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map Component */}
            <MapView destination={currentOrder.address} />
          </div>
        </div>
      </div>
    </div>
  );
}
