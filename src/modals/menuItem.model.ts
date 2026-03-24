import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
    menuId: mongoose.Types.ObjectId;

    name: string;
    description?: string;

    price: number;
    discountPercentage: number;
    discountedPrice: number;

    image?: string;
    isVeg: boolean;
    isEgg: boolean;
    isNonVeg: boolean;
    isSpicy: boolean;
    isBestSeller: boolean;
    isAvailable: boolean;

    allergens: string[];
    customizable: boolean;

    status: "active" | "inactive";

    createdAt: Date;
    updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
    {
        menuId: {
            type: Schema.Types.ObjectId,
            ref: "Menu",
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
        discountPercentage: {
            type: Number,
            default: 0,
        },
        discountedPrice: {
            type: Number,
            default: function (this: any) {
                return this.price;
            },
        },
        image: {
            type: String,
        },
        isVeg: {
            type: Boolean,
            default: true,
        },
        isEgg: {
            type: Boolean,
            default: false,
        },
        isNonVeg: {
            type: Boolean,
            default: false,
        },
        isSpicy: {
            type: Boolean,
            default: false,
        },
        isBestSeller: {
            type: Boolean,
            default: false,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        allergens: {
            type: [String],
            default: [],
        },
        customizable: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },

    },
    {
        timestamps: true,
    }
);

export const MenuItem = mongoose.model<IMenuItem>("MenuItem", menuItemSchema);