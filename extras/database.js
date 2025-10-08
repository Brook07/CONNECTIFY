 const mysql = require('mysql2');
 const dotenv = require('dotenv');
 dotenv.config();


const schema = `
CREATE DATABASE IF NOT EXISTS chat_app;

CREATE TABLE IF NOT EXISTS message_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_user_id INT NOT NULL,
  to_user_id INT NOT NULL,
  message TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ongoing_chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chat_id INT NOT NULL,
  sender_id INT NOT NULL,
  message TEXT,
  message_type ENUM('text', 'image') NOT NULL,
  image_url TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  profile_image TEXT
);
`;

 const db = mysql.createPool({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: 'chat_app',
     multipleStatements: true
 });



// ✅ Use a connection from the pool to set up the schema once
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error getting connection from pool:", err.stack);
    return;
  }
  console.log("✅ Connected to MySQL pool");

  connection.query(schema, (err) => {
    if (err) {
      console.error("❌ Error executing schema:", err.message);
    } else {
      console.log("✅ Database and tables created!");
    }
    connection.release(); // ✅ Don't end the pool, just release this one connection
  });
});

module.exports = db;
// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   connection.query("USE CONNECTIFY", function (err, result) {
//     if (err) throw err;
//     console.log("Database Selected");
//   });
// });

// // const pool = createPool({
// //     host: "localhost",
// //     user: "root",
// //     password: "Bishistp@150",
// //     database: "your_database_name"
// // })

