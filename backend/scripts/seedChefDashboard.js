const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import Models
const User = require("../models/User");
const Chef = require("../models/Chef");
const Customer = require("../models/Customer");
const Dish = require("../models/Dish");
const Order = require("../models/Order");

const seedChefDashboard = async () => {
  try {
    console.log("🍳 Starting Chef Dashboard Data Seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Create sample chefs with known credentials
    console.log("👨‍🍳 Creating Sample Chefs...");
    
    const chefCredentials = [
      {
        name: "Chef Rajesh Kumar",
        email: "chef.rajesh@mealwell.com",
        password: "chef123456",
        phone: "9876543210",
        location: "Mumbai, Maharashtra",
        specialties: ["Diabetic-Friendly", "Heart-Healthy"],
        cuisines: ["Indian"],
        experienceYears: 8,
        pricePerMeal: 350,
      },
      {
        name: "Chef Priya Sharma",
        email: "chef.priya@mealwell.com",
        password: "chef123456",
        phone: "9876543211",
        location: "Delhi, NCR",
        specialties: ["Weight Loss", "High Protein"],
        cuisines: ["Indian", "Continental"],
        experienceYears: 6,
        pricePerMeal: 400,
      },
      {
        name: "Chef Arjun Patel",
        email: "chef.arjun@mealwell.com",
        password: "chef123456",
        phone: "9876543212",
        location: "Bangalore, Karnataka",
        specialties: ["Vegan", "High Protein"],
        cuisines: ["Indian", "Asian"],
        experienceYears: 10,
        pricePerMeal: 450,
      },
    ];

    const createdChefs = [];
    const createdChefProfiles = [];

    for (const chefData of chefCredentials) {
      // Check if chef already exists
      let chefUser = await User.findOne({ email: chefData.email });
      
      if (!chefUser) {
        // Create chef user
        chefUser = await User.create({
          name: chefData.name,
          email: chefData.email,
          password: chefData.password,
          phone: chefData.phone,
          userType: "chef",
          isVerified: true,
          isActive: true,
          profile: {
            location: chefData.location,
          },
        });
        console.log(`✅ Created chef user: ${chefData.name}`);
      }

      // Create or update chef profile
      let chefProfile = await Chef.findOne({ userId: chefUser._id });
      
      if (!chefProfile) {
        chefProfile = await Chef.create({
          userId: chefUser._id,
          location: chefData.location,
          specialties: chefData.specialties,
          cuisines: chefData.cuisines,
          experienceYears: chefData.experienceYears,
          pricePerMeal: chefData.pricePerMeal,
          rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
          isAvailable: true,
        });
        console.log(`✅ Created chef profile: ${chefData.name}`);
      }

      createdChefs.push(chefUser);
      createdChefProfiles.push(chefProfile);
    }

    // Create sample customers
    console.log("👥 Creating Sample Customers...");
    const customerData = [
      {
        name: "Rahul Mehta",
        email: "rahul.customer@mealwell.com",
        password: "customer123",
        phone: "9876543300",
      },
      {
        name: "Sneha Desai",
        email: "sneha.customer@mealwell.com",
        password: "customer123",
        phone: "9876543301",
      },
      {
        name: "Amit Singh",
        email: "amit.customer@mealwell.com",
        password: "customer123",
        phone: "9876543302",
      },
      {
        name: "Kavita Reddy",
        email: "kavita.customer@mealwell.com",
        password: "customer123",
        phone: "9876543303",
      },
      {
        name: "Vikram Nair",
        email: "vikram.customer@mealwell.com",
        password: "customer123",
        phone: "9876543304",
      },
    ];

    const createdCustomers = [];
    for (const customerInfo of customerData) {
      let customerUser = await User.findOne({ email: customerInfo.email });
      
      if (!customerUser) {
        customerUser = await User.create({
          name: customerInfo.name,
          email: customerInfo.email,
          password: customerInfo.password,
          phone: customerInfo.phone,
          userType: "customer",
          isVerified: true,
          isActive: true,
        });
        console.log(`✅ Created customer: ${customerInfo.name}`);
      }
      createdCustomers.push(customerUser);
    }

    // Create sample dishes for each chef
    console.log("🍽️ Creating Sample Dishes...");
    const dishTemplates = [
      {
        name: "Grilled Chicken with Quinoa",
        price: 350,
        category: "Lunch",
        nutritionalInfo: { calories: 450, protein: 35, carbs: 40, fats: 12 },
      },
      {
        name: "Vegetable Biryani",
        price: 280,
        category: "Lunch",
        nutritionalInfo: { calories: 380, protein: 12, carbs: 65, fats: 8 },
      },
      {
        name: "Dal Makhani with Brown Rice",
        price: 250,
        category: "Dinner",
        nutritionalInfo: { calories: 320, protein: 15, carbs: 50, fats: 6 },
      },
      {
        name: "Paneer Tikka Wrap",
        price: 300,
        category: "Lunch",
        nutritionalInfo: { calories: 400, protein: 20, carbs: 45, fats: 15 },
      },
      {
        name: "Fish Curry with Steamed Rice",
        price: 380,
        category: "Dinner",
        nutritionalInfo: { calories: 420, protein: 30, carbs: 35, fats: 18 },
      },
      {
        name: "Chicken Salad Bowl",
        price: 320,
        category: "Lunch",
        nutritionalInfo: { calories: 350, protein: 28, carbs: 25, fats: 14 },
      },
      {
        name: "Veg Thali",
        price: 270,
        category: "Dinner",
        nutritionalInfo: { calories: 360, protein: 14, carbs: 55, fats: 10 },
      },
      {
        name: "Protein Smoothie Bowl",
        price: 200,
        category: "Breakfast",
        nutritionalInfo: { calories: 280, protein: 25, carbs: 35, fats: 5 },
      },
      {
        name: "Masala Omelette",
        price: 180,
        category: "Breakfast",
        nutritionalInfo: { calories: 250, protein: 18, carbs: 8, fats: 16 },
      },
      {
        name: "Chocolate Brownie",
        price: 150,
        category: "Dessert",
        nutritionalInfo: { calories: 320, protein: 5, carbs: 45, fats: 14 },
      },
    ];

    const createdDishes = [];
    for (const chefProfile of createdChefProfiles) {
      for (let i = 0; i < 4; i++) {
        const dishTemplate = dishTemplates[Math.floor(Math.random() * dishTemplates.length)];
        const dish = await Dish.create({
          chefId: chefProfile._id,
          name: dishTemplate.name,
          price: dishTemplate.price,
          category: dishTemplate.category,
          description: `Delicious ${dishTemplate.name} prepared with fresh ingredients`,
          nutritionalInfo: dishTemplate.nutritionalInfo,
          available: true,
        });
        createdDishes.push(dish);
      }
    }
    console.log(`✅ Created ${createdDishes.length} dishes`);

    // Create sample orders with various statuses
    console.log("📦 Creating Sample Orders...");
    const orderStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "delivered",
      "delivered",
      "delivered", // More delivered orders for better stats
      "cancelled",
    ];

    const paymentStatuses = ["paid", "paid", "paid", "pending", "failed"];

    const orders = [];
    const now = new Date();

    // Create orders for each chef
    for (const chefProfile of createdChefProfiles) {
      const chefDishes = createdDishes.filter(
        (d) => d.chefId.toString() === chefProfile._id.toString()
      );

      // Create 15-20 orders per chef
      const numOrders = 15 + Math.floor(Math.random() * 6);
      
      for (let i = 0; i < numOrders; i++) {
        const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
        const dish = chefDishes[Math.floor(Math.random() * chefDishes.length)];
        const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
        const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

        // Create order date within last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const orderDate = new Date(now);
        orderDate.setDate(orderDate.getDate() - daysAgo);
        orderDate.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));

        const quantity = 1 + Math.floor(Math.random() * 3);
        const totalAmount = dish.price * quantity;

        const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        const order = await Order.create({
          customerId: customer._id,
          chefId: chefProfile._id,
          items: [
            {
              name: dish.name,
              quantity: quantity,
              price: dish.price,
              type: "dish",
              nutritionalInfo: dish.nutritionalInfo,
            },
          ],
          totalAmount: totalAmount,
          finalAmount: totalAmount,
          status: status,
          paymentStatus: paymentStatus,
          orderNumber: orderNumber,
          deliveryAddress: {
            street: `${Math.floor(Math.random() * 999) + 1} Main Street`,
            city: chefProfile.location.split(",")[0],
            state: chefProfile.location.split(",")[1]?.trim() || "Maharashtra",
            zipCode: `${400000 + Math.floor(Math.random() * 1000)}`,
            phone: customer.phone,
          },
          notes: i % 3 === 0 ? "Please deliver on time" : undefined,
          createdAt: orderDate,
          deliveryStatus: {
            confirmed: status !== "pending" ? new Date(orderDate.getTime() + 5 * 60000) : undefined,
            preparing: ["preparing", "ready", "out_for_delivery", "delivered"].includes(status)
              ? new Date(orderDate.getTime() + 15 * 60000)
              : undefined,
            ready: ["ready", "out_for_delivery", "delivered"].includes(status)
              ? new Date(orderDate.getTime() + 45 * 60000)
              : undefined,
            out_for_delivery: ["out_for_delivery", "delivered"].includes(status)
              ? new Date(orderDate.getTime() + 60 * 60000)
              : undefined,
            delivered: status === "delivered" ? new Date(orderDate.getTime() + 90 * 60000) : undefined,
          },
        });

        orders.push(order);
      }
    }

    console.log(`✅ Created ${orders.length} orders`);

    // Update chef stats
    console.log("📊 Updating Chef Statistics...");
    for (const chefProfile of createdChefProfiles) {
      const chefOrders = orders.filter(
        (o) => o.chefId.toString() === chefProfile._id.toString()
      );
      const deliveredCount = chefOrders.filter((o) => o.status === "delivered").length;
      
      await Chef.findByIdAndUpdate(chefProfile._id, {
        mealsDelivered: deliveredCount,
        reviewsCount: Math.floor(deliveredCount * 0.7), // Assume 70% leave reviews
      });
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ CHEF DASHBOARD DATA SEEDED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n📋 CHEF CREDENTIALS:");
    console.log("-".repeat(60));
    chefCredentials.forEach((chef, index) => {
      console.log(`\n${index + 1}. ${chef.name}`);
      console.log(`   Email: ${chef.email}`);
      console.log(`   Password: ${chef.password}`);
    });
    console.log("\n" + "=".repeat(60));
    console.log("💡 You can now login with any chef account to see the dashboard!");
    console.log("=".repeat(60) + "\n");

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeder
seedChefDashboard();

