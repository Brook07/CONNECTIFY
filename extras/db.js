import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// creates a sql connection using the database url
export const sql = neon(process.env.DB_URL);
// function to write sql queries 