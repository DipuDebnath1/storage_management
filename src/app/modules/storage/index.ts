import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'public')
    },
    filename: (req, file, cb) => {
        const sufix = Date.now()
         cb(null, `${sufix}-${file.originalname}`);
    }
})
 
export const uploadFile = multer({storage})


// Multer Setup for File Upload
// const storage = multer.memoryStorage();  // Store files in memory
// export const uploadFile = multer({ storage });