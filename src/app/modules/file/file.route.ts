import express from "express"
import { uploadFile } from "../../utills/storage"
import { FileController } from "./file.controller"

const router = express.Router()


router.get('/', FileController.FileUpload)
router.post('/file', uploadFile.single('file'), FileController.FileUpload)


export const fileRoute = router