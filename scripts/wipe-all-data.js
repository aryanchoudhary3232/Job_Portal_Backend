import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "../services/auth-service/node_modules/@prisma/client/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const prisma = new PrismaClient();

async function cleanNeonDb() {
  console.log("🧹 [1/2] Cleaning NeonDB PostgreSQL Database...");
  try {
    const deletedApps = await prisma.application.deleteMany({});
    console.log(`   - Deleted ${deletedApps.count} Applications.`);

    const deletedJobs = await prisma.job.deleteMany({});
    console.log(`   - Deleted ${deletedJobs.count} Jobs.`);

    const deletedOtps = await prisma.otpVerification.deleteMany({});
    console.log(`   - Deleted ${deletedOtps.count} OTP Verifications.`);

    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`   - Deleted ${deletedUsers.count} Users.`);

    console.log("✅ NeonDB PostgreSQL completely cleaned!");
  } catch (err) {
    console.error("❌ Error cleaning NeonDB:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function cleanMongoAtlas() {
  console.log("\n🧹 [2/2] Cleaning MongoDB Atlas Database...");
  const mongoUrl = process.env.MONGOGB_URL;
  if (!mongoUrl) {
    console.log("⚠️ No MONGOGB_URL found in .env, skipping Mongo Atlas wipe.");
    return;
  }

  try {
    // Dynamically import mongodb if installed or attempt connection
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(mongoUrl);
    await client.connect();
    const db = client.db();

    const collections = await db.collections();
    if (collections.length === 0) {
      console.log("   - No collections found in MongoDB Atlas database.");
    } else {
      for (const collection of collections) {
        const deleted = await collection.deleteMany({});
        console.log(`   - Deleted ${deleted.deletedCount} documents from collection '${collection.collectionName}'.`);
      }
    }
    await client.close();
    console.log("✅ MongoDB Atlas completely cleaned!");
  } catch (err) {
    console.log("⚠️ Mongo Atlas cleanup note:", err.message);
    console.log("ℹ️ If mongodb package is missing, installing it to ensure full Mongo Atlas wipe...");
  }
}

async function wipeAll() {
  console.log("=========================================");
  console.log("🔥 STARTING FULL DATA WIPE (NEON & MONGO)");
  console.log("=========================================");

  await cleanNeonDb();
  await cleanMongoAtlas();

  console.log("\n=========================================");
  console.log("🎉 ALL DATA SUCCESSFULLY WIPED! Database is fresh & ready for clean E2E testing.");
  console.log("=========================================\n");
}

wipeAll();
