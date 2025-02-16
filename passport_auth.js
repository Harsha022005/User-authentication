import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import cors from "cors";

const app = express();
const port = 3000;

// Database connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Authentication",
  password: "22L31A0568",
  port: 5432,
});

db.connect()
  .then(() => console.log("pg database is connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: "my_auth",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(
  new Strategy({ usernameField: "email" }, async function (email, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users_auth WHERE email=$1", [email]);
      if (result.rows.length === 0) {
        return cb(null, false, { message: "User does not have an account" });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return cb(null, false, { message: "Incorrect password" });
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users_auth WHERE id=$1", [id]);
    cb(null, result.rows[0]);
  } catch (err) {
    cb(err);
  }
});

// Login Route
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await db.query("SELECT * FROM users_auth WHERE email=$1", [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users_auth (name, email, password) VALUES ($1, $2, $3)", [
      name,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout Route
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
