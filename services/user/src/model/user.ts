import mongoose,{Document,Schema} from "mongoose";

export interface Iuser extends Document {
  name:string;
  email:string;
  image:string;
  instagram:string;
  facebook:string;
  linkedin:string;
  bio:string;
}

const userSchema:Schema<Iuser>=new Schema({
  name:{
    type:String,
    required:true},
    email:{
      type:String,
      required:true,
      unique:true
    },
    image:{
      type:String,
      required:true
    },
    instagram:String,
    facebook:String,
    linkedin:String,
    bio:String
  
},{timestamps:true})

const User:mongoose.Model<Iuser>=mongoose.model('User',userSchema)

export default User;