/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import mongoose from "mongoose";
import { FolderCollection } from "../folder/folder.model";
import { FileCollection } from "../file/file.model";
import { FavoritesCollection } from "./favorites.model";
const { ObjectId } = mongoose.Types


// create Favorite Item
const createFavoriteItem = async ( author:string, item:string, type:"folder"|'file') => {

let existingFolder 
  // Check existing folder
  if (type==='folder') {
    existingFolder = await FolderCollection.findById(item)
  }
  // Check existing file
  if (type==='file') {
    existingFolder = await FileCollection.findById(item)
  }
  // if item is not exist
  if (!existingFolder) {
    throw new AppError(httpStatus.BAD_REQUEST, 'item is not exists !')
  }
  
  // if ietm item is exist in favorite 
  const itemExistInFavorite = await FavoritesCollection.findOne({ author: new ObjectId(author), item: new ObjectId(item) })
  if(itemExistInFavorite){
    throw new AppError(httpStatus.BAD_REQUEST, 'item already have exist')
  }
  
  // create new item 
  const result = await FavoritesCollection.create({ author,item,type })
    return result
}

//  get all Favorite Item
const getAllFavoritesItem = async (author: string, params: string | undefined) => {
  const query: any = { author: new ObjectId(author) }

  // If params exists
  if (params) {
    // query['item.name'] = { $regex: params, $options: 'i' }  
  }

  // Perform the query and populate the item details with its name
  const res = await FavoritesCollection.find(query).populate('author').populate('item')

  return res;
};

//remove Favorite Item
const removeFavoriteItem = async (author:string, id:string) => {

  const query = {
    _id:new ObjectId(id),
    author:new ObjectId(author), 
  }

  // delete folder 
    const folder = await FavoritesCollection.updateOne(query, {isDelete:true},{new :true});
    return folder
}

export const favoriteService = {
  createFavoriteItem,
  getAllFavoritesItem,
  removeFavoriteItem,
}