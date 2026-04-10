const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

/* ================= ADD PROJECT ================= */
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
      style: req.body.style,
      category: req.body.category,
      status: req.body.status,
      user: req.user.id,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("Project creation failed:", err);
    res.status(500).json({ message: "Project creation failed" });
  }
});

/* ================= GET PROJECTS ================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (err) {
    console.error("Fetching projects failed:", err);
    res.status(500).json({ message: "Fetching projects failed" });
  }
});

/* ================= DELETE PROJECT ================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ================= UPDATE PROJECT ================= */
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
      style: req.body.style,
      category: req.body.category,
      status: req.body.status,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(project);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;