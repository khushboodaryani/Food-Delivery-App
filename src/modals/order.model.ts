import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // Price at the time of order
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: "cod" | "razorpay";
  deliveryAddress: string;
  timeline?: {
    status: string;
    description?: string;
    timestamp: Date;
  }[];
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay"],
      default: "cod",
    },
    deliveryAddress: { type: String, required: true },
    timeline: [
      {
        status: { type: String },
        description: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
