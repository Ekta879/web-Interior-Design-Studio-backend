import bcrypt from "bcryptjs";
import { User } from "./userModel.js";

export const createAdminIfNotExists = async () => {
  try {
    const adminEmail = "admin@gmail.com";

    const admin = await User.findOne({ where: { email: adminEmail } });

    if (admin) {
      if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
      }
      return;
    }

    await User.create({
      fullname: "Admin",
      username: "admin",
      email: adminEmail,
      password: await bcrypt.hash("Admin123%", 10),
      role: "admin",
    });

    console.log("Admin created successfully");
  } catch (err) {
    console.error("Failed to create admin:", err);
  }
};