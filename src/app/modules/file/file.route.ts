import express from "express"
import { uploadFile } from "../../utills/storage"
import { FileController } from "./file.controller"

const router = express.Router()


router.get('/', FileController.StorageUsesInfo)
router.get('/cetegory', FileController.FileCategoryCount)
router.get('/recent', FileController.RecentFile)
router.post('/file/upload', uploadFile.single('file'), FileController.FileUpload)


export const fileRoute = router