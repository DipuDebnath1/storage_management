/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from "multer";
import path from "path";

// upload file in 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'public')
    },
    filename: (req, file, cb) => {
        const sufix = Date.now()
         cb(null, `${sufix}-${file.originalname}`);
    }
})
 
export const uploadFile = multer({ storage })


const allowedExtensions = ['.jpg', '.jpeg', '.png'];

const fileFilter = (req:any, file:any, cb:any) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

export const uploadAvatar = multer({storage, fileFilter})


// GridFS Storage Setup
// const storage = multer.memoryStorage(); 
// export const uploadFile = multer({ storage });