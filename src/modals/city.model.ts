import mongoose, { Document, Schema } from "mongoose";

export interface ICity extends Document {
  name: string;
  state: mongoose.Types.ObjectId;
  status: boolean;
}

const citySchema = new Schema<ICity>(
  {
    name: { type: String, required: true, trim: true },
    state: { type: Schema.Types.ObjectId, ref: "State", required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const City = mongoose.model<ICity>("City", citySchema);
export default City;
