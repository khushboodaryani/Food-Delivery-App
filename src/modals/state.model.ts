import mongoose, { Document, Schema } from "mongoose";

export interface IState extends Document {
  name: string;
  country: mongoose.Types.ObjectId;
  status: boolean;
}

const stateSchema = new Schema<IState>(
  {
    name: { type: String, required: true, trim: true },
    country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const State = mongoose.model<IState>("State", stateSchema);
export default State;
