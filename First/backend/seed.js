// ---------------------------------------------------------------------------
// seed.js — populate the database with realistic demo data.
// Run with:  node seed.js
// ---------------------------------------------------------------------------

require("dotenv").config();
const mongoose = require("mongoose");
const StudentModel = require("./model/student");
const UserModel = require("./model/user");

const MONGO_URL = process.env.MONGO_URL;

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const users = [
  {
    name: "Admin User",
    email: "admin@school.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Mr. Aliyu Bello",
    email: "aliyu.bello@school.com",
    password: "teacher123",
    role: "teacher",
  },
  {
    name: "Mrs. Ngozi Okafor",
    email: "ngozi.okafor@school.com",
    password: "teacher123",
    role: "teacher",
  },
];

const students = [
  {
    name: "Amina Musa",
    age: 15,
    gender: "female",
    location: "Kano, Nigeria",
    phoneNumber: "08031234567",
    email: "amina.musa@student.school.com",
    gradeLevel: "SS1",
    section: "A",
    subjects: ["Mathematics", "English", "Physics", "Chemistry", "Biology"],
    grades: [
      { subject: "Mathematics", score: 88, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "English", score: 75, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Physics", score: 80, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "Chemistry", score: 72, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Biology", score: 91, grade: "A", term: "First Term", session: "2024/2025" },
    ],
    attendance: { totalDays: 60, daysPresent: 57 },
    parentName: "Hajiya Maryam Musa",
    parentPhone: "08091234567",
    status: "active",
    admissionDate: new Date("2023-09-01"),
  },
  {
    name: "Chukwuemeka Obi",
    age: 16,
    gender: "male",
    location: "Enugu, Nigeria",
    phoneNumber: "08045678901",
    email: "emeka.obi@student.school.com",
    gradeLevel: "SS2",
    section: "B",
    subjects: ["Mathematics", "English", "Economics", "Government", "Literature"],
    grades: [
      { subject: "Mathematics", score: 65, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "English", score: 70, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Economics", score: 83, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "Government", score: 77, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Literature", score: 88, grade: "A", term: "First Term", session: "2024/2025" },
    ],
    attendance: { totalDays: 60, daysPresent: 52 },
    parentName: "Mr. Joseph Obi",
    parentPhone: "08071234567",
    status: "active",
    admissionDate: new Date("2022-09-05"),
  },
  {
    name: "Fatima Al-Hassan",
    age: 14,
    gender: "female",
    location: "Kaduna, Nigeria",
    phoneNumber: "08056789012",
    email: "fatima.hassan@student.school.com",
    gradeLevel: "JSS3",
    section: "A",
    subjects: ["Mathematics", "English", "Basic Science", "Social Studies", "Civic Education"],
    grades: [
      { subject: "Mathematics", score: 94, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "English", score: 89, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "Basic Science", score: 91, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "Social Studies", score: 78, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Civic Education", score: 85, grade: "A", term: "First Term", session: "2024/2025" },
    ],
    attendance: { totalDays: 60, daysPresent: 60 },
    parentName: "Dr. Abubakar Al-Hassan",
    parentPhone: "08012345678",
    status: "active",
    admissionDate: new Date("2024-01-10"),
  },
  {
    name: "Tunde Adeyemi",
    age: 17,
    gender: "male",
    location: "Lagos, Nigeria",
    phoneNumber: "08067890123",
    email: "tunde.adeyemi@student.school.com",
    gradeLevel: "SS3",
    section: "A",
    subjects: ["Mathematics", "English", "Further Mathematics", "Physics", "Chemistry"],
    grades: [
      { subject: "Mathematics", score: 72, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "English", score: 68, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Further Mathematics", score: 55, grade: "C", term: "First Term", session: "2024/2025" },
      { subject: "Physics", score: 79, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Chemistry", score: 63, grade: "B", term: "First Term", session: "2024/2025" },
    ],
    attendance: { totalDays: 60, daysPresent: 45 },
    parentName: "Mrs. Bisi Adeyemi",
    parentPhone: "08023456789",
    status: "active",
    admissionDate: new Date("2021-09-01"),
  },
  {
    name: "Zainab Ibrahim",
    age: 13,
    gender: "female",
    location: "Abuja, Nigeria",
    phoneNumber: "08078901234",
    email: "zainab.ibrahim@student.school.com",
    gradeLevel: "JSS2",
    section: "B",
    subjects: ["Mathematics", "English", "Basic Science", "Computer Studies", "French"],
    grades: [
      { subject: "Mathematics", score: 80, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "English", score: 84, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "Basic Science", score: 76, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Computer Studies", score: 90, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "French", score: 70, grade: "B", term: "First Term", session: "2024/2025" },
    ],
    attendance: { totalDays: 60, daysPresent: 58 },
    parentName: "Alhaji Musa Ibrahim",
    parentPhone: "08034567890",
    status: "active",
    admissionDate: new Date("2024-01-15"),
  },
  {
    name: "David Nwosu",
    age: 16,
    gender: "male",
    location: "Port Harcourt, Nigeria",
    phoneNumber: "08089012345",
    email: "david.nwosu@student.school.com",
    gradeLevel: "SS1",
    section: "C",
    subjects: ["Mathematics", "English", "Agricultural Science", "Geography", "Economics"],
    grades: [
      { subject: "Mathematics", score: 49, grade: "D", term: "First Term", session: "2024/2025" },
      { subject: "English", score: 60, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Agricultural Science", score: 74, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Geography", score: 58, grade: "C", term: "First Term", session: "2024/2025" },
      { subject: "Economics", score: 65, grade: "B", term: "First Term", session: "2024/2025" },
    ],
    attendance: { totalDays: 60, daysPresent: 40 },
    parentName: "Mr. Emmanuel Nwosu",
    parentPhone: "08045678901",
    status: "active",
    admissionDate: new Date("2023-09-01"),
  },
  {
    name: "Aisha Garba",
    age: 15,
    gender: "female",
    location: "Sokoto, Nigeria",
    phoneNumber: "08090123456",
    email: "aisha.garba@student.school.com",
    gradeLevel: "SS1",
    section: "A",
    subjects: ["Mathematics", "English", "Biology", "Chemistry", "Health Science"],
    grades: [
      { subject: "Mathematics", score: 62, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "English", score: 77, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Biology", score: 85, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "Chemistry", score: 69, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Health Science", score: 88, grade: "A", term: "First Term", session: "2024/2025" },
    ],
    attendance: { totalDays: 60, daysPresent: 55 },
    parentName: "Alhaja Hauwa Garba",
    parentPhone: "08056789012",
    status: "active",
    admissionDate: new Date("2023-09-01"),
  },
  {
    name: "Oluwaseun Adeleke",
    age: 12,
    gender: "male",
    location: "Ibadan, Nigeria",
    phoneNumber: "08001234567",
    email: "seun.adeleke@student.school.com",
    gradeLevel: "JSS1",
    section: "A",
    subjects: ["Mathematics", "English", "Basic Science", "Social Studies", "CRS"],
    grades: [
      { subject: "Mathematics", score: 71, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "English", score: 68, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Basic Science", score: 75, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Social Studies", score: 80, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "CRS", score: 90, grade: "A", term: "First Term", session: "2024/2025" },
    ],
    attendance: { totalDays: 60, daysPresent: 59 },
    parentName: "Pastor Dele Adeleke",
    parentPhone: "08067890123",
    status: "active",
    admissionDate: new Date("2024-09-01"),
  },
  {
    name: "Grace Eze",
    age: 17,
    gender: "female",
    location: "Anambra, Nigeria",
    phoneNumber: "08012309876",
    email: "grace.eze@student.school.com",
    gradeLevel: "SS3",
    section: "B",
    subjects: ["Mathematics", "English", "Biology", "Chemistry", "Physics"],
    grades: [
      { subject: "Mathematics", score: 95, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "English", score: 92, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "Biology", score: 97, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "Chemistry", score: 89, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "Physics", score: 93, grade: "A", term: "First Term", session: "2024/2025" },
    ],
    attendance: { totalDays: 60, daysPresent: 60 },
    parentName: "Chief Mrs. Adaeze Eze",
    parentPhone: "08078901234",
    status: "active",
    admissionDate: new Date("2021-09-01"),
  },
  {
    name: "Usman Yusuf",
    age: 16,
    gender: "male",
    location: "Bauchi, Nigeria",
    phoneNumber: "08023456781",
    email: "usman.yusuf@student.school.com",
    gradeLevel: "SS2",
    section: "A",
    subjects: ["Mathematics", "English", "Islamic Studies", "Arabic", "History"],
    grades: [
      { subject: "Mathematics", score: 55, grade: "C", term: "First Term", session: "2024/2025" },
      { subject: "English", score: 61, grade: "B", term: "First Term", session: "2024/2025" },
      { subject: "Islamic Studies", score: 95, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "Arabic", score: 88, grade: "A", term: "First Term", session: "2024/2025" },
      { subject: "History", score: 72, grade: "B", term: "First Term", session: "2024/2025" },
    ],
    attendance: { totalDays: 60, daysPresent: 53 },
    parentName: "Mallam Yusuf Abdullahi",
    parentPhone: "08089012345",
    status: "active",
    admissionDate: new Date("2022-09-01"),
  },
];

// ---------------------------------------------------------------------------
// Main seeder function
// ---------------------------------------------------------------------------
async function seed() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected");

    // Wipe existing data so the seed is idempotent.
    await StudentModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log("🗑️  Cleared existing students and users");

    // Insert users (passwords will be hashed by the pre-save hook).
    const createdUsers = await UserModel.create(users);
    console.log(`👤 Seeded ${createdUsers.length} user(s):`);
    createdUsers.forEach((u) => console.log(`   • ${u.role.toUpperCase()} — ${u.email}`));

    // Insert students.
    const createdStudents = await StudentModel.create(students);
    console.log(`🎓 Seeded ${createdStudents.length} student(s):`);
    createdStudents.forEach((s) =>
      console.log(`   • ${s.studentId}  ${s.name}  (${s.gradeLevel})`)
    );

    console.log("\n🌱 Database seeded successfully!");
    console.log("\n🔑 Login credentials:");
    console.log("   Admin  → admin@school.com      / admin123");
    console.log("   Teacher→ aliyu.bello@school.com / teacher123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
