import mongoose, { Document, Schema } from "mongoose";

export interface ICountry extends Document {
  name: string;
  code: string;
  phoneCode: string;
  status: boolean;
}

const countrySchema = new Schema<ICountry>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, trim: true }, // e.g., "US", "IN"
    phoneCode: { type: String, trim: true }, // e.g., "+1", "+91"
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Country = mongoose.model<ICountry>("Country", countrySchema);
export default Country;
