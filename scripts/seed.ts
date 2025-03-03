import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config(); // Load environment variables

// Check for MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error("❌ Please add your MongoDB URI to .env.local");
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

const DB_NAME = "finance_tracker";

async function seedDatabase() {
  const client = new MongoClient(uri, options);

  try {
    // Connect to MongoDB
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);

    // Drop existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    for (const name of ["categories", "transactions", "budgets"]) {
      if (collectionNames.includes(name)) {
        await db.collection(name).drop();
        console.log(`🗑️ Dropped ${name} collection`);
      }
    }

    // Seed categories
    const categories = [
      { name: "Housing", description: "Rent, mortgage, repairs", createdAt: new Date(), updatedAt: new Date() },
      { name: "Transportation", description: "Car payments, gas, public transit", createdAt: new Date(), updatedAt: new Date() },
      { name: "Food", description: "Groceries, restaurants", createdAt: new Date(), updatedAt: new Date() },
      { name: "Utilities", description: "Electricity, water, internet, phone", createdAt: new Date(), updatedAt: new Date() },
      { name: "Entertainment", description: "Movies, games, subscriptions", createdAt: new Date(), updatedAt: new Date() },
      { name: "Healthcare", description: "Insurance, medications, doctor visits", createdAt: new Date(), updatedAt: new Date() },
      { name: "Income", description: "Salary, freelance work", createdAt: new Date(), updatedAt: new Date() },
    ];

    const categoryResult = await db.collection("categories").insertMany(categories);
    console.log(`✅ Inserted ${categoryResult.insertedCount} categories`);

    // Seed transactions
    const categoryIds = Object.values(categoryResult.insertedIds);
    if (categoryIds.length === 0) throw new Error("❌ No categories found!");

    const currentDate = new Date();
    const lastMonth = new Date(currentDate);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const transactions = [
      { description: "Monthly Salary", amount: 3500, date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), categoryId: categoryIds[6].toString(), notes: "Regular salary", createdAt: new Date(), updatedAt: new Date() },
      { description: "Rent Payment", amount: -1200, date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3), categoryId: categoryIds[0].toString(), notes: "Monthly rent", createdAt: new Date(), updatedAt: new Date() },
      { description: "Grocery Shopping", amount: -85.75, date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5), categoryId: categoryIds[2].toString(), notes: "Groceries", createdAt: new Date(), updatedAt: new Date() },
      { description: "Phone Bill", amount: -55.99, date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 9), categoryId: categoryIds[3].toString(), notes: "Monthly phone bill", createdAt: new Date(), updatedAt: new Date() },
      { description: "Car Insurance", amount: -125.75, date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 14), categoryId: categoryIds[1].toString(), notes: "Car insurance", createdAt: new Date(), updatedAt: new Date() },
    ];

    const transactionsResult = await db.collection("transactions").insertMany(transactions);
    console.log(`✅ Inserted ${transactionsResult.insertedCount} transactions`);

    // Seed budgets
    const budgets = [
      { categoryId: categoryIds[0].toString(), amount: 1300, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: categoryIds[1].toString(), amount: 200, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: categoryIds[2].toString(), amount: 400, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: categoryIds[3].toString(), amount: 150, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: categoryIds[4].toString(), amount: 100, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: categoryIds[5].toString(), amount: 200, createdAt: new Date(), updatedAt: new Date() },
    ];

    const budgetsResult = await db.collection("budgets").insertMany(budgets);
    console.log(`✅ Inserted ${budgetsResult.insertedCount} budgets`);

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.close();
    console.log("🔌 MongoDB connection closed  .");
  }
}

seedDatabase();
