// const express = require("express") old way of importing modules
import express from 'express';
import { sql } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT;
console.log("PORT:", PORT)

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS people(
        id SERIAL PRIMARY KEY,
        userID VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("DB Initialized successfully");
    }
    catch (error) {
        console.log("error initializing DB", error);
        process.exit(1);
    }
}

app.get("/", (req, res) => {
    res.send("Response received again");
});


initDB().then(() => {
    app.listen(PORT, () => {
        console.log("server is running on PORT:", PORT);
    });
}); 

