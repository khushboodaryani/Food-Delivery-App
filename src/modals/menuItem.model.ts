import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
    outletId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;

    name: string;
    description?: string;

    price: number;
    // discountedPrice?: number;

    image?: string;
    isVeg: boolean;
    isAvailable: boolean;

    status: "active" | "inactive";

    createdAt: Date;
    updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
    {
        outletId: {
            type: Schema.Types.ObjectId,
            ref: "Outlet",
            required: true,
            index: true,
        },

        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },

        image: {
            type: String,
        },
        isVeg: {
            type: Boolean,
            default: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }

    },
    {
        timestamps: true,
    }
);

export const MenuItem = mongoose.model<IMenuItem>("MenuItem", menuItemSchema);