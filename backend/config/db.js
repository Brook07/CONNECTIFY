import {neon} from "@neondatabase/serverless";
import mysql2 from 'mysql2';
import "dotenv/config";
import dotenv from 'dotenv';

// creates a sql connection using the database url
// export const sql = neon(process.env.DB_URL);
// function to write sql queries 

dotenv.config();

export const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true
});
