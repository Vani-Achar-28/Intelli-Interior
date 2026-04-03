const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    budget: { type: Number, required: true },
    style: String,

    category: {
      type: String,
      enum: ["Living Room", "Bedroom", "Kitchen", "Office", "Commercial"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed"],
      default: "Planning",
    },

    image: {
      type: String,
      default: null,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);