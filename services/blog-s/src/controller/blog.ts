
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { redisClient } from "../server.js";
import { sql } from "../utils/db.js";
import { tryCatch } from "../utils/tryCatch.js";
import axios from 'axios'


export const getAllBlogs=tryCatch(async(req,res)=>{
  const{searchQuery="",category=""}=req.query
  const cacheKey=`blogs:${searchQuery}:${category}`
  const cached=await redisClient.get(cacheKey)
  if(cached){
    console.log("serving from cache")
    
    return res.json(JSON.parse(cached))
  }
  let blogs;

  if(searchQuery && category){
    blogs=await sql`SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) AND category=${category} ORDER BY created_at DESC`}
    else if(searchQuery ){
      blogs=await sql`SELECT * FROM blogs WHERE title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"} ORDER BY created_at DESC `
    }
     else if(category){
      blogs=await sql`SELECT * FROM blogs WHERE category=${category} ORDER BY created_at DESC `
    }
    else{blogs=await sql`SELECT * FROM blogs ORDER BY created_at DESC`}
    await redisClient.set(cacheKey,JSON.stringify(blogs),{EX:3600})
    console.log("serving from db")
    
  res.json(blogs)
  



})

export const getSingBlog=tryCatch(async(req,res)=>{
  console.log("req")
  const blogid=req.params.id;
  const cacheKey=`blog:${blogid}`
  const cached=await redisClient.get(cacheKey)
  if(cached){
    console.log("serving from cache")
    return res.json(JSON.parse(cached))
  }
  const blog=await sql`SELECT * FROM blogs WHERE id=${blogid}`

if(blog.length===0){
  return res.status(404).json({message:"blog not found"})
}

 const{data}= await axios.get(`${process.env.USER_URL}/api/v1/user/profile/${blog[0]?.author}`)

await redisClient.set(cacheKey,JSON.stringify({blog:blog[0],author:data}),{EX:3600})

  res.json({blog:blog[0],author:data})
})




export const addComment=tryCatch(async(req:AuthenticatedRequest,res)=>{
  const{id:blogid}=req.params;
  const{comment}=req.body;
  await sql`INSERT INTO comments(comment,blogid,userid,username)VALUES
  (${comment},${blogid},${req.user?._id},${req.user?.name}) RETURNING *`

res.json({
  message:"Comment Added"
})

})

export const getAllComments=tryCatch(async(req,res)=>{
  const{id}=req.params;
  const comments=await sql`SELECT * FROM comments WHERE blogid=${id} ORDER BY created_at DESC `
  res.json(comments)
})

export const deleteComment=tryCatch(async(req:AuthenticatedRequest,res)=>{
  const {commentid}=req.params;
  const comment=await sql ` SELECT * FROM comments WHERE id=${commentid}`
  if(comment[0]?.userid!=req.user?._id){
   return res.status(401).json({message:"you are not owner of this comment"})
  }


  await sql `DELETE FROM  comments WHERE id=${commentid}`;

  res.json({message:"comment deleted"})
})


export const saveBlog=tryCatch(async(req:AuthenticatedRequest,res)=>{

const {blogid}=req.params;
const userid=req.user?._id
if(!blogid || !userid){
  return res.status(400).json({message:"Missing blog or userid"})
}

const existing =await sql `SELECT * FROM savedBlogs WHERE userid=${userid } AND blogid=${blogid}`
if(existing.length===0){
  await sql `INSERT INTO savedblogs (blogid,userid) VALUES (${blogid},${userid})`
res.json({message:"Blog Saved"})

}

else{
  await sql `DELETE FROM savedblogs WHERE (userid=${userid} AND blogid=${blogid}) `
return res.json({message:"Blog Unsaved"})

}
})

export const getSavedBlog = tryCatch(async (req: AuthenticatedRequest, res) => {
  const blogs =
    await sql`SELECT * FROM savedblogs WHERE userid = ${req.user?._id}`;

  res.json(blogs);
});