import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import { FolderCollection } from "./folder.model";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types

const createFolder = async (author:string, name:string, parentPath:string) => {

    // Construct full folder path
  const fullPath = parentPath ? `${parentPath}/${name}` : name;

    // Check if parent folder already exists
    if (parentPath) {
      const existingParentFolder = await FolderCollection.findOne({ path: parentPath, author:new ObjectId(author) });
      if (!existingParentFolder) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Folder no exists !')
      }
  }

    // Check if folder already exists
    const existingFolder = await FolderCollection.findOne({ path: fullPath });
  if (existingFolder) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Folder already exists !')
  }
  
  // create new folder 
    const folder = await FolderCollection.create({
      name,
      path: fullPath,
      author:new ObjectId(author)
    });
    return folder
}

//delete folder
const deleteFolder = async (author:string, folderId:string) => {

  const query = {
    _id:new ObjectId(folderId),
    author:new ObjectId(author),
  }

  // delete folder 
    const folder = await FolderCollection.updateOne(query, {isDelete:true},{new :true});
    return folder
}

export const fodlerService = {
  createFolder,
  deleteFolder
}