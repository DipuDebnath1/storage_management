import { model, Schema } from "mongoose";
import { TFolder } from "./folder.interface";

const folderSchema = new Schema<TFolder>({
    name: { type: String, required: true },
    path: { type: String, required: true },
    author: {
        type: Schema.Types.ObjectId,
        required:true,
        ref:"author",
    },
    isDelete: {
        type: Boolean,
        default:false
    }
},
    {
    timestamps:true
    })

folderSchema.pre('find', function (next) {
    this.where({ isDelete: false })
    next()
})
    export const FolderCollection = model<TFolder>('folder',folderSchema)