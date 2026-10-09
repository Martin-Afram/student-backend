// Import the StudentModel for all database operations.
const StudentModel = require("../model/student");

// ---------------------------------------------------------------------------
// Helper — convert a raw score into a letter grade.
// ---------------------------------------------------------------------------
const scoreToGrade = (score) => {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  return "F";
};

// ---------------------------------------------------------------------------
// createStudent — create a new student record.
// POST /students
// ---------------------------------------------------------------------------
const createStudent = async (req, res) => {
  try {
    // Auto-derive letter grades when the caller supplies raw scores.
    if (Array.isArray(req.body.grades)) {
      req.body.grades = req.body.grades.map((g) => ({
        ...g,
        grade: scoreToGrade(g.score),
      }));
    }

    const student = await StudentModel.create(req.body);
    res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// getAllStudents — retrieve all students with optional filtering, search,
//                 sorting, and pagination.
// GET /students?search=&gradeLevel=&status=&page=&limit=&sort=
// ---------------------------------------------------------------------------
const getAllStudents = async (req, res) => {
  try {
    const {
      search,
      gradeLevel,
      status,
      gender,
      page = 1,
      limit = 20,
      sort = "-createdAt",
    } = req.query;

    // Build the filter object incrementally.
    const filter = {};

    // Full-text search across name, studentId, email, and location.
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (gradeLevel) filter.gradeLevel = { $regex: gradeLevel, $options: "i" };
    if (status) filter.status = status;
    if (gender) filter.gender = gender;

    // Pagination arithmetic.
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Run count and data query in parallel.
    const [total, students] = await Promise.all([
      StudentModel.countDocuments(filter),
      StudentModel.find(filter).sort(sort).skip(skip).limit(limitNum),
    ]);

    res.status(200).json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// getStudentById — retrieve a single student by MongoDB ObjectId.
// GET /students/:id
// ---------------------------------------------------------------------------
const getStudentById = async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// updateStudent — update one or more fields of a student record.
// PATCH /students/:id
// ---------------------------------------------------------------------------
const updateStudent = async (req, res) => {
  try {
    // Re-derive letter grades when the caller updates scores.
    if (Array.isArray(req.body.grades)) {
      req.body.grades = req.body.grades.map((g) => ({
        ...g,
        grade: scoreToGrade(g.score),
      }));
    }

    const student = await StudentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// deleteStudent — permanently remove a student record.
// DELETE /students/:id
// ---------------------------------------------------------------------------
const deleteStudent = async (req, res) => {
  try {
    const student = await StudentModel.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: `Student ${student.name} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// addGrade — append a grade entry to a specific student.
// POST /students/:id/grades
// ---------------------------------------------------------------------------
const addGrade = async (req, res) => {
  try {
    const { subject, score, term, session } = req.body;

    if (!subject || score === undefined) {
      return res.status(400).json({ message: "Subject and score are required" });
    }

    const gradeEntry = { subject, score, grade: scoreToGrade(score), term, session };

    const student = await StudentModel.findByIdAndUpdate(
      req.params.id,
      { $push: { grades: gradeEntry } },
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Grade added", student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// updateAttendance — mark attendance for a given student.
// PATCH /students/:id/attendance
// Body: { totalDays, daysPresent }
// ---------------------------------------------------------------------------
const updateAttendance = async (req, res) => {
  try {
    const { totalDays, daysPresent } = req.body;

    if (totalDays === undefined || daysPresent === undefined) {
      return res.status(400).json({ message: "totalDays and daysPresent are required" });
    }

    if (daysPresent > totalDays) {
      return res.status(400).json({ message: "Days present cannot exceed total days" });
    }

    const student = await StudentModel.findByIdAndUpdate(
      req.params.id,
      { attendance: { totalDays, daysPresent } },
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({
      message: "Attendance updated",
      attendancePercentage: student.attendancePercentage + "%",
      student,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// getDashboardStats — aggregate summary figures for the dashboard.
// GET /students/stats
// ---------------------------------------------------------------------------
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      activeStudents,
      genderBreakdown,
      gradeBreakdown,
    ] = await Promise.all([
      StudentModel.countDocuments(),
      StudentModel.countDocuments({ status: "active" }),
      StudentModel.aggregate([
        { $group: { _id: "$gender", count: { $sum: 1 } } },
      ]),
      StudentModel.aggregate([
        { $group: { _id: "$gradeLevel", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.status(200).json({
      totalStudents,
      activeStudents,
      inactiveStudents: totalStudents - activeStudents,
      genderBreakdown,
      gradeBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  addGrade,
  updateAttendance,
  getDashboardStats,
};
