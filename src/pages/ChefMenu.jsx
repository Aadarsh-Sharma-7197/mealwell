import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Image as ImageIcon, Tag } from 'lucide-react';

export default function ChefMenu() {
  const [showAddModal, setShowAddModal] = useState(false);

  const menuItems = [
    {
      id: 1,
      name: 'Grilled Chicken Salad',
      category: 'Lunch',
      price: 350,
      calories: 450,
      protein: 35,
      carbs: 30,
      fats: 18,
      tags: ['High Protein', 'Low Carb'],
      available: true,
      image: '🥗'
    },
    {
      id: 2,
      name: 'Quinoa Buddha Bowl',
      category: 'Lunch',
      price: 380,
      calories: 480,
      protein: 28,
      carbs: 52,
      fats: 16,
      tags: ['Vegan', 'High Fiber'],
      available: true,
      image: '🥙'
    },
    {
      id: 3,
      name: 'Protein Oatmeal Bowl',
      category: 'Breakfast',
      price: 280,
      calories: 380,
      protein: 25,
      carbs: 45,
      fats: 12,
      tags: ['High Protein', 'Vegetarian'],
      available: false,
      image: '🥣'
    },
    {
      id: 4,
      name: 'Baked Salmon & Veggies',
      category: 'Dinner',
      price: 520,
      calories: 520,
      protein: 40,
      carbs: 35,
      fats: 22,
      tags: ['Omega-3', 'Heart Healthy'],
      available: true,
      image: '🍱'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Menu Management</h1>
            <p className="text-gray-600">Manage your dishes and pricing</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 mt-4 md:mt-0"
          >
            <Plus className="w-5 h-5" />
            Add New Dish
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Total Dishes</div>
            <div className="text-3xl font-black text-gray-900">24</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Available</div>
            <div className="text-3xl font-black text-emerald-600">18</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Avg Price</div>
            <div className="text-3xl font-black text-gray-900">₹385</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Orders Today</div>
            <div className="text-3xl font-black text-blue-600">12</div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-emerald-400 to-green-500 p-6 text-center">
                <div className="text-6xl mb-2">{item.image}</div>
                {!item.available && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    Unavailable
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                    <span className="text-sm text-gray-500">{item.category}</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-600">₹{item.price}</div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Macros */}
                <div className="grid grid-cols-4 gap-2 mb-4 pb-4 border-b border-gray-100">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{item.calories}</div>
                    <div className="text-xs text-gray-500">Cal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{item.protein}g</div>
                    <div className="text-xs text-gray-500">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{item.carbs}g</div>
                    <div className="text-xs text-gray-500">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{item.fats}g</div>
                    <div className="text-xs text-gray-500">Fats</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {/* Toggle Availability */}
                <label className="flex items-center justify-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.available}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-gray-700">Available for orders</span>
                </label>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Dish Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-6">Add New Dish</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dish Name</label>
                  <input
                    type="text"
                    placeholder="Enter dish name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all">
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                      <option>Snack</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      placeholder="350"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
                    <input
                      type="number"
                      placeholder="450"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
                    <input
                      type="number"
                      placeholder="35"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
                    <input
                      type="number"
                      placeholder="30"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fats (g)</label>
                    <input
                      type="number"
                      placeholder="18"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Describe your dish..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-all cursor-pointer">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {['Vegan', 'High Protein', 'Low Carb', 'Gluten-Free', 'Diabetic-Friendly'].map(tag => (
                      <label key={tag} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-emerald-50 transition-all">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm font-semibold text-gray-700">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  Add Dish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
