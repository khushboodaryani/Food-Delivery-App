import mongoose, { Document, Schema } from "mongoose";

export interface IUserPreference extends Document {
  user: mongoose.Types.ObjectId;
  preferences: Record<string, any>;
  status: boolean;
}

const userPreferenceSchema = new Schema<IUserPreference>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    preferences: { type: Schema.Types.Mixed, default: {} }, // flexible preferences object
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const UserPreference = mongoose.model<IUserPreference>("UserPreference", userPreferenceSchema);
export default UserPreference;
