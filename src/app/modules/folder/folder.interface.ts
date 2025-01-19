import { Types } from "mongoose"

export type TFolder = {
    name:string,
    path: string,
    author: Types.ObjectId,
    isDelete:boolean
}