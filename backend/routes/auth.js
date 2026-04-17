const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const jwt = require('jsonwebtoken');

const router = express.Router();

   
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;


  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long!" });
  }


  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const avatarColor = Math.floor(Math.random()*16777215).toString(16); // Random color
    const firstLetter = username.charAt(0).toUpperCase();
    const avatar = `https://ui-avatars.com/api/?name=${firstLetter}&background=${avatarColor}&color=fff`;
  

  
    const newUser = new User({ username, email, password: hashedPassword,avatar });
    await newUser.save();



    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration Error" });

    if (err.code === 11000) {
      return res.status(400).json({ error: "Username or Email already exists!" });
    }

    res.status(500).json({ error: "Server error!" });
  
  }
});

// Login Route   

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message: "Login successful!",token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error!" });
  }
});

router.get("/users",async (req, res) => {
  try {
    const users = await User.find({}, "-password"); 
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error!" });
  }
});


module.exports = router;
