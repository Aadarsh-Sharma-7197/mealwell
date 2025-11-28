import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Crown, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Plans() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'weekly',
      name: 'Weekly Plan',
      description: 'Perfect for trying out',
      price: {
        weekly: 2499,
        monthly: null,
        quarterly: null
      },
      features: [
        '21 personalized meals',
        'AI nutrition planning',
        'Verified chefs',
        'Flexible delivery',
        'Basic health tracking',
        'Email support'
      ],
      notIncluded: [
        'Priority chef selection',
        'Advanced analytics',
        'Nutrition consultation'
      ],
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 'monthly',
      name: 'Monthly Plan',
      description: 'Most popular choice',
      price: {
        weekly: null,
        monthly: 8999,
        quarterly: null
      },
      originalPrice: 9999,
      savings: '10% off',
      features: [
        '90 personalized meals',
        'AI nutrition planning',
        'Verified chefs',
        'Flexible delivery schedule',
        'Advanced health tracking',
        'Priority chef selection',
        'Dedicated support',
        'Weekly progress reports',
        'Recipe access'
      ],
      notIncluded: [
        'Nutrition consultation',
        'Meal rollover'
      ],
      icon: Crown,
      color: 'from-emerald-500 to-green-600',
      popular: true
    },
    {
      id: 'quarterly',
      name: 'Quarterly Plan',
      description: 'Best value & commitment',
      price: {
        weekly: null,
        monthly: null,
        quarterly: 24999
      },
      originalPrice: 29999,
      savings: '17% off',
      features: [
        '270 personalized meals',
        'AI nutrition planning',
        'Verified chefs',
        'Flexible delivery schedule',
        'Advanced health tracking',
        'Priority chef selection',
        'VIP 24/7 support',
        'Weekly progress reports',
        'Full recipe library access',
        'Monthly nutrition consultation',
        'Meal rollover (up to 10 meals)',
        'Family plan discount',
        'Exclusive chef access'
      ],
      notIncluded: [],
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      popular: false
    }
  ];

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate('/signup');
    } else {
      navigate('/checkout', { state: { selectedPlan: plan } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            Choose Your <span className="text-emerald-600">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Affordable meal plans designed for your health goals. No per-meal charges, just simple pricing.
          </p>

          {/* Value Proposition */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 font-semibold">
            <Sparkles className="w-5 h-5" />
            <span>Save up to ₹5,000 with quarterly plan</span>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all hover:shadow-2xl ${
                plan.popular ? 'border-emerald-500 scale-105' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              {plan.savings && (
                <div className="absolute -top-4 -right-4 px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                  {plan.savings}
                </div>
              )}

              <div className="p-8">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                {/* Plan Details */}
                <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                {/* Pricing */}
                <div className="mb-6">
                  {plan.originalPrice && (
                    <div className="text-lg text-gray-400 line-through">₹{plan.originalPrice}</div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-gray-900">
                      ₹{plan.price.weekly || plan.price.monthly || plan.price.quarterly}
                    </span>
                    <span className="text-gray-600">
                      /{plan.id === 'weekly' ? 'week' : plan.id === 'monthly' ? 'month' : '3 months'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    ≈ ₹{Math.round((plan.price.weekly || plan.price.monthly || plan.price.quarterly) / (plan.id === 'weekly' ? 21 : plan.id === 'monthly' ? 90 : 270))} per meal
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-6 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {isAuthenticated ? 'Select Plan' : 'Get Started'}
                </button>

                {/* Features */}
                <div className="space-y-3">
                  <div className="font-bold text-gray-900 mb-3">What's included:</div>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded.length > 0 && (
                    <>
                      <div className="border-t border-gray-200 my-4" />
                      {plan.notIncluded.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 opacity-50">
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500 text-sm">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-16"
        >
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Detailed Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Features</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Weekly</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Monthly</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Quarterly</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Total Meals', values: ['21', '90', '270'] },
                  { feature: 'Price per meal', values: ['₹119', '₹100', '₹93'] },
                  { feature: 'AI Meal Planning', values: [true, true, true] },
                  { feature: 'Priority Chef Selection', values: [false, true, true] },
                  { feature: 'Advanced Analytics', values: [false, true, true] },
                  { feature: 'Nutrition Consultation', values: [false, false, true] },
                  { feature: 'Meal Rollover', values: [false, false, true] },
                  { feature: 'Family Discount', values: [false, false, true] }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-700">{row.feature}</td>
                    {row.values.map((value, j) => (
                      <td key={j} className="text-center py-4 px-4">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="font-semibold text-gray-900">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel or pause my plan anytime?',
                a: 'Yes! You can pause or cancel your plan anytime. No questions asked.'
              },
              {
                q: 'What if I need to skip meals?',
                a: 'You can skip meals up to 2 days in advance. Quarterly plan members get meal rollover.'
              },
              {
                q: 'Are the chefs really verified?',
                a: 'Absolutely! All our chefs are verified and background checked for your safety.'
              },
              {
                q: 'Can I customize my meals?',
                a: 'Yes! Our AI considers your preferences, allergies, and dietary restrictions.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
