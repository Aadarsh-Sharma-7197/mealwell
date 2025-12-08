import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Crown, Zap, Utensils } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Plans() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { chef, dietPlan, deliveryAddress } = location.state || {};

  // Calculate meals per day based on diet plan
  const mealsPerDay = dietPlan?.mealsPerDay || 3;
  const selectedMealTypes = dietPlan?.selectedMealTypes || [
    "breakfast",
    "lunch",
    "dinner",
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/plans`
        );
        if (response.data.success) {
          const mappedPlans = response.data.data.map((plan) => {
            let icon = Zap;
            let color = "from-blue-500 to-cyan-500";
            let popular = false;

            if (plan.planId === "monthly") {
              icon = Crown;
              color = "from-emerald-500 to-green-600";
              popular = true;
            } else if (plan.planId === "quarterly") {
              icon = Sparkles;
              color = "from-purple-500 to-pink-500";
            }

            // Adjust price based on meals per day (assuming backend price is for 3 meals)
            const priceMultiplier = mealsPerDay / 3;
            const adjustedPrice = Math.round(plan.price * priceMultiplier);
            const adjustedOriginalPrice = plan.originalPrice
              ? Math.round(plan.originalPrice * priceMultiplier)
              : null;

            const days =
              plan.planId === "weekly"
                ? 7
                : plan.planId === "monthly"
                ? 30
                : 90;

            return {
              id: plan.planId,
              name: plan.name,
              description: plan.description,
              price: {
                weekly: plan.planId === "weekly" ? adjustedPrice : null,
                monthly: plan.planId === "monthly" ? adjustedPrice : null,
                quarterly: plan.planId === "quarterly" ? adjustedPrice : null,
              },
              originalPrice: adjustedOriginalPrice,
              savings: plan.discount ? `${plan.discount}% off` : null,
              features: plan.features,
              notIncluded: [], // Backend doesn't provide this yet
              icon,
              color,
              popular,
              totalMeals: days * mealsPerDay,
            };
          });
          setPlans(mappedPlans);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [mealsPerDay]);

  const handleSelectPlan = (plan) => {
    if (!plan) {
      console.error("No plan selected");
      alert("No plan selected. Please try again.");
      return;
    }

    // Create a serializable plan object (remove any functions or circular references)
    const serializablePlan = {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      originalPrice: plan.originalPrice,
      savings: plan.savings,
      features: plan.features,
      notIncluded: plan.notIncluded || [],
      totalMeals: plan.totalMeals,
      popular: plan.popular,
    };

    const navigationState = {
      selectedPlan: serializablePlan,
      chef: chef
        ? {
            id: chef.id,
            name: chef.name,
            location: chef.location,
            pricePerMeal: chef.pricePerMeal,
            rating: chef.rating,
            cuisines: chef.cuisines,
            specialties: chef.specialties,
          }
        : null,
      dietPlan: dietPlan
        ? {
            id: dietPlan.id,
            mealsPerDay: dietPlan.mealsPerDay,
            selectedMealTypes: dietPlan.selectedMealTypes,
            calories: dietPlan.calories,
            protein: dietPlan.protein,
            carbs: dietPlan.carbs,
            fats: dietPlan.fats,
          }
        : null,
      deliveryAddress: deliveryAddress || null,
    };

    if (!isAuthenticated) {
      navigate("/signup", {
        state: {
          from: "/plans",
          returnState: navigationState,
        },
      });
    } else {
      navigate("/checkout", {
        state: navigationState,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

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
            Affordable meal plans designed for your health goals. No per-meal
            charges, just simple pricing.
          </p>

          {/* Value Proposition */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 font-semibold">
            <Sparkles className="w-5 h-5" />
            <span>Save up to ₹5,000 with quarterly plan</span>
          </div>
        </motion.div>

        {/* Selected Plan Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-12 max-w-4xl mx-auto border border-emerald-100"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Utensils className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-gray-900">
                  Your Custom Configuration
                </h3>
                <p className="text-gray-600">
                  <span className="font-bold text-gray-900">
                    {mealsPerDay} Meals
                  </span>{" "}
                  per day
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedMealTypes.map((type) => (
                <span
                  key={type}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold capitalize border border-emerald-200 shadow-sm"
                >
                  {type}
                </span>
              ))}
            </div>
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
                plan.popular
                  ? "border-emerald-500 scale-105"
                  : "border-gray-200"
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
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                {/* Plan Details */}
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                {/* Pricing */}
                <div className="mb-6">
                  {plan.originalPrice && (
                    <div className="text-lg text-gray-400 line-through">
                      ₹{plan.originalPrice}
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-gray-900">
                      ₹
                      {plan.price.weekly ||
                        plan.price.monthly ||
                        plan.price.quarterly}
                    </span>
                    <span className="text-gray-600">
                      /
                      {plan.id === "weekly"
                        ? "week"
                        : plan.id === "monthly"
                        ? "month"
                        : "3 months"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    ≈ ₹
                    {Math.round(
                      (plan.price.weekly ||
                        plan.price.monthly ||
                        plan.price.quarterly) / plan.totalMeals
                    )}{" "}
                    per meal
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectPlan(plan);
                  }}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:scale-105"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  {isAuthenticated ? "Select Plan" : "Get Started"}
                </button>

                {/* Features */}
                <div className="space-y-3">
                  <div className="font-bold text-gray-900 mb-3">
                    What's included:
                  </div>
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
                        <div
                          key={i}
                          className="flex items-start gap-3 opacity-50"
                        >
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500 text-sm">
                            {feature}
                          </span>
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
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
            Detailed Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">
                    Features
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">
                    Weekly
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">
                    Monthly
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">
                    Quarterly
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Total Meals",
                    values: [
                      `${7 * mealsPerDay}`,
                      `${30 * mealsPerDay}`,
                      `${90 * mealsPerDay}`,
                    ],
                  },
                  {
                    feature: "Price per meal",
                    values: ["₹119", "₹100", "₹93"],
                  },
                  { feature: "AI Meal Planning", values: [true, true, true] },
                  {
                    feature: "Priority Chef Selection",
                    values: [false, true, true],
                  },
                  {
                    feature: "Advanced Analytics",
                    values: [false, true, true],
                  },
                  {
                    feature: "Nutrition Consultation",
                    values: [false, false, true],
                  },
                  { feature: "Meal Rollover", values: [false, false, true] },
                  { feature: "Family Discount", values: [false, false, true] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-700">
                      {row.feature}
                    </td>
                    {row.values.map((value, j) => (
                      <td key={j} className="text-center py-4 px-4">
                        {typeof value === "boolean" ? (
                          value ? (
                            <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="font-semibold text-gray-900">
                            {value}
                          </span>
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
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel or pause my plan anytime?",
                a: "Yes! You can pause or cancel your plan anytime. No questions asked.",
              },
              {
                q: "What if I need to skip meals?",
                a: "You can skip meals up to 2 days in advance. Quarterly plan members get meal rollover.",
              },
              {
                q: "Are the chefs really verified?",
                a: "Absolutely! All our chefs are verified and background checked for your safety.",
              },
              {
                q: "Can I customize my meals?",
                a: "Yes! Our AI considers your preferences, allergies, and dietary restrictions.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
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
