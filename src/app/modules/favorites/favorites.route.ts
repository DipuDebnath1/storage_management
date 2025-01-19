import express from "express"
import { FavoriteController } from "./favorites.controller"
import { verifyLoginUser } from "../../../midlewere/auth"

const router = express.Router()

router.post('/create',verifyLoginUser(),  FavoriteController.CreateFavorite)
router.get('/',verifyLoginUser(),  FavoriteController.GetAllFavorite)
router.delete('/delete/:id',verifyLoginUser(),  FavoriteController.RemoveFavorite)


export const favoriteRoute = router