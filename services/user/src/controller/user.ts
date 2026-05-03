import type { Request, Response } from "express";
import User from "../model/user.js";
import jwt from "jsonwebtoken";
import  { tryCatch } from "../utils/tryCatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { getBuffer } from "../utils/dataUri.js";
import { v2 as cloudinary } from 'cloudinary';
import { oauth2client } from "../utils/googleConfig.js";
import axios from "axios";





export const loginUser= tryCatch(async (req,res)=>{

  const {code}=req.body;
  if(!code){
    return res.status(400).json({message:"Authorization code is required"})
  }
  
  const googleRes=await oauth2client.getToken(code)
  
  
    
    oauth2client.setCredentials(googleRes.tokens)

    const userRes=await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)

const { email, name, picture } = userRes.data;
    let user=await User.findOne({email:email})
  if(!user){
    user=await User.create({email,name,image:picture})
  }

  const token=jwt.sign({user},process.env.JWT_SECRET  as string,{expiresIn:"5d"})

  res.status(200).json({message:"Login successful",token,user})

}
 )


export const myProfile=tryCatch(async(req:AuthenticatedRequest,res)=>{
  const user=req.user;
  
res.json(user)
})

export const userProfile=tryCatch(async(req:AuthenticatedRequest,res)=>{
  const userId=req.params.id;
  const user =await User.findById(userId)

  if(!user){
    return res.status(404).json({message:"no user with this id"})
  }

  res.json(user)

})

export const userUpdate=tryCatch(async(req:AuthenticatedRequest,res)=>{
  const {name,facebook,instagram,linkedin,bio}=req.body;

  const user=await User.findByIdAndUpdate(req.user?._id,{name,facebook,instagram,linkedin,bio},{new:true})

  const token=jwt.sign({user},process.env.JWT_SECRET as string,{expiresIn:"5d"})
  
  res.json({message:"profile updated successfully",token,user})
})

export const updateProfilePic=tryCatch(async(req:AuthenticatedRequest,res)=>{
  const file=req.file;
  if(!file){
    return res.status(400).json({message:"no file to upload"})

  }

  const fileBuffer= getBuffer(file)
  if(!fileBuffer || !fileBuffer.content){
     return res.status(400).json({message:"failed to generate buffer"})

  }
  const cloud = await cloudinary.uploader
       .upload(
            fileBuffer.content,
               {folder:"blog"},
           
       )

       const user=await User.findByIdAndUpdate(req.user?._id,{image:cloud.secure_url},{new:true})
       
  const token=jwt.sign({user},process.env.JWT_SECRET as string,{expiresIn:"5d"})
  
  res.json({message:"user profile pic updated ",token,user})
})

