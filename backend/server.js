const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Temporary storage
const users = [];
const blogs = [];

// Test API
app.get("/", (req, res) => {
    res.send("Blog Application Backend is Running!");
});

// User Registration API
app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const user = {
        id: users.length + 1,
        name,
        email,
        password
    };

    users.push(user);

    res.status(201).json({
        message: "Registration successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// User Login API
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        user => user.email === email && user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// Create Blog API
app.post("/api/blogs", (req, res) => {
    const { title, author, content } = req.body;

    if (!title || !author || !content) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const blog = {
        id: blogs.length + 1,
        title,
        author,
        content
    };

    blogs.push(blog);

    res.status(201).json({
        message: "Blog created successfully",
        blog
    });
});

// Get all blogs
app.get("/api/blogs", (req, res) => {
    res.json(blogs);
});

// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});