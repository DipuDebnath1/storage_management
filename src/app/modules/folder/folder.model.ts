import { model, Schema } from "mongoose";
import { TFolder } from "./folder.interface";

const folderSchema = new Schema<TFolder>({
    name: { type: String, required: true },
    path: { type: String, required: true },
    author: {
        type: Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },
    isDelete: {
        type: Boolean,
        default:false
    }
},
    {
    timestamps:true
    })

    export const FolderCollection = model<TFolder>('folder',folderSchema)