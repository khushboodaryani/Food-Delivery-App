
import mongoose,{Schema, Document} from "mongoose";
import bcrypt from "bcryptjs";


export interface IOwner extends Document {
    firstName : string;
    lastName: string;
    email: string;
    password:string;
    mobile: string;
    address?:string;
    coordinates?:{
        lat:number;
        lng:number;
    };
    status: "active" | "inactive";
    avatar?: string;
    fcmToken?: string;
    comparePassword(candidate:string):Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;

}

const ownerSchema = new Schema<IOwner>(
    {
        firstName:{type: String, required:true},
        lastName: {type:String, required:true},
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
       mobile:{
          type:String,
          required:true,
          unique:true,
          lowercase:true,
          trim:true,
        },
        password:{
            type:String,
            required:true,
        },
       
        address:{type:String},
        coordinates:{
            lat:{type:Number, required:true},
            lng:{type:Number, required:true},
        },
        avatar:{type:String},
        status:{
            type:String,
            enum:["active","inactive"],
            default:"active",
        },
        fcmToken:{type:String},

    },
    {timestamps:true}
);
ownerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
ownerSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const Owner = mongoose.model<IOwner>("Owner", ownerSchema);