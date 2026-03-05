import { sequelize } from "./src/Database/db.js";
import { User } from "./src/Model/userModel.js";

async function checkDatabase() {
  try {
    console.log('🔍 Checking Database Connection...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database Connected Successfully');
    
    console.log('\n📊 Fetching all users from database...\n');
    const users = await User.findAll({
      attributes: ['id', 'fullname', 'username', 'email', 'role', 'createdAt']
    });
    
    console.log(`✅ Found ${users.length} user(s):\n`);
    users.forEach((user) => {
      console.log(`  ID: ${user.id}`);
      console.log(`  Name: ${user.fullname}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Created: ${user.createdAt}\n`);
    });
    
    console.log('✅ Database check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
