const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("✅ Gemini AI initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Gemini AI:", error.message);
    genAI = null;
  }
} else {
  console.log("⚠️ GEMINI_API_KEY not found in environment variables");
}

// Helper to calculate BMR and TDEE
const calculateNutrition = (
  age,
  gender,
  height,
  weight,
  activityLevel,
  goal
) => {
  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender === "male" ? 5 : -161;

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));

  let targetCalories = tdee;
  if (goal === "lose_weight") targetCalories -= 500;
  if (goal === "gain_muscle") targetCalories += 500;

  // Macro split (approximate 30/35/35 split)
  const protein = Math.round((targetCalories * 0.3) / 4);
  const fats = Math.round((targetCalories * 0.35) / 9);
  const carbs = Math.round((targetCalories * 0.35) / 4);

  return { targetCalories, protein, fats, carbs, bmr, tdee };
};

const getFallbackPlan = (
  userData,
  selectedMealTypes = ["breakfast", "lunch", "dinner", "snacks"]
) => {
  const { age, gender, height, weight, activityLevel, goal } = userData;
  const { targetCalories, protein, fats, carbs, bmr, tdee } =
    calculateNutrition(age, gender, height, weight, activityLevel, goal);

  const mealVariations = {
    breakfast: [
      { name: "Oatmeal with berries & nuts", p: 15, c: 45, f: 10 },
      { name: "Scrambled Eggs with Spinach & Toast", p: 20, c: 30, f: 15 },
      { name: "Greek Yogurt Parfait with Granola", p: 25, c: 35, f: 5 },
    ],
    lunch: [
      { name: "Grilled Chicken Breast with Quinoa", p: 40, c: 45, f: 10 },
      { name: "Turkey Wrap with Hummus & Veggies", p: 35, c: 40, f: 12 },
      { name: "Lentil Soup with Brown Rice", p: 25, c: 55, f: 8 },
    ],
    dinner: [
      { name: "Baked Salmon with Asparagus", p: 35, c: 10, f: 20 },
      { name: "Stir-fried Tofu with Broccoli", p: 30, c: 20, f: 15 },
      { name: "Lean Beef Stir-fry with Peppers", p: 40, c: 15, f: 18 },
    ],
    snacks: [
      { name: "Apple & Almond Butter", p: 4, c: 25, f: 15 },
      { name: "Protein Shake", p: 25, c: 5, f: 2 },
      { name: "Carrot Sticks with Hummus", p: 5, c: 15, f: 8 },
    ],
  };

  // Standard ratios based on meal types present
  const standardRatios = {
    breakfast: 0.3,
    lunch: 0.35,
    dinner: 0.35,
    snacks: 0.1,
  };

  let totalRatio = 0;
  selectedMealTypes.forEach((type) => {
    totalRatio += standardRatios[type] || 0.25;
  });
  if (totalRatio === 0) totalRatio = 1;

  const generateDayMeals = (dayIndex) => {
    const meals = {};
    selectedMealTypes.forEach((type) => {
      const ratio = (standardRatios[type] || 0.25) / totalRatio;
      const cal = Math.round(targetCalories * ratio);

      // Pick a variation
      const variation = mealVariations[type] || mealVariations.lunch; // fallback
      const item = variation[dayIndex % variation.length];

      meals[type] = {
        calories: cal,
        items: [
          {
            name: item.name,
            protein: item.p,
            carbs: item.c,
            fats: item.f,
          },
        ],
      };

      // Add side for lunch/dinner if calories allow? Simplified for now.
    });
    return meals;
  };

  return {
    calories: targetCalories,
    protein,
    carbs,
    fats,
    bmi: parseFloat((weight / (height / 100) ** 2).toFixed(1)),
    bmr,
    tdee,
    tips: [
      "Stay hydrated: Drink at least 3-4 liters of water daily",
      "Protein timing: Distribute protein intake evenly across meals",
      "Vegetable intake: Fill half your plate with colorful vegetables",
      "Sleep quality: Aim for 7-9 hours of quality sleep",
      "Meal prep: Prepare meals in advance to stay on track",
    ],
    days: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      meals: generateDayMeals(i),
    })),
  };
};

