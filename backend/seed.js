const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import Models
const User = require("./models/User");
const Chef = require("./models/Chef");
const Customer = require("./models/Customer");
const Dish = require("./models/Dish");
const Plan = require("./models/Plan");
const Order = require("./models/Order");
const HealthLog = require("./models/HealthLog");

const seedDatabase = async () => {
  try {
    console.log("--- Starting Database Seeding ---");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await User.deleteMany({});
    await Chef.deleteMany({});
    await Customer.deleteMany({});
    await Dish.deleteMany({});
    await Plan.deleteMany({});
    await Order.deleteMany({});
    await HealthLog.deleteMany({});

    // 1. Create Users (Chefs & Customers)
    console.log("👤 Creating Users...");

    const chefData = [
      {
        name: "Chef Sanjeev",
        email: "sanjeev@mealwell.com",
        phone: "9876543210",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Vikas",
        email: "vikas@mealwell.com",
        phone: "9876543211",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Ranveer",
        email: "ranveer@mealwell.com",
        phone: "9876543212",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Garima",
        email: "garima@mealwell.com",
        phone: "9876543213",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Kunal",
        email: "kunal@mealwell.com",
        phone: "9876543214",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Manish",
        email: "manish@mealwell.com",
        phone: "9876543215",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Ritu",
        email: "ritu@mealwell.com",
        phone: "9876543216",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Anahita",
        email: "anahita@mealwell.com",
        phone: "9876543217",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1654922207993-2952fec3276d?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Vicky",
        email: "vicky@mealwell.com",
        phone: "9876543218",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Shipra",
        email: "shipra@mealwell.com",
        phone: "9876543219",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Pankaj",
        email: "pankaj@mealwell.com",
        phone: "9876543220",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Harpal",
        email: "harpal@mealwell.com",
        phone: "9876543221",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop",
      },
      {
        name: "Chef Saransh",
        email: "saransh@mealwell.com",
        phone: "9876543222",
        userType: "chef",
        avatar:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&auto=format&fit=crop",
      },
    ];

    const customerData = [
      {
        name: "Aman Kumar",
        email: "aman@example.com",
        phone: "9998887770",
        userType: "customer",
        avatar:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&auto=format&fit=crop",
      },
      {
        name: "Priya Singh",
        email: "priya@example.com",
        phone: "9998887771",
        userType: "customer",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop",
      },
      {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "9998887772",
        userType: "customer",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop",
      },
    ];

    const chefs = [];
    for (const data of chefData) {
      const user = new User({
        ...data,
        password: "password123", // Will be hashed by pre-save hook
        isActive: true,
        isVerified: true,
        profile: {
          avatar: data.avatar,
          bio: "Passionate about healthy cooking",
          location: "New Delhi",
        },
      });
      await user.save();

      const chef = new Chef({
        userId: user._id,
        location: "South Delhi",
        pricePerMeal: 350 + Math.floor(Math.random() * 200),
        cuisines: ["Indian", "Asian", "Vegan"],
        specialties: ["Weight Loss", "High Protein"],
        experienceYears: 5 + Math.floor(Math.random() * 10),
        rating: 4.5 + Math.random() * 0.5,
        reviewsCount: 10 + Math.floor(Math.random() * 100),
        mealsDelivered: 100 + Math.floor(Math.random() * 500),
        coverImage:
          "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=600&auto=format&fit=crop",
      });
      await chef.save();
      chefs.push(chef);
    }

    const customers = [];
    for (const data of customerData) {
      const user = new User({
        ...data,
        password: "password123",
        isActive: true,
        isVerified: true,
        profile: {
          avatar: data.avatar,
          bio: "Health enthusiast",
          location: "Mumbai",
        },
      });
      await user.save();

      const customer = new Customer({
        userId: user._id,
        healthGoals: ["Weight Loss", "Muscle Gain"],
        dietaryRestrictions: ["None"],
        calorieTarget: 2200,
        preferences: {
          spiceLevel: "medium",
          mealTimes: { lunch: "01:00 PM", dinner: "08:00 PM" },
        },
      });
      await customer.save();
      customers.push(customer);
    }
    console.log(
      `✅ Created ${chefs.length} Chefs and ${customers.length} Customers`
    );

    // 2. Create Dishes
    console.log("🍲 Creating Dishes...");
    const dishTemplates = [
      {
        name: "Grilled Chicken Salad",
        category: "Lunch",
        calories: 450,
        protein: 40,
        carbs: 15,
        fats: 20,
        price: 250,
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop",
      },
      {
        name: "Quinoa Bowl",
        category: "Dinner",
        calories: 350,
        protein: 12,
        carbs: 50,
        fats: 10,
        price: 200,
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop",
      },
      {
        name: "Oats & Berries",
        category: "Breakfast",
        calories: 300,
        protein: 10,
        carbs: 45,
        fats: 8,
        price: 150,
        image:
          "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=300&auto=format&fit=crop",
      },
      {
        name: "Avocado Toast",
        category: "Breakfast",
        calories: 320,
        protein: 8,
        carbs: 30,
        fats: 18,
        price: 180,
        image:
          "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&auto=format&fit=crop",
      },
      {
        name: "Tofu Stir Fry",
        category: "Dinner",
        calories: 380,
        protein: 25,
        carbs: 20,
        fats: 22,
        price: 280,
        image:
          "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=300&auto=format&fit=crop",
      },
      {
        name: "Berry Smoothie",
        category: "Beverage",
        calories: 180,
        protein: 5,
        carbs: 30,
        fats: 2,
        price: 120,
        image:
          "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=300&auto=format&fit=crop",
      },
      // New Dishes
      {
        name: "Salmon with Asparagus",
        category: "Dinner",
        calories: 500,
        protein: 35,
        carbs: 10,
        fats: 30,
        price: 450,
        image:
          "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=300&auto=format&fit=crop",
      },
      {
        name: "Vegan Buddha Bowl",
        category: "Lunch",
        calories: 420,
        protein: 15,
        carbs: 60,
        fats: 12,
        price: 320,
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop",
      },
      {
        name: "Greek Yogurt Parfait",
        category: "Breakfast",
        calories: 250,
        protein: 20,
        carbs: 30,
        fats: 5,
        price: 180,
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&auto=format&fit=crop",
      },
      {
        name: "Keto Steak Salad",
        category: "Dinner",
        calories: 600,
        protein: 50,
        carbs: 5,
        fats: 40,
        price: 550,
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop",
      },
    ];

    const allDishes = [];
    for (const chef of chefs) {
      for (const template of dishTemplates) {
        const dish = new Dish({
          chefId: chef._id,
          ...template,
          nutritionalInfo: {
            calories: template.calories,
            protein: template.protein,
            carbs: template.carbs,
            fats: template.fats,
          },
          tags: ["Healthy", "Fresh", "Organic"],
          description: `Delicious ${template.name} prepared with fresh ingredients by Chef.`,
        });
        await dish.save();
        allDishes.push(dish);
      }
    }
    console.log(`✅ Created ${chefs.length * dishTemplates.length} Dishes`);

    // 3. Create Plans
    console.log("📅 Creating Plans...");
    const plans = [
      {
        planId: "weekly",
        name: "Weekly Starter",
        description: "Perfect for trying out MealWell",
        price: 1999,
        totalMeals: 14,
        durationDays: 7,
        features: ["2 Meals/Day", "Basic Customization", "Weekend Support"],
      },
      {
        planId: "monthly",
        name: "Monthly Pro",
        description: "Most popular for consistent healthy eating",
        price: 7499,
        originalPrice: 8999,
        discount: 15,
        totalMeals: 60,
        durationDays: 30,
        features: [
          "2 Meals/Day",
          "Full Customization",
          "Priority Support",
          "Free Delivery",
        ],
      },
      {
        planId: "quarterly",
        name: "Quarterly Elite",
        description: "Commit to a lifestyle change",
        price: 20999,
        originalPrice: 26999,
        discount: 22,
        totalMeals: 180,
        durationDays: 90,
        features: [
          "All Meals",
          "Dietitian Consultation",
          "Premium Support",
          "Exclusive Menu",
        ],
      },
    ];

    for (const p of plans) {
      await Plan.create(p);
    }
    console.log(`✅ Created ${plans.length} Plans`);

    // 4. Create Orders
    console.log("📦 Creating Orders...");
    const statuses = [
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    for (const customer of customers) {
      // Create 3 orders per customer
      for (let i = 0; i < 3; i++) {
        const randomChef = chefs[Math.floor(Math.random() * chefs.length)];
        const randomDish = allDishes.find(
          (d) => d.chefId.toString() === randomChef._id.toString()
        );

        const status = statuses[Math.floor(Math.random() * statuses.length)];

        await Order.create({
          customerId: customer.userId, // Use userId from customer object which links to User model
          chefId: randomChef._id,
          items: [
            {
              name: randomDish.name,
              quantity: 1,
              price: randomDish.price,
              type: "dish",
              nutritionalInfo: randomDish.nutritionalInfo,
            },
          ],
          totalAmount: randomDish.price,
          status: status,
          paymentStatus: "paid",
          deliveryAddress: {
            street: "123 Green Way",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
            phone: "9876543210",
          },
          notes: "Please deliver on time.",
        });
      }
    }
    console.log(`✅ Created Orders for customers`);

    // 5. Create Health Logs
    console.log("🩺 Creating Health Logs...");
    for (const customer of customers) {
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Randomize data slightly
        const weight = 78.5 - i * 0.1 + (Math.random() * 0.2 - 0.1);
        const calories = 1800 + Math.floor(Math.random() * 300);
        const protein = 110 + Math.floor(Math.random() * 30);

        await HealthLog.create({
          userId: customer.userId,
          date: date,
          weight: parseFloat(weight.toFixed(1)),
          calories: calories,
          protein: protein,
          water: 2000 + Math.floor(Math.random() * 1000),
          sleep: 6 + Math.floor(Math.random() * 3),
          heartRate: 65 + Math.floor(Math.random() * 10),
          mood: ["Great", "Good", "Neutral"][Math.floor(Math.random() * 3)],
        });
      }
    }
    console.log(`✅ Created Health Logs for ${customers.length} Customers`);

    console.log("--- Database Seeding Completed Successfully ---");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
};

seedDatabase();
