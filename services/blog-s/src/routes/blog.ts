import express from "express";
import { addComment, deleteComment, getAllBlogs, getAllComments, getSavedBlog, getSingBlog, saveBlog } from "../controller/blog.js";
import {isAuth} from "../middleware/isAuth.js"

const router=express.Router();


router.get("/blog/all",getAllBlogs)
router.get("/getsingleblog/:id",getSingBlog)
router.post("/comment/:id",isAuth,addComment)
router.get("/comment/:id",getAllComments)
router.delete("/comment/:commentid",isAuth,deleteComment)
router.post("/save/:blogid",isAuth,saveBlog)
router.get("/blog/saved/all", isAuth, getSavedBlog);
export default router;