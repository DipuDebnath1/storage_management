/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import catchAsync from "../../utills/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../utills/sendResponse";
import AppError from "../../ErrorHandler/AppError";
import { tokenDecoded } from "../../utills/tokenDecoded";
import config from "../../../config";
import { fodlerService } from "./folder.service";


// CreateFolder;
const CreateFolder: RequestHandler = catchAsync(async (req, res, next) => {

  const {name, parentPath} = req.body
  const { authorization } = req.headers
  // authorization
  if (!authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'you have not access this opration ')
  }

  // token verfy 
  const token = tokenDecoded(authorization, config.accessToken as string)
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'you have not access this opration ')
  }

  if (!name) {
    throw new AppError(httpStatus.BAD_REQUEST, 'provide folder name')
  }

  const result = await fodlerService.createFolder(token.data._id, name, parentPath)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'folder create success',
    data: result
    });
  

});
// delete Folder;
const DeleteFolder: RequestHandler = catchAsync(async (req, res, next) => {

  const {id} = req.params
  const { authorization } = req.headers
  // authorization
  if (!authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'you have not access this opration ')
  }

  // token verfy 
  const token = tokenDecoded(authorization, config.accessToken as string)
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'you have not access this opration ')
  }

  const result = await fodlerService.deleteFolder(token.data._id, id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'folder delete success',
    data: result
    });
  

});

export const FolderController = {
  CreateFolder,
  DeleteFolder
}