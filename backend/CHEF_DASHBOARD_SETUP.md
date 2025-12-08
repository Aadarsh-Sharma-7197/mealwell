# Chef Dashboard Setup Guide

This guide will help you set up the Chef Dashboard with sample data.

## 🚀 Quick Start

### 1. Run the Seed Script

To populate the database with sample chef accounts and orders, run:

```bash
cd backend
node scripts/seedChefDashboard.js
```

This will create:
- 3 sample chef accounts with credentials
- 5 sample customer accounts
- Multiple dishes for each chef
- 15-20 orders per chef with various statuses and payment states

### 2. Chef Login Credentials

After running the seed script, you can login with any of these chef accounts:

#### Chef 1: Rajesh Kumar
- **Email:** `chef.rajesh@mealwell.com`
- **Password:** `chef123456`
- **Location:** Mumbai, Maharashtra
- **Specialties:** Diabetic-Friendly, Heart-Healthy

#### Chef 2: Priya Sharma
- **Email:** `chef.priya@mealwell.com`
- **Password:** `chef123456`
- **Location:** Delhi, NCR
- **Specialties:** Weight Loss, High Protein

#### Chef 3: Arjun Patel
- **Email:** `chef.arjun@mealwell.com`
- **Password:** `chef123456`
- **Location:** Bangalore, Karnataka
- **Specialties:** Vegan, High Protein

## 📊 Dashboard Features

The Chef Dashboard includes:

### Statistics Overview
- **Pending Orders:** Count of orders awaiting action
- **Total Earnings:** Lifetime revenue from all paid orders
- **Monthly Earnings:** Revenue for the current month
- **Rating:** Chef's average rating
- **Total Customers:** Unique customers who have ordered
- **Completed Orders:** Successfully delivered orders
- **Cancelled Orders:** Cancelled order count
- **Success Rate:** Percentage of completed vs total orders

### Analytics & Charts
- **Revenue Trend:** Line chart showing revenue and order count over last 7 days
- **Order Status Distribution:** Pie chart showing breakdown of order statuses

### Order Management
- **Comprehensive Order Table** with:
  - Order number and customer information
  - Items and quantities
  - Payment status (Paid/Pending/Failed)
  - Order status (Pending/Confirmed/Preparing/Ready/Out for Delivery/Delivered/Cancelled)
  - Order date
  - Quick action buttons for status updates

### Filters & Search
- **Search:** Find orders by order number, customer name, or email
- **Status Filter:** Filter by order status
- **Payment Filter:** Filter by payment status

### Order Details Modal
Click the eye icon on any order to view:
- Complete order information
- Customer contact details
- Delivery address
- Item details with nutritional info
- Payment information
- Special notes

### Status Management
Chefs can update order status through the workflow:
1. **Pending** → Accept order → **Confirmed**
2. **Confirmed** → Start preparing → **Preparing**
3. **Preparing** → Mark ready → **Ready**
4. **Ready** → Out for delivery → **Out for Delivery**
5. **Out for Delivery** → Mark delivered → **Delivered**

## 🎨 Design Features

- Modern, clean UI with gradient backgrounds
- Responsive design for all screen sizes
- Smooth animations using Framer Motion
- Color-coded status badges
- Interactive charts using Recharts
- Real-time statistics updates

## 🔄 Refreshing Data

To refresh the sample data, simply run the seed script again:

```bash
node scripts/seedChefDashboard.js
```

**Note:** The script will create new accounts if they don't exist, so running it multiple times is safe.

## 🐛 Troubleshooting

### Orders not showing up?
1. Make sure you're logged in as a chef account
2. Check that the seed script ran successfully
3. Verify the chef profile exists in the database

### Can't update order status?
1. Ensure you're logged in as the chef who owns the order
2. Check that the order status allows the transition you're trying to make
3. Verify the backend API is running

### Charts not displaying?
1. Check browser console for errors
2. Ensure there are orders with payment status "paid" for revenue charts
3. Verify Recharts library is installed

## 📝 Notes

- All sample orders are created with dates within the last 30 days
- Payment statuses are randomly assigned (mostly "paid" for realistic data)
- Order statuses are distributed to show various stages
- Each chef has 4 sample dishes in their menu
- Customer accounts are also created for testing order flow

## 🎯 Next Steps

1. Login with a chef account
2. Navigate to `/chef` route
3. Explore the dashboard features
4. Test order status updates
5. View order details
6. Check analytics and charts

Enjoy exploring the Chef Dashboard! 🍳

