const express = require("express");
const router = express.Router();

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  addGrade,
  updateAttendance,
  getDashboardStats,
} = require("../Controllers/usersController");

const { protect, authorise } = require("../middleware/authMiddleware");

// ---------------------------------------------------------------------------
// All student routes are protected — caller must supply a valid JWT.
// ---------------------------------------------------------------------------

// GET  /students/stats  — dashboard summary (admin & teachers only).
router.get("/students/stats", protect, authorise("admin", "teacher"), getDashboardStats);

// GET  /students        — list all students (search, filter, paginate).
router.get("/students", protect, getAllStudents);

// POST /students        — create a new student (admin & teachers).
router.post("/students", protect, authorise("admin", "teacher"), createStudent);

// GET  /students/:id    — get one student by ID.
router.get("/students/:id", protect, getStudentById);

// PATCH /students/:id   — update student details (admin & teachers).
router.patch("/students/:id", protect, authorise("admin", "teacher"), updateStudent);

// DELETE /students/:id  — permanently delete a student (admin only).
router.delete("/students/:id", protect, authorise("admin"), deleteStudent);

// POST /students/:id/grades     — add a grade entry to a student.
router.post("/students/:id/grades", protect, authorise("admin", "teacher"), addGrade);

// PATCH /students/:id/attendance — update attendance record.
router.patch("/students/:id/attendance", protect, authorise("admin", "teacher"), updateAttendance);

module.exports = router;
