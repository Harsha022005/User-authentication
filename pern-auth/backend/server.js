import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import cors from 'cors';

const app = express();
const port = 3000;
const saltRounds = 10;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Authentication",
  password: "22L31A0568",
  port: 5432,
});

(async () => {
  try {
    await db.connect();
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
})();

app.use(express.json());
app.use(cors());


// Signup route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await db.query(
      "SELECT * FROM users_auth WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log(existingUser);
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newuser = await db.query(
      "INSERT INTO users_auth (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userResult = await db.query(
      "SELECT * FROM users_auth WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "User does not exist. Please sign up." });
    }

    const isMatch = await bcrypt.compare(password, userResult.rows[0].password);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    return res.status(200).json({ message: "Login successful. Welcome back!" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
