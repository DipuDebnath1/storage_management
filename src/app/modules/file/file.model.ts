import { model, Schema } from "mongoose";
import { TFile } from "./file.interface";

const fileSchema = new Schema<TFile>({
    name: { type: String, required: true },
    mimetype: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
},
    {
    timestamps:true
    })

    export const FileCollection = model<TFile>('file',fileSchema)