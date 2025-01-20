import express from "express"
import { FolderController } from "./folder.controller"
import { verifyLoginUser } from "../../../midlewere/auth"

const router = express.Router()

router.post('/create', verifyLoginUser(), FolderController.CreateFolder)
router.get('/', verifyLoginUser(), FolderController.GetAllFolder)
router.delete('/delete/:id', verifyLoginUser(), FolderController.DeleteFolder)


export const folderRoute = router