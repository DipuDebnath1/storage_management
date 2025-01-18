/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import catchAsync from "../../utills/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../utills/sendResponse";
import { fileService } from "./file.service";
import AppError from "../../ErrorHandler/AppError";


// FileUpload;
const FileUpload: RequestHandler = catchAsync(async (req, res, next) => {
 
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'file upload failed')
  }
  
  const data = {
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    path: req.file.path,
    size: req.file.size,

  }
  const result = await fileService.uploadFile(data)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'file upload success',
    data: result
    });
  

});

export const FileController = {
    FileUpload
}