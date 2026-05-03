import multer from "multer";

const upload=multer({
  storage:multer.memoryStorage(),
})

export const uploadFile=upload.single("file")