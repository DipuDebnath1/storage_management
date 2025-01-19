import multer from "multer";

// local store
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


// GridFS Storage Setup
// const storage = multer.memoryStorage(); 
// export const uploadFile = multer({ storage });