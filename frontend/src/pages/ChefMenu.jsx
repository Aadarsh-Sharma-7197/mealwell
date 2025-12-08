import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Tag,
  Save,
  X,
} from "lucide-react";
import api from "../api/axios";

export default function ChefMenu() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dishes, setDishes] = useState([]);

  const [newDish, setNewDish] = useState({
    name: "",
    category: "Lunch",
    price: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    description: "",
    tags: [],
    available: true,
    image: "",
  });

  const [editingDish, setEditingDish] = useState(null);

  const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dishes");
      if (response.data.success) {
        setDishes(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching dishes:", err);
      setError("Failed to load dishes");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDish((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingDish(null);
    setNewDish({
      name: "",
      category: "Lunch",
      price: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
      description: "",
      tags: [],
      available: true,
      image: "",
    });
    setShowAddModal(true);
  };

  const openEditModal = (dish) => {
    setEditingDish(dish);
    setNewDish({
      name: dish.name,
      category: dish.category,
      price: dish.price,
      calories: dish.nutritionalInfo?.calories || "",
      protein: dish.nutritionalInfo?.protein || "",
      carbs: dish.nutritionalInfo?.carbs || "",
      fats: dish.nutritionalInfo?.fats || "",
      description: dish.description || "",
      tags: dish.tags || [],
      available: dish.isAvailable,
      image: dish.image || "",
    });
    setShowAddModal(true);
  };

  const handleSaveDish = async () => {
    try {
      // Format data for backend
      const dishData = {
        name: newDish.name,
        category: newDish.category,
        price: Number(newDish.price),
        description: newDish.description,
        isAvailable: newDish.available,
        nutritionalInfo: {
          calories: Number(newDish.calories),
          protein: Number(newDish.protein),
          carbs: Number(newDish.carbs),
          fats: Number(newDish.fats),
        },
        tags: newDish.tags,
        image: newDish.image,
      };

      if (editingDish) {
        // Update existing dish
        const response = await api.patch(
          `/dishes/${editingDish._id}`,
          dishData
        );

        if (response.data.success) {
          setDishes(
            dishes.map((d) =>
              d._id === editingDish._id ? response.data.data : d
            )
          );
          setShowAddModal(false);
          setEditingDish(null);
        }
      } else {
        // Add new dish
        const response = await api.post("/dishes", dishData);

        if (response.data.success) {
          setDishes([response.data.data, ...dishes]);
          setShowAddModal(false);
        }
      }

      // Reset form
      setNewDish({
        name: "",
        category: "Lunch",
        price: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
        description: "",
        tags: [],
        available: true,
        image: "",
      });
    } catch (err) {
      console.error("Error saving dish:", err);
      alert("Failed to save dish");
    }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;

    try {
      const response = await api.delete(`/dishes/${id}`);

      if (response.data.success) {
        setDishes(dishes.filter((d) => d._id !== id));
      }
    } catch (err) {
      console.error("Error deleting dish:", err);
      alert("Failed to delete dish");
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await api.patch(`/dishes/${id}`, { isAvailable: !currentStatus });

      setDishes(
        dishes.map((d) =>
          d._id === id ? { ...d, isAvailable: !currentStatus } : d
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Menu Management
            </h1>
            <p className="text-gray-600">Manage your dishes and pricing</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal}
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
            <div className="text-3xl font-black text-gray-900">
              {dishes.length}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Available</div>
            <div className="text-3xl font-black text-emerald-600">
              {dishes.filter((d) => d.isAvailable).length}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Avg Price</div>
            <div className="text-3xl font-black text-gray-900">
              ₹
              {dishes.length > 0
                ? Math.round(
                    dishes.reduce((acc, curr) => acc + curr.price, 0) /
                      dishes.length
                  )
                : 0}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your menu...</p>
          </div>
        ) : (
          /* Menu Items Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Header */}
                <div className="relative bg-gradient-to-br from-emerald-400 to-green-500 p-6 text-center">
                  <div className="text-6xl mb-2">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      "🍽️"
                    )}
                  </div>
                  {!item.isAvailable && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      Unavailable
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600">
                      ₹{item.price}
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-4 gap-2 mb-4 pb-4 border-b border-gray-100">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">
                        {item.nutritionalInfo?.calories}
                      </div>
                      <div className="text-xs text-gray-500">Cal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">
                        {item.nutritionalInfo?.protein}g
                      </div>
                      <div className="text-xs text-gray-500">Prot</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">
                        {item.nutritionalInfo?.carbs}g
                      </div>
                      <div className="text-xs text-gray-500">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">
                        {item.nutritionalInfo?.fats}g
                      </div>
                      <div className="text-xs text-gray-500">Fats</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDish(item._id)}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>

                  {/* Toggle Availability */}
                  <label className="flex items-center justify-center gap-2 mt-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      onChange={() =>
                        handleToggleAvailability(item._id, item.isAvailable)
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Available for orders
                    </span>
                  </label>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Dish Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-gray-900">
                  {editingDish ? "Edit Dish" : "Add New Dish"}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dish Name
                  </label>
                  <input
                    name="name"
                    value={newDish.name}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter dish name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={newDish.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      name="price"
                      value={newDish.price}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="350"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Calories
                    </label>
                    <input
                      name="calories"
                      value={newDish.calories}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="450"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Protein (g)
                    </label>
                    <input
                      name="protein"
                      value={newDish.protein}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="35"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Carbs (g)
                    </label>
                    <input
                      name="carbs"
                      value={newDish.carbs}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="30"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fats (g)
                    </label>
                    <input
                      name="fats"
                      value={newDish.fats}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="18"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newDish.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe your dish..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>

                <button
                  onClick={handleSaveDish}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                >
                  {editingDish ? "Save Changes" : "Add Dish to Menu"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
