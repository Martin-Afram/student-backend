// Import Mongoose for defining the student schema and model.
const mongoose = require("mongoose");

// Store the Mongoose schema constructor in a shorter local name.
const Schema = mongoose.Schema;

// Define the fields and validation rules for student documents.
const StudentSchema = new Schema(
  {
    // Store the student's full name.
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },

    // Store a unique student ID number (e.g. STU-2024-001).
    studentId: {
      type: String,
      unique: true,
    },

    // Store the student's age.
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [5, "Age must be at least 5"],
      max: [100, "Age must be at most 100"],
    },

    // Store the student's gender.
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
      lowercase: true,
    },

    // Store the student's home address / location.
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    // Store the student's phone number as a string to preserve leading zeros.
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },

    // Store the student's email for direct contact.
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    // Store the student's class / grade level (e.g. "Grade 10", "JSS 2").
    gradeLevel: {
      type: String,
      required: [true, "Grade level is required"],
      trim: true,
    },

    // Store the section or arm within the class (e.g. "A", "B").
    section: {
      type: String,
      trim: true,
      uppercase: true,
      default: "A",
    },

    // Store the list of subjects the student is enrolled in.
    subjects: [
      {
        type: String,
        trim: true,
      },
    ],

    // Store the student's academic results per term.
    grades: [
      {
        // The subject this grade belongs to.
        subject: { type: String, required: true },
        // The score achieved.
        score: { type: Number, min: 0, max: 100 },
        // Letter grade automatically derived from the score.
        grade: { type: String },
        // The academic term this grade was recorded in.
        term: { type: String },
        // The academic session / year (e.g. "2024/2025").
        session: { type: String },
      },
    ],

    // Store attendance counts for easy percentage calculation.
    attendance: {
      // Total school days held so far this session.
      totalDays: { type: Number, default: 0 },
      // Number of days the student was present.
      daysPresent: { type: Number, default: 0 },
    },

    // Store the name of the student's parent or guardian.
    parentName: {
      type: String,
      trim: true,
    },

    // Store the phone number of the parent or guardian.
    parentPhone: {
      type: String,
    },

    // Store the student's enrollment status.
    status: {
      type: String,
      enum: ["active", "inactive", "graduated", "suspended"],
      default: "active",
    },

    // Store the date the student was admitted into the school.
    admissionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps.
    timestamps: true,
  }
);

// ---------------------------------------------------------------------------
// Virtual — compute attendance percentage on the fly.
// ---------------------------------------------------------------------------
StudentSchema.virtual("attendancePercentage").get(function () {
  if (!this.attendance.totalDays) return 0;
  return ((this.attendance.daysPresent / this.attendance.totalDays) * 100).toFixed(1);
});

// ---------------------------------------------------------------------------
// Virtual — compute the student's average score across all recorded grades.
// ---------------------------------------------------------------------------
StudentSchema.virtual("averageScore").get(function () {
  if (!this.grades.length) return null;
  const sum = this.grades.reduce((acc, g) => acc + (g.score || 0), 0);
  return (sum / this.grades.length).toFixed(1);
});

// ---------------------------------------------------------------------------
// Pre-save hook — auto-generate a studentId if one is not already set.
// ---------------------------------------------------------------------------
StudentSchema.pre("save", async function (next) {
  if (!this.studentId) {
    const year = new Date().getFullYear();
    // Count existing students to build a sequential ID.
    const count = await mongoose.model("Student").countDocuments();
    this.studentId = `STU-${year}-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

// Make virtuals available when the document is converted to JSON.
StudentSchema.set("toJSON", { virtuals: true });
StudentSchema.set("toObject", { virtuals: true });

// Create and export the Mongoose model.
const StudentModel = mongoose.model("Student", StudentSchema);
module.exports = StudentModel;
