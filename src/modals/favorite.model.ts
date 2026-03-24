import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  item: mongoose.Types.ObjectId;
  itemType: "MenuItem" | "Outlet";
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: Schema.Types.ObjectId, required: true, refPath: "itemType" },
    itemType: {
      type: String,
      enum: ["MenuItem", "Outlet"],
      required: true,
    },
  },
  { timestamps: true }
);

// Optimize lookups by user
favoriteSchema.index({ user: 1, item: 1 }, { unique: true });

const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
export default Favorite;
