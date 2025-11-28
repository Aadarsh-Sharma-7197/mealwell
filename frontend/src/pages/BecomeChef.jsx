import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, DollarSign, Clock, Home, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BecomeChef() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    specialization: ''
  });

  const benefits = [
    {
      icon: DollarSign,
      title: 'Earn ₹25,000 - ₹50,000/month',
      desc: 'Work from home and earn a stable income on your own schedule',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: Clock,
      title: 'Flexible Working Hours',
      desc: 'Choose when you cook. Perfect for housewives and part-timers',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Home,
      title: 'Work From Your Kitchen',
      desc: 'No need to travel. Cook delicious meals from the comfort of your home',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Build Your Reputation',
      desc: 'Get ratings and reviews. Build a loyal customer base',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: TrendingUp,
      title: 'Weekly Payments',
      desc: 'Get paid every week directly to your bank account',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: ChefHat,
      title: 'Free Training & Support',
      desc: 'We provide training, recipes, and 24/7 support',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Apply Online',
      desc: 'Fill out the simple application form with your details',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop'
    },
    {
      step: '02',
      title: 'Get Verified',
      desc: 'We verify your identity and help you with the registration process',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&auto=format&fit=crop'
    },
    {
      step: '03',
      title: 'Receive Orders',
      desc: 'Start receiving meal orders from customers in your area',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop'
    },
    {
      step: '04',
      title: 'Cook & Earn',
      desc: 'Prepare meals in your kitchen and earn money weekly',
      image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&auto=format&fit=crop'
    }
  ];

  const requirements = [
    'Must be 18 years or older',
    'Have a clean, well-equipped kitchen',
    'Basic cooking skills and passion for food',
    'Smartphone for order management',
    'Valid ID proof (Aadhaar/PAN)',
    'Bank account for payments',
    'Food safety knowledge'
  ];

  const testimonials = [
    {
      name: 'Sunita Sharma',
      location: 'Delhi',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop',
      earning: '₹35,000/month',
      quote: 'MealWell changed my life! I can now contribute to my family income while being at home with my kids.'
    },
    {
      name: 'Rekha Patel',
      location: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop',
      earning: '₹42,000/month',
      quote: 'The flexibility is amazing. I cook when I want and the payment is always on time!'
    },
    {
      name: 'Anjali Verma',
      location: 'Bangalore',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop',
      earning: '₹48,000/month',
      quote: 'Being a chef with MealWell gave me financial independence. Best decision ever!'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Chef Application:', formData);
    alert('Application submitted! We will contact you within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-500 to-green-600 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <ChefHat className="w-5 h-5" />
                <span className="text-sm font-semibold">Join 500+ Home Chefs</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Turn Your Cooking Skills Into Income
              </h1>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Perfect for housewives, home cooks, and anyone passionate about food. Earn ₹25,000-₹50,000/month from your own kitchen!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#apply"
                  className="px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all inline-flex items-center justify-center gap-2"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#how-it-works"
                  className="px-10 py-5 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all inline-flex items-center justify-center"
                >
                  Learn More
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop"
                alt="Chef cooking"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl">
                <div className="text-4xl font-black text-emerald-600 mb-1">₹35,000</div>
                <div className="text-sm text-gray-600">Avg. Monthly Earning</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Why Join <span className="text-emerald-600">MealWell</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We empower home cooks to build successful food businesses
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">Simple steps to start earning</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <div className="relative h-48">
                    <img 
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-emerald-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-24 bg-emerald-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-black text-gray-900 mb-4">Basic Requirements</h2>
              <p className="text-lg text-gray-600">Everything you need to get started</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {requirements.map((req, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-lg"
                >
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 font-medium">{req}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">Real chefs, real earnings</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover shadow-lg"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-3xl font-black text-emerald-600 mb-1">{testimonial.earning}</div>
                  <div className="text-sm text-gray-600">Monthly Earnings</div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-24 bg-gradient-to-br from-emerald-500 to-green-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to Start?</h2>
              <p className="text-xl opacity-90">Fill out the form below and we'll get back to you within 24 hours</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 focus:border-white focus:outline-none transition-all text-white placeholder-white/60"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 focus:border-white focus:outline-none transition-all text-white placeholder-white/60"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 focus:border-white focus:outline-none transition-all text-white placeholder-white/60"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 focus:border-white focus:outline-none transition-all text-white placeholder-white/60"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Cooking Experience</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 focus:border-white focus:outline-none transition-all text-white"
                  >
                    <option value="" className="text-gray-900">Select experience</option>
                    <option value="beginner" className="text-gray-900">Beginner (0-2 years)</option>
                    <option value="intermediate" className="text-gray-900">Intermediate (3-5 years)</option>
                    <option value="expert" className="text-gray-900">Expert (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Specialization</label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 focus:border-white focus:outline-none transition-all text-white"
                  >
                    <option value="" className="text-gray-900">Select cuisine</option>
                    <option value="indian" className="text-gray-900">Indian</option>
                    <option value="continental" className="text-gray-900">Continental</option>
                    <option value="asian" className="text-gray-900">Asian</option>
                    <option value="vegan" className="text-gray-900">Vegan/Vegetarian</option>
                    <option value="all" className="text-gray-900">All cuisines</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" required className="w-4 h-4" />
                  <span className="text-sm">I agree to the Terms & Conditions and Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-8 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-lg shadow-2xl hover:bg-emerald-50 transition-all"
              >
                Submit Application
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
