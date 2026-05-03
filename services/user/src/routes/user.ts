import express from 'express';
import { loginUser, myProfile, updateProfilePic, userProfile, userUpdate } from '../controller/user.js';
import { isAuth } from '../middleware/isAuth.js';
import { uploadFile } from '../middleware/multer.js';


const router=express.Router();


router.post("/login",loginUser)
router.get("/myprofile",isAuth,myProfile)
router.get("/user/profile/:id",userProfile)
router.post("/user/update",isAuth,userUpdate)
router.post("/user/update/pic",isAuth,uploadFile,updateProfilePic)



export default router;