import { Types } from "mongoose"

export type TFavorites = {
    author: Types.ObjectId,
    item: Types.ObjectId,
    type:'file'|"folder"
    isDelete:boolean
}