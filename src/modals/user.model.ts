import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

// ---- USER STATUS ----
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
}

// ---- COORDINATES ----
const CoordinatesSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

// ---- ADDRESS ----
const AddressSchema = new Schema(
  {
    label: { type: String, enum: ["home", "office", "other"], default: "home" },
    fullAddress: { type: String, required: true },
    coordinates: { type: CoordinatesSchema, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

// ---- USER INTERFACE ----
export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  avatar?: string;

  status: UserStatus;
  addresses: typeof AddressSchema[];

  fcmToken?: string;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidate: string): Promise<boolean>;
  generateJWT(): string;
}

// ---- USER SCHEMA ----
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: { type: String, required: true },

    avatar: { type: String },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },

    addresses: { type: [AddressSchema], default: [] },

    fcmToken: { type: String }, // optional push notifications
  },
  { timestamps: true }
);

// ---- HASH PASSWORD ----
UserSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  next();
});

// ---- COMPARE PASSWORD ----
UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// ---- GENERATE JWT ----
UserSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id }, config.jwt.secret, {
    expiresIn: "7d",
  });
};

export const User = mongoose.model<IUser>("User", UserSchema);
