import mongoose, { Document, Schema } from "mongoose";

export interface IAbuseReport extends Document {
  reporter: mongoose.Types.ObjectId;
  reportedUser?: mongoose.Types.ObjectId;
  reason: string;
  description?: string;
  status: string;
}

const abuseReportSchema = new Schema<IAbuseReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: "User" }, // optional, depending on what's reported
    reason: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const AbuseReport = mongoose.model<IAbuseReport>("AbuseReport", abuseReportSchema);
export default AbuseReport;
