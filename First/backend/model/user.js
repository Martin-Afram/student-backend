// Import Mongoose for defining schemas and models.
const mongoose = require("mongoose");

// Import bcrypt for securely hashing user passwords.
const bcrypt = require("bcrypt");

// Store the Mongoose schema constructor in a shorter local name.
const Schema = mongoose.Schema;

// Define the fields and validation rules for user (staff/admin) documents.
const UserSchema = new Schema(
  {
    // Display name of the user.
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
    },

    // Email used to log in.
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password stored after the pre-save hook runs.
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    // Role that controls what the user can do in the system.
    role: {
      type: String,
      enum: ["admin", "teacher", "staff"],
      default: "staff",
    },

    // Whether the account is currently active.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps.
    timestamps: true,
  }
);

// ---------------------------------------------------------------------------
// Pre-save hook — hash the password only when it has been modified.
// ---------------------------------------------------------------------------
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ---------------------------------------------------------------------------
// Instance method — compare a plain-text password against the stored hash.
// ---------------------------------------------------------------------------
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the Mongoose model.
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
