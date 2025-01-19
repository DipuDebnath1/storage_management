import { model, Schema } from "mongoose";
import { TFavorites } from "./favorites.interface";

const favoriteSchema = new Schema<TFavorites>({
    author: {
        type: Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },
    item: {
        type: Schema.Types.ObjectId,
        required:true,
        ref:"file",
    },
    type: {
        type: String,
        enum:['file',"folder"]
    },
    isDelete: {
        type: Boolean,
        default:false
    }
},
    {
    timestamps:true
    })

favoriteSchema.pre('find', function (next) {
    this.where({ isDelete: false })
    next()
})
    export const FavoritesCollection = model<TFavorites>('favorite',favoriteSchema)