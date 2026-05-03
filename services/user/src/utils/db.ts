import mongoose from "mongoose";


const connectDB=async ()=>{
  try{ mongoose.connect(process.env.MONGO_URI as string,{dbName:"blog"})
    console.log('MongoDB connected successfully')
  }
  catch(err){
    console.log(err)
  }
}

export default connectDB;
