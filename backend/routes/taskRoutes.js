// ===========================
// routes/taskRoutes.js
// ===========================

const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// All task routes are protected — user must be logged in
// The "protect" middleware runs first and verifies the JWT token

// GET    /api/tasks        — Get all tasks for the user
router.get("/", protect, getTasks);

// POST   /api/tasks        — Create a new task
router.post("/", protect, createTask);

// PUT    /api/tasks/:id    — Update a specific task
router.put("/:id", protect, updateTask);

// DELETE /api/tasks/:id    — Delete a specific task
router.delete("/:id", protect, deleteTask);

module.exports = router;

