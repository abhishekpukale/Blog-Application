require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Blog = require("./models/Blog");
const authenticate = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Blog Application Backend is Running!");
});

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

app.get("/api/profile", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

app.post("/api/blogs", authenticate, async (req, res) => {
    try {
        const { title, author, content } = req.body;

        if (!title || !author || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const blog = await Blog.create({
            title,
            author,
            content,
            user: req.userId
        });

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

app.get("/api/my-blogs", authenticate, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

app.get("/api/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

app.put("/api/blogs/:id", authenticate, async (req, res) => {
    try {
        const { title, author, content } = req.body;

        if (!title || !author || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.user.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not allowed to edit this blog" });
        }

        blog.title = title;
        blog.author = author;
        blog.content = content;
        await blog.save();

        res.json({
            message: "Blog updated successfully",
            blog
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

app.delete("/api/blogs/:id", authenticate, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.user.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not allowed to delete this blog" });
        }

        await Blog.findByIdAndDelete(req.params.id);

        res.json({ message: "Blog deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});