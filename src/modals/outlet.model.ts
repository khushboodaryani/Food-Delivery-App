import mongoose, {Schema, Document} from "mongoose";

export interface IOutlet extends Document{
    ownerId: mongoose.Types.ObjectId;
    name: string;
    address: string;
    coordinates:{
        lat: number;
        lng: number;
    };
    mobile?:string;
    email?: string;
    avatar?: string;
    images?: string[];
    isOpen:boolean;
    status:"active"|"inactive";
    createdAt: Date;
    updatedAt: Date;
}

const outletSchema = new Schema<IOutlet>(
    {
        ownerId:{
            type: Schema.Types.ObjectId,
            ref:"Owner",
            required:true,
            index:true,
        },
        name:{
            type: String,
            required: true,
            trim: true,
        },
        address:{
            type:String,
            required:true,
            trim:true,
        },
        coordinates:{
            lat:{type:Number, required:true},
            lan:{type:Number, required:true},
        },
        mobile:{
            type:String,
            trim: true,
            unique:true,
        },
        email:{
            type:String,
            trim:true,
            lowercase:true,
            unique:true,
        },
        avatar:{type:String},
        images:{
            type:[String],
            default:[],
        },
        isOpen:{
            type:Boolean,
            default:false,
        },
        status:{
            type:String,
            enum:["active","inactive"],
            default:"active"
        } ,

    },
    {
        timestamps:true,
    }

);

export const Outlet = mongoose.model<IOutlet>("Outlet",outletSchema)