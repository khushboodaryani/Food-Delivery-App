import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  menuItem: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number; // derivative or cached
}

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
        quantity: { type: Number, required: true, default: 1, min: 1 },
      },
    ],
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Pre-save hook to calculate totalAmount
cartSchema.pre("save", async function (next) {
  const cart = this as any;
  let total = 0;

  const MenuItem = mongoose.model("MenuItem");

  for (const item of cart.items) {
    const menuItem: any = await MenuItem.findById(item.menuItem);
    if (menuItem) {
      // Use discountedPrice if available, else price
      const price = menuItem.discountedPrice !== undefined ? menuItem.discountedPrice : menuItem.price;
      total += price * item.quantity;
    }
  }

  cart.totalAmount = total;
  next();
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
