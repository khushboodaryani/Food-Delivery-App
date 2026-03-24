import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency: string;
  status: "created" | "successful" | "failed" | "refunded";
  refundDetails?: {
    refundId: string;
    amount: number;
    status: string;
  };
}

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    razorpay_order_id: { type: String, required: true, unique: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    amount: { type: Number, required: true }, // in sub-units (e.g., paise)
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "successful", "failed", "refunded"],
      default: "created",
    },
    refundDetails: {
      refundId: { type: String },
      amount: { type: Number },
      status: { type: String },
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;