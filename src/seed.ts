import mongoose from "mongoose";
import { config } from "./config/config";
import Country from "./modals/country.model";
import State from "./modals/state.model";
import City from "./modals/city.model";
import { User } from "./modals/user.model";
import UserPreference from "./modals/userpreference.model";
import AbuseReport from "./modals/abusereport.model";
import Bookmark from "./modals/bookmark.model";
import Otp from "./modals/otp.model";
import Admin from "./modals/admin.model";
import Role from "./modals/role.model";

const seedData = async () => {
  try {
    const dbUrl = config.db.url.endsWith("/") ? config.db.url : `${config.db.url}/`;
    const mongoUri = `${dbUrl}${config.db.name}`;
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log("Clearing existing data (optional, but good for clean seed)...");
    // Optional: await Country.deleteMany({});
    // await State.deleteMany({});
    // await City.deleteMany({});

    /*
    // 1. Seed Countries
    console.log("Seeding Countries...");
    const countries = await Country.insertMany([
      { name: "India", code: "IN", phoneCode: "+91", status: true },
      { name: "United States", code: "US", phoneCode: "+1", status: true },
      { name: "United Kingdom", code: "GB", phoneCode: "+44", status: true },
    ]);
    console.log(`Inserted ${countries.length} countries`);

    // 2. Seed States
    console.log("Seeding States...");
    const states = await State.insertMany([
      { name: "Maharashtra", country: countries[0]._id, status: true },
      { name: "Gujarat", country: countries[0]._id, status: true },
      { name: "California", country: countries[1]._id, status: true },
      { name: "New York", country: countries[1]._id, status: true },
    ]);
    console.log(`Inserted ${states.length} states`);

    // 3. Seed Cities
    console.log("Seeding Cities...");
    await City.insertMany([
      { name: "Mumbai", state: states[0]._id, status: true },
      { name: "Pune", state: states[0]._id, status: true },
      { name: "Los Angeles", state: states[2]._id, status: true },
      { name: "New York City", state: states[3]._id, status: true },
    ]);
    console.log("Inserted cities");
    */
    const states = await State.find({}); // needed for downstream refs if any, but we don't use them below

    // 4. Seed Dummy User for References
    console.log("Seeding Dummy User...");
    let user = await User.findOne({ email: "testuser@example.com" });
    if (!user) {
      user = await User.create({
        name: "Test User",
        email: "testuser@example.com",
        mobile: "1234567890",
        password: "password123", // should be hashed normally, but for seed it's fine if hashing middleware works
        addresses: [],
        status: "active",
      });
      console.log("Created dummy user");
    } else {
      console.log("Dummy user already exists");
    }

    // 5. Seed User Preference
    console.log("Seeding User Preference...");
    await UserPreference.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        preferences: { theme: "dark", language: "en", notifications: true },
        status: true,
      },
      { upsert: true, new: true }
    );
    console.log("Seeded user preference");

    // 6. Seed Abuse Report
    console.log("Seeding Abuse Report...");
    await AbuseReport.create({
      reporter: user._id,
      reason: "Inappropriate content",
      description: "The user was posting spam in the reviews.",
      status: "pending",
    });
    console.log("Seeded abuse report");

    // 7. Seed Bookmark (using dummy ID for item for now)
    console.log("Seeding Bookmark...");
    await Bookmark.create({
      user: user._id,
      item: new mongoose.Types.ObjectId(), // dummy item ID
      itemType: "Outlet",
      status: true,
    });
    console.log("Seeded bookmark");

    // 8. Seed OTP Logs
    console.log("Seeding OTP Logs...");
    await Otp.create({
      otp: "123456",
      email: "testuser@example.com",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      verified: false,
    });
    console.log("Seeded OTP log");

    // 9. Seed Admin User
    console.log("Seeding Admin User...");
    let adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      adminRole = await Role.create({
        name: "admin",
        description: "Administrator with full access",
      });
      console.log("Created admin role");
    }

    let admin = await Admin.findOne({ email: "admin@example.com" });
    if (!admin) {
      // Create admin
      await Admin.create({
        email: "admin@example.com",
        password: "password", // will be hashed by pre-save if exists, or manually
        username: "adminUser",
        status: true,
        role: adminRole._id,
      });
      console.log("Created admin user");
    } else {
      console.log("Admin user already exists");
    }

    console.log("✅ Seeding completed successfully!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
