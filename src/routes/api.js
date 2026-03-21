const express = require("express");
const mongoose = require("mongoose");
const Report = require("../models/Report");
const Volunteer = require("../models/Volunteer");
const Task = require("../models/Task");
const { getPriorityFromType } = require("../utils/priority");

const router = express.Router();

router.post("/reports", async (req, res) => {
  try {
    const { type, location, description } = req.body;

    if (!type || !location || !description) {
      return res.status(400).json({
        message: "type, location, and description are required",
      });
    }

    const priority = getPriorityFromType(type);

    const report = await Report.create({
      type,
      location,
      description,
      priority,
      status: "Pending",
    });

    return res.status(201).json(report);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/reports", async (_req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    return res.json(reports);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/volunteers", async (req, res) => {
  try {
    const { name, role, location } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: "name and role are required" });
    }

    const volunteer = await Volunteer.create({
      name,
      role,
      location,
    });

    return res.status(201).json(volunteer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/volunteers", async (req, res) => {
  try {
    const { role } = req.query;

    const filter = role ? { role } : {};

    const volunteers = await Volunteer.find(filter).sort({ createdAt: -1 });

    return res.json(volunteers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/volunteers/available", async (_req, res) => {
  try {
    const volunteers = await Volunteer.find({ isAvailable: true });
    return res.json(volunteers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.post("/assign", async (req, res) => {
  try {
    const { reportId, volunteerId } = req.body;

    if (!reportId || !volunteerId) {
      return res
        .status(400)
        .json({ message: "reportId and volunteerId are required" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(reportId) ||
      !mongoose.Types.ObjectId.isValid(volunteerId)
    ) {
      return res.status(400).json({ message: "Invalid reportId or volunteerId" });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    const task = await Task.create({
      reportId,
      volunteerId,
      status: "Assigned",
    });

    report.status = "Assigned";
    await report.save();

    const populatedTask = await Task.findById(task._id)
      .populate("reportId")
      .populate("volunteerId");

    return res.status(201).json(populatedTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/auto-assign", async (req, res) => {
  try {
    const { reportId } = req.body;

    if (!reportId) {
      return res.status(400).json({ message: "reportId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: "Invalid reportId" });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // 🔥 Smart selection (basic for now)
    let volunteer;

    // Priority-based assignment
    if (report.priority === "High") {
      volunteer = await Volunteer.findOne({ role: "Rescue Team" });
    } else {
      volunteer = await Volunteer.findOne();
    }

    if (!volunteer) {
      return res.status(404).json({ message: "No volunteers available" });
    }

    const task = await Task.create({
      reportId: report._id,
      volunteerId: volunteer._id,
      status: "Assigned",
    });

    report.status = "Assigned";
    await report.save();

    const populatedTask = await Task.findById(task._id)
      .populate("reportId")
      .populate("volunteerId");

    return res.status(201).json(populatedTask);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/report/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid report id" });
    }

    if (!status || !["Pending", "Assigned", "Completed"].includes(status)) {
      return res.status(400).json({
        message: "status must be one of Pending, Assigned, Completed",
      });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.json(updatedReport);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
