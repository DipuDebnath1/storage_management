import express from "express"
import { uploadFile } from "../../utills/storage"
import { FileController } from "./file.controller"

const router = express.Router()


router.post('/file/upload', uploadFile.single('file'), FileController.FileUpload)
router.get('/', FileController.StorageUsesInfo)
router.get('/cetegory', FileController.FileCategoryCount)
router.get('/recent', FileController.RecentFile)
router.get('/images', FileController.GetAllImage)
router.get('/pdfs', FileController.GetAllPdf)
router.get('/notes', FileController.GetAllNote)
router.get('/all/:date', FileController.GetAllFileDateWise)
router.delete('/delete/:id', FileController.DeleteFile)

// getAllImage,
//   getAllPdf,
//   getAllNote,
//   deleteFile
export const fileRoute = router