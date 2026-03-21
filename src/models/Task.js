const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      required: true,
    },
    status: {
      type: String,
      enum: ["Assigned", "Completed"],
      default: "Assigned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