exports.generateMealPlan = async (req, res) => {
  const {
    age,
    gender,
    height,
    weight,
    activityLevel,
    goal,
    dietType,
    allergies,
    healthConditions,
    customRestrictions,
    mealsPerDay,
    selectedMealTypes,
  } = req.body;

  const mealTypesToUse =
    selectedMealTypes && selectedMealTypes.length > 0
      ? selectedMealTypes
      : ["breakfast", "lunch", "dinner"];

  // 1. Check if AI is available
  if (!genAI) {
    console.log("Gemini API key missing. Returning fallback plan.");
    return res.json({
      success: true,
      plan: getFallbackPlan(
        {
          age,
          gender,
          height,
          weight,
          activityLevel,
          goal,
        },
        mealTypesToUse
      ),
      message: "Generated fallback plan (AI service unavailable)",
    });
  }

  try {
    // 2. Generate content using gemini-flash-latest (fastest and most efficient)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    console.log("✅ Using AI model: gemini-flash-latest");

    const prompt = `
      Generate a HIGHLY PERSONALIZED and DETAILED 7-day meal plan JSON for a user with the following profile:
      - Age: ${age}
      - Gender: ${gender}
      - Height: ${height} cm
      - Weight: ${weight} kg
      - Activity Level: ${activityLevel}
      - Primary Goal: ${goal}
      - Diet Preference: ${dietType.join(", ")}
      - Allergies: ${allergies.join(", ")} (MUST BE STRICTLY AVOIDED)
      - Health Conditions: ${healthConditions.join(", ")}
      - Custom Restrictions: ${customRestrictions || "None"}
      - Meals Per Day: ${mealsPerDay || 3}
      - Meal Types: ${mealTypesToUse.join(", ")}

      CRITICAL INSTRUCTIONS:
      1. VARIETY: Ensure meals are DIFFERENT each day. Do not repeat the same main dishes consecutively. Provide a diverse menu.
      2. SAFETY: Strictly adhere to the allergies and diet preferences.
      3. HEALTH: Choose foods that are beneficial for the specified health conditions.
      4. ACCURACY: Calculate total daily calories and macros (Protein, Carbs, Fats) accurately based on the user's BMR and TDEE.
      5. DETAIL: Use descriptive names for meal items (e.g., "Quinoa Salad with Chickpeas" instead of "Salad").
      6. INDIAN FOOD FOCUS: Prioritize Indian food items that are familiar to Indian users unless specified otherwise. You can use Hinglish language for food names (e.g., "Aloo Paratha", "Dal Makhani").
      7. VEGETARIAN ENFORCEMENT: If diet preference includes "vegetarian" or "vegan", STRICTLY EXCLUDE all non-vegetarian food items (meat, fish, eggs, etc.). Do not suggest "Chicken", "Fish", or "Beef" if the user is vegetarian.
      8. CUSTOM RESTRICTIONS: STRICTLY FOLLOW the user's custom restrictions: "${
        customRestrictions || "None"
      }". This overrides general rules if there is a conflict.
      9. MEAL STRUCTURE: You MUST generate meals ONLY for the following types: ${mealTypesToUse.join(
        ", "
      )}. Do not include other meal types.

      Return ONLY a valid JSON object (no markdown formatting, no backticks) with this exact structure:
      {
        "calories": number (daily average),
        "protein": number (daily average grams),
        "carbs": number (daily average grams),
        "fats": number (daily average grams),
        "bmi": number,
        "bmr": number,
        "tdee": number,
        "tips": [string array of 5 specific health tips based on user profile],
        "days": [
          {
            "day": 1,
            "meals": {
              // keys must match the requested meal types: ${mealTypesToUse.join(
                ", "
              )}
              // Example structure for one meal:
              "breakfast": { 
                "calories": number,
                "items": [{ "name": string, "protein": number, "carbs": number, "fats": number }]
              }
            }
          }
          // ... repeat for days 2-7
        ]
      }
    `;

    // Generate content with timeout
    const generateWithTimeout = async () => {
      return await model.generateContent(prompt);
    };
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("AI request timeout after 60 seconds")), 60000);
    });
    
    const result = await Promise.race([generateWithTimeout(), timeoutPromise]);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to ensure it's valid JSON
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const plan = JSON.parse(cleanedText);

    res.json({ success: true, plan });
  } catch (error) {
    // Determine error type for logging
    let errorType = "unknown";
    if (error.message?.includes("fetch failed") || error.message?.includes("network")) {
      errorType = "network";
      console.log("⚠️  Network/API error: Gemini API unavailable. Using fallback plan.");
    } else if (error.message?.includes("timeout")) {
      errorType = "timeout";
      console.log("⚠️  AI request timed out. Using fallback plan.");
    } else if (error.message?.includes("API key") || error.message?.includes("authentication")) {
      errorType = "auth";
      console.log("⚠️  API authentication error. Using fallback plan.");
    } else {
      errorType = "unknown";
      // Only log full error in development
      if (process.env.NODE_ENV === "development") {
        console.error("AI Generation Error:", error.message);
      } else {
        console.log("⚠️  AI service error. Using fallback plan.");
      }
    }

    // 3. Fallback mechanism - Always provide a working plan
    try {
      const fallback = getFallbackPlan(
        {
          age,
          gender,
          height,
          weight,
          activityLevel,
          goal,
        },
        mealTypesToUse
      );
      
      // Add a note to the plan that it's a fallback (optional, for transparency)
      const planWithNote = {
        ...fallback,
        _source: "fallback", // Internal flag
      };
      
      console.log("✅ Fallback meal plan generated successfully.");
      res.json({
        success: true,
        plan: planWithNote,
        message: errorType === "network" 
          ? "Generated personalized plan (AI service temporarily unavailable)"
          : "Generated personalized meal plan",
        isFallback: true, // Let frontend know it's a fallback
      });
    } catch (fallbackError) {
      console.error("❌ Fallback generation failed:", fallbackError);
      res
        .status(500)
        .json({ 
          success: false, 
          message: "Failed to generate meal plan. Please try again." 
        });
    }
  }
};
