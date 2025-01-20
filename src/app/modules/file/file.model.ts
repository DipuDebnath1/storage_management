import { model, Schema } from "mongoose";
import { TFile } from "./file.interface";

const fileSchema = new Schema<TFile>({
    name: { type: String ,required: true},
    mimetype: { type: String, required: true },
    src: { type: String, required: true },
    folderPath: { type: String, required: false},
    size: { type: Number, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'author', required: true },
    isDeleted: {type: Boolean,default:false},
    isPrivet: {type: Boolean,default:false}
},
    {
    timestamps:true
    })

        //filter deleted & [privet] file
    fileSchema.pre('find', function (next) {
        const query = this.getQuery();
        query.isDeleted = false;
        if (!query.includePrivate) {
            query.isPrivet = false; 
        }
        if (query.includePrivate) {
            query.isPrivet = true; 
        }

        delete query.includePrivate;
            next()
         })


    export const FileCollection = model<TFile>('file',fileSchema)