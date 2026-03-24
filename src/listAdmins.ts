import mongoose from "mongoose";
import { config } from "./config/config";
import Admin from "./modals/admin.model";
import Role from "./modals/role.model";

const listAdmins = async () => {
  try {
    const dbUrl = config.db.url.endsWith("/") ? config.db.url : `${config.db.url}/`;
    const mongoUri = `${dbUrl}${config.db.name}`;
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    const admins = await Admin.find({}).populate("role");
    console.log(`Found ${admins.length} admins:`);
    admins.forEach((a: any) => {
      console.log(`- ID: ${a._id}, Email: ${a.email}, Username: ${a.username}, Role: ${a.role?.name}`);
    });

    const roles = await Role.find({});
    console.log(`Found ${roles.length} roles:`);
    roles.forEach((r: any) => {
      console.log(`- ID: ${r._id}, Name: ${r.name}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Failed to list admins:", error);
  }
};

listAdmins();
