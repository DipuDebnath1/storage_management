import express from "express"
import { uploadFile } from "../storage"
import { FileController } from "./file.controller"

const router = express.Router()

router.post('/upload', uploadFile.single('file'), FileController.FileUpload)


export const fileRoute = router