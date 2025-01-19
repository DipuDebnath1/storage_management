/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import { TFile } from "./file.interface";
import { FileCollection } from "./file.model";
import mongoose from "mongoose";
import { FolderCollection } from "../folder/folder.model";
import { formatFileSize } from "../../utills/fileSizeFomater";
const { ObjectId } = mongoose.Types;

// upload file 
const uploadFile = async (author: string, fileData: any, folderPath: any) => {
  // params 
  const data: Partial<TFile> = {
    name: fileData.name,
    mimetype: fileData.mimetype,
    src: fileData.src, 
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
 //storage data
const storageUsesInfo = async (author: string) => {

    // Calculate storage summary
    const files = await FileCollection.find({ author: new ObjectId(author), isDeleted: false });
    const totalStorage = 15 * 1024 * 1024 * 1024; // Assuming 15GB as max storage
    const usedStorage = files.reduce((acc, file) => acc + file.size, 0);
    const availableStorage = totalStorage - usedStorage;

    const folderCount = await FolderCollection.countDocuments({ author: new ObjectId(author), isDelete: false });

  // return model
  const data = {
    storage: {
      totalStorage: formatFileSize(totalStorage),
      usedStorage:formatFileSize(usedStorage),
      availableStorage:formatFileSize(availableStorage)
    },
    folder: {
      folderCount,
      usedStorage:formatFileSize(usedStorage),

    }
  }
  return data
}

//file cetegory cound
const fileCategoryCount = async (author:string) => {
  const cetegorys = ['text', 'image', 'pdf']
  const result = await Promise.all(
    cetegorys.map(async (cetegory) => {
      const count = await FileCollection.countDocuments({author:new ObjectId(author), mimetype:new RegExp(cetegory,'i')})
      const storage = await FileCollection.aggregate([
        { $match: { author: new ObjectId(author), mimetype: new RegExp(cetegory, 'i') } },
        {$group:{_id:null, totalSize:{$sum:"$size"}}}
      ])
      return {cetegory,totalItems:count,storage}
    })
  )
return result

}

//recent file retrived
const recentFile = async (author:string) => {
  const files = await FileCollection.find({ author: new ObjectId(author) }).sort({ createdAt: -1 }).limit(5)
  return files
}

//images file retrived
const getAllImage = async (author: string, params:string) => {
  const query: any = { author: new ObjectId(author), mimetype: { $regex: 'image', $options: 'i' } }
    if (params) {
    query.name = { $regex: params, $options: 'i' } 
  }
  const images = await FileCollection.find(query)
  return images
}

//pdf file retrived
const getAllPdf = async (author: string,params:string) => {
  const query:any = { author: new ObjectId(author), mimetype: { $regex: 'application', $options: 'i' } }
    if (params) {
    query.name = { $regex: params, $options: 'i' } 
  }
  const images = await FileCollection.find(query)
  return images
}

//note note retrived
const getAllNote = async (author: string, params:string) => {
  const query:any = { author: new ObjectId(author), mimetype: { $regex: 'text', $options: 'i' }}
    if (params) {
    query.name = { $regex: params, $options: 'i' } 
  }
  const images = await FileCollection.find(query)
  return images
}
//delete file
const deleteFile = async (author: string, fileId:string) => {
  const params = {author: new ObjectId(author), _id: new ObjectId(fileId)}
  const res = await FileCollection.updateOne(params,{isDeleted:true})
  return res
}

export const fileService = {
  uploadFile,
  storageUsesInfo,
  fileCategoryCount,
  recentFile,
  getAllImage,
  getAllPdf,
  getAllNote,
  deleteFile
}