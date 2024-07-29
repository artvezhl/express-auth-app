import { Schema, model } from "mongoose";
import { EGender, IUser } from "../types";
import { userErrors } from "../constants";
import { emailRegex } from "../constants/user/email";

const userSchema = new Schema<IUser>({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return emailRegex.test(value);
      },
      message: userErrors.INVALID_EMAIL,
    },
  },
  password: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, required: true },
  avatar: String,
});

export const User = model<IUser>("User", userSchema);
