import { Types } from "mongoose";

export type TFile = {
    name:string,
    mimetype: string,
    src: string;
    folderPath: string,
    size: number,
    author: Types.ObjectId,
    isPrivet:boolean, 
    isDeleted:boolean
}