/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import catchAsync from "../../utills/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../utills/sendResponse";
import { fileService } from "./file.service";
import AppError from "../../ErrorHandler/AppError";
import { tokenDecoded } from "../../utills/tokenDecoded";
import config from "../../../config";

// FileUpload
const FileUpload: RequestHandler = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  // Check authorization header
  if (!authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'provide access token.');
  }

  // Verify token
  const token = tokenDecoded(authorization, config.accessToken as string);
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  // Validate file upload
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'File upload failed.');
  }

  const fileData = {
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    src: `${config.localApi}/${req.file.path.replace(/\\/g, '/')}`, // Normalize path for URLs
    folderPath: req.file.path,
    size: req.file.size,
  };

  // Save file metadata
  const result = await fileService.uploadFile(token.data._id, fileData, req.body.folderPath);

  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'File uploaded successfully.',
    data: result,
  });
});

// storage Data
const StorageUsesInfo: RequestHandler = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  // Check authorization header
  if (!authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'provide access token.');
  }

  // Verify token
  const token = tokenDecoded(authorization, config.accessToken as string);
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fileService.storageUsesInfo(token.data._id)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'storage retrived successfully.',
    data: result,
  });
})


// file Category Count 
const FileCategoryCount: RequestHandler = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  // Check authorization header
  if (!authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'provide access token.');
  }

  // Verify token
  const token = tokenDecoded(authorization, config.accessToken as string);
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fileService.fileCategoryCount(token.data._id)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'storage cetegory retrived successfully.',
    data: result,
  });
})

// recentFile retived
const RecentFile: RequestHandler = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  // Check authorization header
  if (!authorization) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'provide access token.');
  }

  // Verify token
  const token = tokenDecoded(authorization, config.accessToken as string);
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fileService.recentFile(token.data._id)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recent File retrived successfully.',
    data: result,
  });
})



export const FileController = {
  FileUpload,
  StorageUsesInfo,
  FileCategoryCount,
  RecentFile
  
}