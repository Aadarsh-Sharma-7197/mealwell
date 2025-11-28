import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import AnimatedCard from '../components/ui/AnimatedCard';
import { Brain, Shield, Zap, Heart, TrendingUp, Users, ChefHat, Smartphone, ArrowRight, Star, Target } from 'lucide-react';

export default function Home({ isLoaded, setIsLoaded }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      
      <div className="bg-white">
        {/* Hero Section with Real Images */}
        <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 py-32 lg:py-10 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-8 border border-emerald-200"
                >
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-700">AI-Powered Nutrition Platform</span>
                </motion.div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                  Your Health,
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Personalized
                  </span>
                  <br />
                  & Delivered
                </h1>

                <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                  Freshly prepared meals by verified chefs, tailored to your unique health goals with AI precision. No planning, no cooking, just results.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/signup"
                      className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/browse-chefs"
                      className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 rounded-2xl font-bold text-lg hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                      Browse Chefs
                    </Link>
                  </motion.div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                  <div>
                    <div className="text-3xl font-black text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600 mt-1">Happy Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-gray-900">500+</div>
                    <div className="text-sm text-gray-600 mt-1">Verified Chefs</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-gray-900">50K+</div>
                    <div className="text-sm text-gray-600 mt-1">Meals Delivered</div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Hero Image Grid */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Large Image */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="col-span-2 relative rounded-3xl overflow-hidden shadow-2xl h-80"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop"
                      alt="Healthy Meal"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">AI-Personalized</div>
                          <div className="text-sm text-gray-600">Nutrition Plans</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Small Images */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative rounded-2xl overflow-hidden shadow-xl h-48"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop"
                      alt="Healthy Bowl"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white font-bold text-sm">450 kcal</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative rounded-2xl overflow-hidden shadow-xl h-48"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&auto=format&fit=crop"
                      alt="Salad Bowl"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white font-bold text-sm">Fresh Daily</div>
                    </div>
                  </motion.div>
                </div>

                {/* Floating Card */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Daily Goal</div>
                      <div className="text-sm font-bold text-gray-900">1,850 kcal</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                How <span className="text-emerald-600">MealWell</span> Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get started in 3 simple steps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Tell Us Your Goals',
                  desc: 'Share your health goals, dietary preferences, and lifestyle',
                  image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&auto=format&fit=crop',
                  icon: Target
                },
                {
                  step: '02',
                  title: 'AI Creates Your Plan',
                  desc: 'Our AI generates personalized weekly meal plans just for you',
                  image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&auto=format&fit=crop',
                  icon: Brain
                },
                {
                  step: '03',
                  title: 'Receive Fresh Meals',
                  desc: 'Local verified chefs prepare and deliver your meals',
                  image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&auto=format&fit=crop',
                  icon: ChefHat
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative group"
                >
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {item.step}
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                        <item.icon className="w-7 h-7 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Why Choose <span className="text-emerald-600">MealWell</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need for a healthier lifestyle
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI Meal Planning",
                  desc: "Smart algorithms create weekly plans based on your health data",
                  color: "from-emerald-500 to-green-500",
                  image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&auto=format&fit=crop"
                },
                {
                  icon: Shield,
                  title: "Verified Chefs",
                  desc: "Every chef is verified for quality and safety standards",
                  color: "from-blue-500 to-cyan-500",
                  image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop"
                },
                {
                  icon: Zap,
                  title: "Real-Time Tracking",
                  desc: "Monitor meals from kitchen to doorstep",
                  color: "from-orange-500 to-red-500",
                  image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&auto=format&fit=crop"
                },
                {
                  icon: Heart,
                  title: "Health Insights",
                  desc: "Connect wearables for personalized adjustments",
                  color: "from-pink-500 to-rose-500",
                  image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop"
                },
                {
                  icon: Users,
                  title: "Community Support",
                  desc: "Join groups and stay motivated together",
                  color: "from-purple-500 to-indigo-500",
                  image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&auto=format&fit=crop"
                },
                {
                  icon: TrendingUp,
                  title: "Progress Analytics",
                  desc: "Visual dashboards show your improvements",
                  color: "from-yellow-500 to-orange-500",
                  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop"
                }
              ].map((feature, i) => (
                <AnimatedCard key={feature.title} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full overflow-hidden group">
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className={`absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Success Stories
              </h2>
              <p className="text-lg text-gray-600">Real results from real people</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Amit Sharma",
                  role: "Lost 15kg in 3 months",
                  image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&auto=format&fit=crop",
                  text: "MealWell transformed my life! The personalized plans made healthy eating effortless."
                },
                {
                  name: "Priya Kumar",
                  role: "Diabetic patient",
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop",
                  text: "Managing diabetes has never been easier. The chefs understand my dietary restrictions perfectly."
                },
                {
                  name: "Rahul Singh",
                  role: "Fitness enthusiast",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
                  text: "Perfect for my muscle gain goals! High protein meals delivered fresh every day."
                }
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover shadow-lg"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-emerald-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{testimonial.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-emerald-600 to-green-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container mx-auto px-6 text-center relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Transform Your Health?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
              Join thousands who've already started their personalized nutrition journey
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  );
}
