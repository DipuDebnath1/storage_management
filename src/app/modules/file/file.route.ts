import express from "express"
import { uploadFile } from "../../utills/storage"
import { FileController } from "./file.controller"
import { verifyLoginUser, verifyPermitionPrivetFolder } from "../../../midlewere/auth"

const router = express.Router()


router.post('/file/upload', verifyLoginUser(), uploadFile.single('file'), FileController.FileUpload)
router.put('/file/rename/:id', verifyLoginUser(),  FileController.ReNameFile)
router.get('/', verifyLoginUser(), FileController.StorageUsesInfo)
router.get('/cetegory',verifyLoginUser(), FileController.FileCategoryCount)
router.get('/recent', verifyLoginUser(), FileController.RecentFile)
router.get('/images', verifyLoginUser(), FileController.GetAllImage)
router.get('/pdfs', verifyLoginUser(), FileController.GetAllPdf)
router.get('/notes', verifyLoginUser(), FileController.GetAllNote)
router.get('/all/:date', verifyLoginUser(), FileController.GetAllFileDateWise)
router.delete('/delete/:id', verifyLoginUser(), FileController.DeleteFile)
// privet 
router.post('/privet/:id' , FileController.AddToPrivet)
router.get('/privet', verifyPermitionPrivetFolder(), FileController.GetFromPrivet)
router.delete('/privet/:id', verifyPermitionPrivetFolder(), FileController.removeFromPrivet)


export const fileRoute = router