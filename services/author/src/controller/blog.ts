
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { getBuffer } from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import { invalidateCacheJob } from "../utils/rabbitmq.js";
import  { tryCatch } from "../utils/tryCatch.js";
import { v2 as cloudinary } from 'cloudinary';




export const createBlog=tryCatch(async(req:AuthenticatedRequest,res)=>{

  const {title,blogcontent,description,category}=req.body;
  const file=req.file;
  if(!file){
    return res.status(400).json({message:"no file to upload"})

  }

  const fileBuffer= getBuffer(file)
  if(!fileBuffer || !fileBuffer.content){
     return res.status(400).json({message:"failed to generate buffer"})

  }
  const cloud=await cloudinary.uploader.upload(fileBuffer.content,{folder:"blogs"} )

  const result=await sql`INSERT INTO blogs
  (title,description,image,blogcontent,category,author)
  VALUES(${title},${description},${cloud.secure_url},${blogcontent},${category},${req.user?._id}) RETURNING *`

  await invalidateCacheJob(["blogs:*"]);

  res.json({message:"blog created successfully",blog:result[0]})
})

export const updateBlog=tryCatch(async(req:AuthenticatedRequest,res)=>{
  const {id}=req.params;

  const {title,blogcontent,description,category}=req.body;
  const file=req.file;
  const blog=await sql`SELECT * FROM blogs WHERE id=${id}`
  if(!blog.length){
    return res.status(404).json({message:"blog not found"})

  }
  if(blog[0]?.author!=req.user?._id){
    return res.status(403).json({message:"you are not authorized to update this blog"})
  }
  let imageUrl=blog[0]?.image
if(file){
  const fileBuffer=getBuffer(file)
  if(!fileBuffer || !fileBuffer.content){
    return res.status(400).json("fialed to generate buffer")
    
  }
  const cloud=await cloudinary.uploader.upload(fileBuffer.content,{folder:"blogs"})
  imageUrl=cloud.secure_url
}
  const updatedBlog=await sql `UPDATE blogs SET 
  title=${title || blog[0]?.title},
  description=${description || blog[0]?.description}, 
  image=${imageUrl},
  blogcontent=${blogcontent || blog[0]?.blogcontent},
  category=${category || blog[0]?.category}
  WHERE id=${id} RETURNING *`
  await invalidateCacheJob(["blogs:*"]);
res.json({message:"blog updated successfully",blog:updatedBlog[0]})

})


export const deleteBlog=tryCatch(async(req:AuthenticatedRequest,res)=>{
  const {id}=req.params;
  const blog=await sql `SELECT * FROM blogs WHERE id=${id} `

  if(!blog.length){
    return res.status(404).json({message:"blog not exist with this id"})
  }
  if(blog[0]?.author!=req.user?._id){
    return res.status(403).json({message:"you are not authorized to delete this blog"})
  }
   await sql`DELETE FROM blogs WHERE id=${id} `
   await sql`DELETE FROM comments WHERE blogid=${id}`
   await sql`DELETE FROM savedblogs WHERE blogid=${id}`
     await invalidateCacheJob(["blogs:*","blog:${req.params.id}"]);

   res.json({message:"blog deleted successfully"})
})
  


