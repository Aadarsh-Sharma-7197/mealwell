import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Calendar, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Aman Kumar',
    email: user?.email || 'aman@example.com',
    phone: user?.phone || '+91 98765 43210',
    address: '123, Green Park, New Delhi - 110016',
    bio: 'Health enthusiast on a journey to better nutrition',
    joinDate: 'January 2025',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&auto=format&fit=crop'
  });

  const stats = [
    { label: 'Days Active', value: '45', icon: Calendar, colorClass: 'bg-emerald-100', iconColorClass: 'text-emerald-600' },
    { label: 'Meals Consumed', value: '120', icon: Award, colorClass: 'bg-blue-100', iconColorClass: 'text-blue-600' },
    { label: 'Weight Lost', value: '5.2 kg', icon: TrendingUp, colorClass: 'bg-orange-100', iconColorClass: 'text-orange-600' },
    { label: 'Streak', value: '23 days', icon: TrendingUp, colorClass: 'bg-purple-100', iconColorClass: 'text-purple-600' }
  ];

  const achievements = [
    { id: 1, title: '7 Day Streak', icon: '🔥', unlocked: true, date: 'Dec 20, 2025' },
    { id: 2, title: 'Lost 5kg', icon: '⚖️', unlocked: true, date: 'Dec 15, 2025' },
    { id: 3, title: 'Protein Master', icon: '💪', unlocked: true, date: 'Dec 10, 2025' },
    { id: 4, title: '30 Day Streak', icon: '🏆', unlocked: false, date: 'In Progress' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save to backend in production
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center sticky top-24">
              {/* Avatar */}
              <div className="relative inline-block mb-6">
                <img 
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-emerald-100"
                />
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-emerald-700 transition-all">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-1">{profileData.name}</h2>
              <p className="text-emerald-600 font-semibold mb-1 capitalize">{user?.type || 'Customer'} Member</p>
              <p className="text-sm text-gray-500 mb-6">Member since {profileData.joinDate}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-4">
                    <div className={`w-10 h-10 ${stat.colorClass} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon className={`w-5 h-5 ${stat.iconColorClass}`} />
                    </div>
                    <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all ${!isEditing && 'bg-gray-50'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all ${!isEditing && 'bg-gray-50'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all ${!isEditing && 'bg-gray-50'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all ${!isEditing && 'bg-gray-50'}`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  disabled={!isEditing}
                  rows="3"
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all ${!isEditing && 'bg-gray-50'}`}
                />
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: achievement.unlocked ? 1.05 : 1, rotate: achievement.unlocked ? 5 : 0 }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 shadow-lg cursor-pointer'
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="text-xs font-bold text-gray-900 mb-1">{achievement.title}</div>
                    <div className="text-xs text-gray-500">{achievement.date}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
