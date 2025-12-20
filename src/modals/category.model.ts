import  mongoose, { Schema,Document} from 'mongoose';


export interface ICategory extends Document{
    outletId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    image?: string;
    status:"active"| "inactive";
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
    outletId:{
        type: Schema.Types.ObjectId,
        ref:"Outlet",
        required: true,
        index: true,
    },
    name:{
        type: String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        trim: true,
    },
    image:{
        type: String,
    },
    status:{
        type: String,
        enum:["active","inactive"],
        default:"active",
    },
},
{
    timestamps: true,
}
);

export const  Category  = mongoose.model<ICategory>(
    "Category",
    categorySchema
)