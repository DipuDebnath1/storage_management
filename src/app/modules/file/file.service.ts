/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import { TFile } from "./file.interface";
import { FileCollection } from "./file.model";
import mongoose from "mongoose";
import { FolderCollection } from "../folder/folder.model";
const { ObjectId } = mongoose.Types;

const uploadFile = async (author: string, fileData: any, folderPath: any) => {
  const data: Partial<TFile> = {
    name: fileData.name,
    mimetype: fileData.mimetype,
    src: fileData.src, // Ensure correct path in URLs
    size: fileData.size,
    author: new ObjectId(author),
    };
    // folderPath if exist
    if (folderPath) {
        const fodlerExist =await FolderCollection.findOne({ path: folderPath, author })
        if (!fodlerExist) {
            throw new AppError(httpStatus.NOT_FOUND, 'folder not exist !')
        }
        data.folderPath = folderPath;
  }

  // Create file document in the database
  const res = await FileCollection.create(data);
  if (!res) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to save file metadata.');
  }

  return res;
};








export const fileService = {
    uploadFile,
}