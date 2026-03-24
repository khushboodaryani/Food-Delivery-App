import mongoose, { Schema, Document } from "mongoose";

export interface IMenu extends Document {
    outletId: mongoose.Types.ObjectId;
    name: string;
    status: "active" | "inactive";
    createdAt: Date;
    updatedAt: Date;
}

const menuSchema = new Schema<IMenu>(
    {
        outletId: {
            type: Schema.Types.ObjectId,
            ref: "Outlet",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
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

export const Menu = mongoose.model<IMenu>("Menu", menuSchema);
