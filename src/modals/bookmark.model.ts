import mongoose, { Document, Schema } from "mongoose";

export interface IBookmark extends Document {
  user: mongoose.Types.ObjectId;
  item: mongoose.Types.ObjectId;
  itemType: string;
  status: boolean;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: Schema.Types.ObjectId, required: true, refPath: "itemType" },
    itemType: {
      type: String,
      enum: ["MenuItem", "Outlet"],
      required: true,
    },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Bookmark = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
export default Bookmark;
