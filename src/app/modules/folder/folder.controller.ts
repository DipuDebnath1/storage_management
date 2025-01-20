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
// Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  if (!name) {
    throw new AppError(httpStatus.BAD_REQUEST, 'provide folder name')
  }

  const result = await fodlerService.createFolder(data._id, name, parentPath)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'folder create success',
    data: result
    });
  

});

// CreateFolder;
const GetAllFolder: RequestHandler = catchAsync(async (req, res, next) => {
  const {name} = req.query
 // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fodlerService.getAllFolder(data._id, name as string)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'folders retrived successfully',
    data: result
    });
  

});

// delete Folder;
const DeleteFolder: RequestHandler = catchAsync(async (req, res, next) => {

  const {id} = req.params
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }
  const result = await fodlerService.deleteFolder(data._id, id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'folder delete success',
    data: result
    });
  

});

export const FolderController = {
  CreateFolder,
  GetAllFolder,
  DeleteFolder
}