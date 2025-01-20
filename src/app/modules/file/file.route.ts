import express from "express"
import { uploadAvatar } from "../../utills/storage"
import { FileController } from "./file.controller"
import { verifyLoginUser } from "../../../midlewere/auth"

const router = express.Router()


router.post('/file/upload', verifyLoginUser(), uploadAvatar.single('file'), FileController.FileUpload)
router.get('/', verifyLoginUser(), FileController.StorageUsesInfo)
router.get('/cetegory',verifyLoginUser(), FileController.FileCategoryCount)
router.get('/recent', verifyLoginUser(), FileController.RecentFile)
router.get('/images', verifyLoginUser(), FileController.GetAllImage)
router.get('/pdfs', verifyLoginUser(), FileController.GetAllPdf)
router.get('/notes', verifyLoginUser(), FileController.GetAllNote)
router.get('/all/:date', verifyLoginUser(), FileController.GetAllFileDateWise)
router.delete('/delete/:id',verifyLoginUser(),  FileController.DeleteFile)

// getAllImage,
//   getAllPdf,
//   getAllNote,
//   deleteFile
export const fileRoute = router