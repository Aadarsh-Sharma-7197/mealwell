import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Star,
  MapPin,
  Award,
  TrendingUp,
  ChefHat,
  Heart,
  Filter,
  Search,
  X,
  Check,
  ArrowRight,
  Sparkles,
  Flame,
  Eye,
} from "lucide-react";

export default function BrowseChefs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dietPlan, userProfile } = location.state || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedChef, setSelectedChef] = useState(null);
  const [filterNearby, setFilterNearby] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Menu View State
  const [viewingMenu, setViewingMenu] = useState(null); // Chef object
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  useEffect(() => {
    // Get user location for nearby filter
    if (filterNearby && !userLocation) {
      getUserLocation();
    }
    fetchChefs();
  }, [selectedLocation, selectedCuisine, selectedSpecialty, searchQuery, filterNearby]);

  const getUserLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Try to get city name from reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'MealWell/1.0',
                  'Referer': window.location.origin
                }
              }
            );
            const data = await response.json();
            const city = data?.address?.city || data?.address?.town || data?.address?.municipality || '';
            setUserLocation({
              lat: latitude,
              lng: longitude,
              city: city,
            });
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            setUserLocation({
              lat: latitude,
              lng: longitude,
              city: '',
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enable location access to use nearby filter.");
          setFilterNearby(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setFilterNearby(false);
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedLocation !== "all") params.location = selectedLocation;
      if (selectedCuisine !== "all") params.cuisine = selectedCuisine;
      if (selectedSpecialty !== "all") params.specialty = selectedSpecialty;
      if (searchQuery && !filterNearby) params.location = searchQuery; // Search by location for now as per controller

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/chefs`,
        {
          params,
        }
      );

      // Transform data to match UI expectations if needed
      let formattedChefs = response.data.data.map((chef) => ({
        id: chef._id,
        name: chef.userId?.name || "Chef",
        image:
          chef.coverImage ||
          chef.userId?.profile?.avatar ||
          "https://via.placeholder.com/400",
        rating: chef.rating,
        reviews: chef.reviews || 0,
        mealsDelivered: chef.mealsDelivered || 0,
        location: chef.location,
        cuisines: chef.cuisines,
        specialties: chef.specialties,
        pricePerMeal: chef.pricePerMeal,
        experience: chef.experienceYears,
        verified: true, // Assuming all are verified for now
        availability: chef.isAvailable,
        signatureDishes: chef.signatureDishes || [],
        bio: chef.userId?.profile?.bio || "No bio available",
        // Add coordinates if available (for distance calculation)
        coordinates: chef.coordinates || null,
      }));

      // Filter nearby chefs if enabled
      if (filterNearby && userLocation) {
        // Geocode chef locations and calculate distances
        const chefsWithDistance = await Promise.all(
          formattedChefs.map(async (chef) => {
            try {
              // Geocode chef location
              const chefLocationStr = encodeURIComponent(chef.location || '');
              const geocodeResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${chefLocationStr}&limit=1`,
                {
                  headers: {
                    'User-Agent': 'MealWell/1.0',
                    'Referer': window.location.origin
                  }
                }
              );
              
              if (geocodeResponse.ok) {
                const geocodeData = await geocodeResponse.json();
                if (geocodeData && geocodeData.length > 0) {
                  const chefLat = parseFloat(geocodeData[0].lat);
                  const chefLng = parseFloat(geocodeData[0].lon);
                  const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    chefLat,
                    chefLng
                  );
                  return { ...chef, distance };
                }
              }
              
              // Fallback: simple city matching
              const chefCity = (chef.location || "").toLowerCase();
              const userCity = (userLocation.city || "").toLowerCase();
              const isSameCity = chefCity.includes(userCity) || userCity.includes(chefCity);
              return { ...chef, distance: isSameCity ? 5 : 50 };
            } catch (error) {
              console.error(`Error geocoding chef ${chef.name}:`, error);
              // Fallback: simple city matching
              const chefCity = (chef.location || "").toLowerCase();
              const userCity = (userLocation.city || "").toLowerCase();
              const isSameCity = chefCity.includes(userCity) || userCity.includes(chefCity);
              return { ...chef, distance: isSameCity ? 5 : 50 };
            }
          })
        );
        
        // Filter and sort by distance
        formattedChefs = chefsWithDistance
          .filter((chef) => chef.distance <= 20) // Within 20km
          .sort((a, b) => (a.distance || 0) - (b.distance || 0)); // Sort by distance
      }

      setChefs(formattedChefs);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching chefs:", err);
      setError("Failed to load chefs");
      setLoading(false);
    }
  };

  const handleViewMenu = async (chef) => {
    setViewingMenu(chef);
    setLoadingMenu(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dishes/chef/${chef.id}`
      );
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
      alert("Failed to load menu");
    } finally {
      setLoadingMenu(false);
    }
  };

  // Handle chef selection with diet plan
  const handleSelectChef = (chef) => {
    setSelectedChef(chef);

    // Navigate to address selection with both chef and diet plan data
    navigate("/address-selection", {
      state: {
        chef: chef,
        dietPlan: dietPlan,
        userProfile: userProfile,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Diet Plan Banner (if coming from diet plan creation) */}
        {dietPlan && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-6 md:p-8 shadow-2xl text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6" />
                    <h3 className="text-2xl font-black">
                      Your Personalized Diet Plan
                    </h3>
                  </div>
                  <p className="text-white/90 mb-4">
                    Find verified chefs who can prepare meals matching your
                    nutritional goals
                  </p>
                </div>
                <div className="text-right bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-4xl font-black">{dietPlan.calories}</div>
                  <div className="text-sm opacity-90">Daily Calories</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm opacity-90">Protein</span>
                  </div>
                  <div className="text-2xl font-bold">{dietPlan.protein}g</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm opacity-90">Carbs</span>
                  </div>
                  <div className="text-2xl font-bold">{dietPlan.carbs}g</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm opacity-90">Fats</span>
                  </div>
                  <div className="text-2xl font-bold">{dietPlan.fats}g</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm opacity-90">BMI</span>
                  </div>
                  <div className="text-2xl font-bold">{dietPlan.bmi}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {dietPlan ? "Select Your Chef" : "Browse Our Verified Chefs"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {dietPlan
              ? "Choose a verified chef who matches your dietary requirements and goals"
              : "All chefs are background-verified with proven expertise in healthy meal preparation"}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, cuisine, or specialty..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                if (!filterNearby) {
                  setFilterNearby(true);
                } else {
                  setFilterNearby(false);
                  setUserLocation(null);
                }
              }}
              className={`px-6 py-3 border-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                filterNearby
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-gray-200 hover:border-emerald-500"
              }`}
            >
              <MapPin className="w-5 h-5" />
              {filterNearby ? "Nearby Chefs" : "Filter Nearby"}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-emerald-500 transition-all flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>

        {/* Chef Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chefs.map((chef, index) => (
            <motion.div
              key={chef.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group"
            >
              {/* Chef Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {chef.verified && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Verified
                  </div>
                )}
                {chef.availability && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Available Now
                  </div>
                )}
              </div>

              {/* Chef Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">
                      {chef.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      {chef.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-bold text-gray-900">
                        {Number(chef.rating).toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {chef.reviews} reviews
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {chef.bio}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                      <TrendingUp className="w-4 h-4" />
                      Meals Delivered
                    </div>
                    <div className="font-bold text-gray-900">
                      {chef.mealsDelivered}+
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                      <Award className="w-4 h-4" />
                      Experience
                    </div>
                    <div className="font-bold text-gray-900">
                      {chef.experience} years
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-2 font-semibold">
                    Specialties
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {chef.specialties.map((specialty, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewMenu(chef)}
                      className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Menu
                    </button>
                    <button
                      onClick={() => handleSelectChef(chef)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Book
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Menu Modal */}
      <AnimatePresence>
        {viewingMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setViewingMenu(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {viewingMenu.name}'s Menu
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Delicious home-cooked meals
                  </p>
                </div>
                <button
                  onClick={() => setViewingMenu(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                {loadingMenu ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading menu...</p>
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No dishes available yet.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {menuItems.map((dish) => (
                      <div
                        key={dish._id}
                        className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all flex gap-4"
                      >
                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {dish.image ? (
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              🍲
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-gray-900 line-clamp-1">
                              {dish.name}
                            </h3>
                            <span className="text-emerald-600 font-bold">
                              ₹{dish.price}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                            {dish.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {dish.tags?.map((tag, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                  onClick={() => {
                    handleSelectChef(viewingMenu);
                    setViewingMenu(null);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Book This Chef
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
