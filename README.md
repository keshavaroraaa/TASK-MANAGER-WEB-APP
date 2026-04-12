# ✅ TaskMate — Task Manager Web App

A beginner-friendly full-stack task management app built with:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (JSON Web Tokens)

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── controllers/
│   │   ├── authController.js    ← Handles signup & login logic
│   │   └── taskController.js    ← Handles CRUD operations for tasks
│   ├── middleware/
│   │   └── authMiddleware.js    ← Verifies JWT token on protected routes
│   ├── models/
│   │   ├── User.js              ← MongoDB User schema
│   │   └── Task.js              ← MongoDB Task schema
│   ├── routes/
│   │   ├── authRoutes.js        ← /api/auth endpoints
│   │   └── taskRoutes.js        ← /api/tasks endpoints (protected)
│   ├── server.js                ← Main entry point
│   ├── package.json             ← Dependencies
│   └── .env.example             ← Copy this to .env and fill in values
│
└── frontend/
    ├── index.html               ← Landing page
    ├── login.html               ← Login page
    ├── signup.html              ← Signup page
    ├── dashboard.html           ← Main task manager UI
    ├── style.css                ← All styles
    ├── script.js                ← Shared utilities (API helper, auth guard)
    └── dashboard.js             ← Dashboard-specific logic (CRUD, filter)
```

---

## 🚀 How to Run the Project

### Step 1 — Install Node.js
Download and install Node.js from https://nodejs.org (LTS version recommended).

Verify it's installed:
```bash
node --version
npm --version
```

### Step 2 — Install MongoDB
**Option A: Local MongoDB**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install it and start the MongoDB service.
3. Your connection string will be: `mongodb://localhost:27017/taskmanager`

**Option B: MongoDB Atlas (cloud, free tier)**
1. Go to https://cloud.mongodb.com and create a free account.
2. Create a free cluster.
3. Click "Connect" → "Drivers" and copy your connection string.
4. It will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager`

### Step 3 — Set Up Environment Variables
1. Go into the `backend/` folder.
2. Copy `.env.example` to a new file called `.env`:
   ```bash
   # On Mac/Linux:
   cp .env.example .env
   
   # On Windows:
   copy .env.example .env
   ```
3. Open `.env` and fill in your values:
   ```
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=any_long_random_secret_string_here
   PORT=5000
   ```

### Step 4 — Install Dependencies
Navigate to the `backend/` folder and install Node packages:
```bash
cd backend
npm install
```

### Step 5 — Start the Backend Server
```bash
npm start
```
You should see:
```
✅ Connected to MongoDB
🚀 Server running at http://localhost:5000
```

### Step 6 — Open the Frontend
The backend automatically serves the frontend files.
Open your browser and go to: **http://localhost:5000**

That's it! You can now:
1. Sign up for a new account
2. Log in
3. Create, edit, complete, and delete tasks

---

## 🔌 API Endpoints Reference

| Method | Endpoint            | Auth Required | Description          |
|--------|---------------------|--------------|----------------------|
| POST   | /api/auth/signup    | No           | Register a new user  |
| POST   | /api/auth/login     | No           | Log in a user        |
| GET    | /api/tasks          | Yes ✅        | Get all user tasks   |
| POST   | /api/tasks          | Yes ✅        | Create a new task    |
| PUT    | /api/tasks/:id      | Yes ✅        | Update a task        |
| DELETE | /api/tasks/:id      | Yes ✅        | Delete a task        |

---

## 💡 Tips for Beginners

- **JWT Token**: After login, a token is saved in `localStorage`. It is sent automatically with every API request to prove you're logged in.
- **Protected Routes**: The backend checks the token before allowing access to task endpoints. If the token is missing or expired, you'll get a 401 error.
- **Passwords**: Passwords are hashed with `bcryptjs` before being stored — the database never stores your plain-text password.
- **Nodemon** (optional): Instead of `npm start`, use `npm run dev` to auto-restart the server on code changes. (Requires `npm install -g nodemon` or it's included in devDependencies.)

---

## ❓ Common Issues

**"Cannot connect to MongoDB"**
→ Make sure MongoDB is running locally, or double-check your Atlas connection string in `.env`.

**"Port 5000 already in use"**
→ Change `PORT=5001` in `.env` or kill the process using port 5000.

**Blank screen / no tasks loading**
→ Open browser DevTools (F12) → Console tab and check for errors.
