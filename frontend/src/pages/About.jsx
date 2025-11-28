import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Heart, Users, TrendingUp, Award, Zap, Target } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Brain,
      title: 'AI-Powered Innovation',
      description: 'Cutting-edge technology creates personalized nutrition plans tailored to your unique needs',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Verified chefs and rigorous quality checks guarantee safe, hygienic meals',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Health First',
      description: 'Your wellness is our priority. Every meal is crafted with nutrition science',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a supportive community of health-conscious individuals on similar journeys',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: Users },
    { number: '500+', label: 'Verified Chefs', icon: Award },
    { number: '50,000+', label: 'Meals Delivered', icon: TrendingUp },
    { number: '4.8/5', label: 'Average Rating', icon: Target }
  ];

  const team = [
    {
      name: 'Aadarsh Sharma',
      role: 'Developer',
      image: '',
      bio: ''
    },
    {
      name: 'Aman Gupta',
      role: 'Developer',
      image: '',
      bio: ''
    },
    {
      name: 'Abhilasha Sharma',
      role: 'Developer',
      image: '',
      bio: ''
    },
    {
      name: 'Nikhil Gupta',
      role: 'Developer',
      image: '',
      bio: ''
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-500 to-green-600 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Revolutionizing Personal Nutrition
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              MealWell combines cutting-edge AI technology with the warmth of home-cooked meals to deliver personalized nutrition that fits your lifestyle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe everyone deserves access to personalized, nutritious meals that support their health goals. By connecting local home chefs with health-conscious individuals, we're building a sustainable food ecosystem that benefits everyone.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our AI-powered platform analyzes your unique health profile, dietary preferences, and lifestyle to create meal plans that actually work for you—not generic one-size-fits-all solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop"
                alt="Chef preparing meal"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl">
                <div className="text-4xl font-black text-emerald-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Fresh & Healthy</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-emerald-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600">Numbers that speak for themselves</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate individuals working to make healthy eating accessible to everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <div className="text-emerald-600 font-semibold mb-3">{member.role}</div>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-green-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">Join Our Journey</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
              Whether you're looking to improve your health or share your culinary skills, there's a place for you at MealWell
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup"
                className="px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all"
              >
                Get Started as Customer
              </a>
              <a 
                href="/become-chef"
                className="px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                Become a Chef
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
