import { model, Schema } from "mongoose";
import { TFile } from "./file.interface";

const fileSchema = new Schema<TFile>({
    name: { type: String ,required: true},
    mimetype: { type: String, required: true },
    src: { type: String, required: true },
    folderPath: { type: String, required: false},
    size: { type: Number, required: true },
    author: { type: Schema.Types.ObjectId,ref:'user',  required:true }
},
    {
    timestamps:true
    })

    export const FileCollection = model<TFile>('file',fileSchema)