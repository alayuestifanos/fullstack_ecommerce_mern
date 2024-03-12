import mongoose from "mongoose";

import AuthRoles from "../utils/authRoles.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ["true", "Name must be provided"],
    maxLength: [50, "Name must be less than 50 characters"],
    trim: true,
  },

  email: {
    type: String,
    required: ["true", "Email must be provided"],
  },
  password: {
    type: String,
    required: ["true", "Password must be provided"],
    minLength: [8, "Password must be at least 8 chars"],
    select: false,
  },
  role: {
    type: String,
    enum: Object.values(AuthRoles),
    default: AuthRoles.USER,
  },
  forgotPasswordToken: String,
  forgotPasswordExpriry: Date,
});

export default mongoose.model();
