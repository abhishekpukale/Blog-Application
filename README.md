# MyBlog — Full Stack Blog Application

A full stack blog application built from scratch as part of the Codomax Full Stack Development program. Users can register, log in, and create, read, update, and delete their own blog posts through a secure, authenticated dashboard.

## Live Demo

- **Live Website:** [Add your deployed frontend link here]
- **Backend API:** [Add your deployed backend link here]

## Features

- User registration and login with hashed (encrypted) passwords
- JWT-based authentication to protect private routes
- Personal dashboard showing only the logged-in user's own blogs
- Full CRUD functionality: Create, Read, Update, and Delete blog posts
- Individual blog details page
- Logout functionality
- Responsive design that works on both desktop and mobile devices

## Tech Stack

**Frontend**
- HTML5
- CSS3 (with responsive design / media queries)
- Vanilla JavaScript (Fetch API)

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

## Project Structure

```
Blog Application/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── .env (not committed to GitHub)
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── blog-details.html
├── edit-blog.html
├── package.json
└── README.md
```

## Getting Started (Run Locally)

### Prerequisites
- Node.js installed on your computer
- A free MongoDB Atlas account (or local MongoDB installation)

### Installation

1. Clone this repository
```
git clone https://github.com/abhishekpukale/Blog-Application.git
```

2. Navigate to the backend folder and install dependencies
```
cd Blog-Application/backend
npm install
```

3. Create a `.env` file inside the `backend` folder with the following:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

4. Start the backend server
```
node server.js
```

5. Open `index.html` (or any of the frontend pages) in your browser.

## API Endpoints

| Method | Endpoint | Description | Protected |
|--------|----------|--------------|-----------|
| POST | /api/register | Register a new user | No |
| POST | /api/login | Log in and receive a JWT token | No |
| GET | /api/profile | Get logged-in user's profile | Yes |
| POST | /api/blogs | Create a new blog | Yes |
| GET | /api/blogs | Get all blogs | No |
| GET | /api/my-blogs | Get only the logged-in user's blogs | Yes |
| GET | /api/blogs/:id | Get a single blog by ID | No |
| PUT | /api/blogs/:id | Update a blog (owner only) | Yes |
| DELETE | /api/blogs/:id | Delete a blog (owner only) | Yes |

## Author

**Abhishek Pukale**
Built as part of the Codomax Full Stack Development program.

## License

This project is open source and available for learning purposes.