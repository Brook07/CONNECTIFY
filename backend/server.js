import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mysql2 from 'mysql2';
import signUpRoute from './routes/signUpRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// middleware: a function in between request and response
// express.json(): parses JSON data and makes it available in the request body 
app.use(express.json());
app.use(cors());

const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true
});

const schema = `
create table if not exists user2( 
  user_ID int primary key auto_increment, 
  first_name varchar(255),
  middle_name varchar(255),
  last_name varchar(255),
  DOB date, 
  gender int null,
  district varchar(255) null,
  city varchar(255) null,
    street_address varchar(255) null,
    date_created date null,
    email varchar(255) null,
    password varchar(255) null,
    contact_no varchar(20) null
);

create table if not exists chat(
	chat_ID int primary key auto_increment,
	sender_ID int,
	receiver_ID int,
    text_message text,
    message_time timestamp default current_timestamp,
    foreign key(sender_ID) references user(user_ID) on delete cascade,
    foreign key(receiver_ID) references user(user_ID) on delete cascade
);

create table if not exists connections(
	connection_ID int primary key auto_increment,
    request_sender_ID int,
    request_receiver_ID int,
    request_time timestamp,
    foreign key(request_sender_ID) references user(user_ID) on delete cascade,
    foreign key(request_receiver_ID) references user(user_ID) on delete cascade
);
`;

app.use('/api/user', signUpRoute);

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  // connection.query(alter, function(err, result){});
  connection.query(schema, function (err, result) {
    if (err) throw err;
    console.log("Database Created!!");
    app.listen(PORT, () => {
      console.log("Server running on PORT:", PORT);
    })
  });
});


// --------------------------------------
// // const express = require("express") old way of importing modules
// import express from 'express';
// import { sql } from './config/db.js';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();

// const PORT = process.env.PORT;
// console.log("PORT:", PORT)

// async function initDB() {
//     try {
//         await sql`CREATE TABLE IF NOT EXISTS people(
//         id SERIAL PRIMARY KEY,
//         userID VARCHAR(255) NOT NULL,
//         title VARCHAR(255) NOT NULL,
//         amount DECIMAL(10,2) NOT NULL,
//         category VARCHAR(255) NOT NULL,
//         created_at DATE NOT NULL DEFAULT CURRENT_DATE
//         )`

//         console.log("DB Initialized successfully");
//     }
//     catch (error) {
//         console.log("error initializing DB", error);
//         process.exit(1);
//     }
// }

// app.get("/", (req, res) => {
//     res.send("Response received again");
// });


// initDB().then(() => {
//     app.listen(PORT, () => {
//         console.log("server is running on PORT:", PORT);
//     });
// }); 

