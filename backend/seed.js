const bcrypt = require('bcrypt');
const db = require('./db');

async function seed() {
  try {
    const username = 'admin';
    const plainPassword = 'password123';
    const hashed = await bcrypt.hash(plainPassword, 10);
    
    // Check if exists
    const [rows] = await db.query("SELECT * FROM Admin WHERE username = ?", [username]);
    if (rows.length === 0) {
      await db.query("INSERT INTO Admin (username, password) VALUES (?, ?)", [username, hashed]);
      console.log("Admin created successfully!");
    } else {
      console.log("Admin already exists!");
    }
    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
}
seed();
