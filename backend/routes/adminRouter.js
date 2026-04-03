const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const User = require("../models/User");
const Project = require("../models/Project");

const router = express.Router();

/* ===============================
   ADMIN DASHBOARD
================================ */
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find().select("-password");

      const projects = await Project.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      const totalUsers = users.length;
      const totalProjects = projects.length;

      const totalBudget = projects.reduce(
        (sum, p) => sum + Number(p.budget || 0),
        0
      );

      const completedProjects = projects.filter(
        (p) => p.status === "Completed"
      ).length;

      const ongoingProjects = projects.filter(
        (p) => p.status === "In Progress"
      ).length;

      res.json({
        totalUsers,
        totalProjects,
        totalBudget,
        completedProjects,
        ongoingProjects,
        users,
        projects,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Admin dashboard error" });
    }
  }
);

/* ===============================
   DELETE USER (ADMIN)
================================ */
router.delete(
  "/user/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Delete user failed" });
    }
  }
);

/* ===============================
   DELETE PROJECT (ADMIN)
================================ */
router.delete(
  "/project/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.params.id);
      res.json({ message: "Project deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Delete project failed" });
    }
  }
);

/* ===============================
   UPDATE PROJECT STATUS (ADMIN) ✅
================================ */
router.put(
  "/project/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const project = await Project.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      res.json(project);
    } catch (err) {
      res.status(500).json({ message: "Update status failed" });
    }
  }
);

module.exports = router;
