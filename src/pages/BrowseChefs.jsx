import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, Award, ChefHat, Heart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrowseChefs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const cuisines = ['All', 'Indian', 'Continental', 'Asian', 'Mediterranean', 'Vegan', 'Keto'];
  const specialties = ['All', 'Diabetic-Friendly', 'Heart-Healthy', 'Weight Loss', 'High Protein', 'Low Sodium'];

  const chefs = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 4.9,
      reviews: 234,
      location: 'South Delhi',
      specialty: 'Diabetic-Friendly',
      cuisine: 'Indian',
      mealsDelivered: 1200,
      experience: '8 years',
      avatar: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=300&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
      signature: 'Low-GI Thali',
      price: '₹350/meal',
      available: true
    },
    {
      id: 2,
      name: 'Raj Patel',
      rating: 4.8,
      reviews: 189,
      location: 'Gurgaon',
      specialty: 'Weight Loss',
      cuisine: 'Continental',
      mealsDelivered: 980,
      experience: '6 years',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop',
      signature: 'Keto Power Bowl',
      price: '₹400/meal',
      available: true
    },
    {
      id: 3,
      name: 'Sarah Kumar',
      rating: 4.9,
      reviews: 312,
      location: 'Noida',
      specialty: 'High Protein',
      cuisine: 'Asian',
      mealsDelivered: 1450,
      experience: '10 years',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop',
      signature: 'Protein Buddha Bowl',
      price: '₹380/meal',
      available: false
    },
    {
      id: 4,
      name: 'Amit Singh',
      rating: 4.7,
      reviews: 156,
      location: 'East Delhi',
      specialty: 'Heart-Healthy',
      cuisine: 'Mediterranean',
      mealsDelivered: 890,
      experience: '5 years',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop',
      signature: 'Mediterranean Platter',
      price: '₹420/meal',
      available: true
    },
    {
      id: 5,
      name: 'Anjali Verma',
      rating: 5.0,
      reviews: 278,
      location: 'West Delhi',
      specialty: 'Vegan',
      cuisine: 'Vegan',
      mealsDelivered: 1320,
      experience: '7 years',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop',
      signature: 'Plant-Based Delight',
      price: '₹360/meal',
      available: true
    },
    {
      id: 6,
      name: 'Karan Malhotra',
      rating: 4.8,
      reviews: 201,
      location: 'Central Delhi',
      specialty: 'Low Sodium',
      cuisine: 'Indian',
      mealsDelivered: 1050,
      experience: '9 years',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=600&auto=format&fit=crop',
      signature: 'Heart Care Thali',
      price: '₹370/meal',
      available: true
    }
  ];

  const filteredChefs = chefs.filter(chef => {
    const matchesSearch = chef.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chef.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || chef.cuisine === selectedCuisine;
    const matchesSpecialty = selectedSpecialty === 'All' || chef.specialty === selectedSpecialty;
    return matchesSearch && matchesCuisine && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Browse Verified <span className="text-emerald-600">Chefs</span>
          </h1>
          <p className="text-lg text-gray-600">Find the perfect chef for your dietary needs</p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            {/* Cuisine Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all appearance-none"
              >
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine} Cuisine</option>
                ))}
              </select>
            </div>

            {/* Specialty Filter */}
            <div className="relative">
              <Heart className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all appearance-none"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredChefs.length}</span> verified chefs
          </p>
        </div>

        {/* Chef Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChefs.map((chef, i) => (
            <motion.div
              key={chef.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all overflow-hidden group"
            >
              {/* Header with Cover & Avatar */}
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={chef.coverImage}
                  alt={`${chef.name}'s dishes`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {!chef.available && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    Unavailable
                  </div>
                )}
                
                {/* Avatar */}
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                    <img 
                      src={chef.avatar}
                      alt={chef.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-16 p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-black text-gray-900 mb-1">{chef.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{chef.location}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold text-gray-900">{chef.rating}</span>
                  <span className="text-sm text-gray-500">({chef.reviews} reviews)</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                    {chef.cuisine}
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
                    {chef.specialty}
                  </span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                    ✓ Verified
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ChefHat className="w-4 h-4 text-emerald-500" />
                    <span>{chef.mealsDelivered}+ meals</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>{chef.experience}</span>
                  </div>
                </div>

                {/* Signature Dish */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Signature Dish</div>
                  <div className="font-bold text-gray-900">{chef.signature}</div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-black text-emerald-600">{chef.price}</div>
                  </div>
                  <Link
                    to={chef.available ? "/checkout" : "#"}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      chef.available
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    {chef.available ? 'Book Now' : 'Not Available'}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredChefs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No chefs found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
