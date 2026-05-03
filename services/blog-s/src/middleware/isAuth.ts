import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"



 interface Iuser extends Document {
    _id:string;
  name:string;
  email:string;
  image:string;
  instagram:string;
  facebook:string;
  linkedin:string;
  bio:string;
}

export interface AuthenticatedRequest extends Request {
  user?: Iuser | null;
}


export const isAuth =async (req:AuthenticatedRequest,res:Response,next:NextFunction):Promise<void>=>{
try{
  const authHeader=req.headers.authorization;

  if(!authHeader || !authHeader.startsWith("Bearer ")){
   res.status(401).json({message:"Please login - no auth header"})
   return;
}
const token=authHeader.split(" ")[1];
if(!token){ res.status(401).json({message:"Please login - no token"})
return;}

const decodeValue=jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;

if(!decodeValue || !decodeValue.user){
  res.status(401).json({message:"Please login - invalid token"})
  return;
  }
  req.user=decodeValue.user
  
  next();
}
catch(err:any){
  console.log('jwt varification error:',err)
res.status(401).json({message:"Please login - jwt error "})
}
}
