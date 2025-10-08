import express from 'express';
import { connection } from '../config/db.js';

const router = express.Router();
const app = express();

export default router;

router.post('/signup', async (req, res) => {
  
  console.log(req.body);
  try {
    const { emailAddress } = req.body;

    if (!emailAddress)
      return res.status(400).json({ message: "All fields are required" });

    const user = connection.query(
      `INSERT INTO USER2(email) VALUES(?);`,
      [emailAddress],
      function (err, result) {
        if (err) throw err;
        console.log("User created!!");
        res.status(201).json({ message: "User Created!!" });
        res.status(201).json(user[0]);
      });
  }
  catch (error) {
    console.log("Error creating a new user", error);
    res.status(500).json({ message: "internal server error" });
  }
});
