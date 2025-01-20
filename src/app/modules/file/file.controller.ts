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
    const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
   
  if (!token || !data) {
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
  const result = await fileService.uploadFile(data._id, fileData, req.body.folderPath);

  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'File uploaded successfully.',
    data: result,
  });
});

// storage Data
const ReNameFile: RequestHandler = catchAsync(async (req, res, next) => {
      const name = req.body.name
      const file = req.params.id
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
  
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fileService.reNameFile(data._id, file, name)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'storage name update successfully.',
    data: result,
  });
})
// storage Data
const StorageUsesInfo: RequestHandler = catchAsync(async (req, res, next) => {
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
  
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fileService.storageUsesInfo(data._id)
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
    const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
  
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fileService.fileCategoryCount(data._id)
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
      const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
  
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fileService.recentFile(data._id)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recent File retrived successfully.',
    data: result,
  });
})

// Get All Image retived
const GetAllImage: RequestHandler = catchAsync(async (req, res, next) => {
  const {name} = req.query

     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
   
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }
  const result = await fileService.getAllImage(data._id, name as string)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'all image retrived successfully.',
    data: result,
  });
})

// Get All Image retived
const GetAllPdf: RequestHandler = catchAsync(async (req, res, next) => {
  const {name} = req.query
      const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
  
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }
  const result = await fileService.getAllPdf(data._id, name as string)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'all Pdf retrived successfully.',
    data: result,
  });
})

// Get All Image retived
const GetAllNote: RequestHandler = catchAsync(async (req, res, next) => {
  const {name} = req.query
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
   
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }
  const result = await fileService.getAllNote(data._id, name as string)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'all Note retrived successfully.',
    data: result,
  });
})

// Get All file Date Wise
const GetAllFileDateWise: RequestHandler = catchAsync(async (req, res, next) => {
  const {date} = req.params
  const {name} = req.query
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }
  const result = await fileService.getFileDateWise(data._id, date, name as string)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${date} in all file retrived successfully.`,
    data: result,
  });
})

// Get All Image retived
const DeleteFile: RequestHandler = catchAsync(async (req, res, next) => {
  const {id} = req.params
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
  
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fileService.deleteFile(data._id, id as string)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'file delete successfully.',
    data: result,
  });
})

// Add To Privet
const AddToPrivet: RequestHandler = catchAsync(async (req, res, next) => {
  const {id} = req.params
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
  
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fileService.addToPrivet(data._id, id as string)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'file add to Privet successfully.',
    data: result,
  });
})

// remove From Privet
const removeFromPrivet: RequestHandler = catchAsync(async (req, res, next) => {
  const {id} = req.params
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
  
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fileService.removeFromPrivet(data._id, id as string)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'file remove from Privet successfully.',
    data: result,
  });
})

// Get From Privet
const GetFromPrivet: RequestHandler = catchAsync(async (req, res, next) => {
  const {name} = req.query
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
  
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await fileService.getFromPrivet(data._id,  name as string)
  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retived Privet items successfully.',
    data: result,
  });
})


export const FileController = {
  FileUpload,
  ReNameFile,
  StorageUsesInfo,
  FileCategoryCount,
  RecentFile,
  GetAllImage,
  GetAllPdf,
  GetAllNote,
  GetAllFileDateWise,
  DeleteFile,
  //privet
  AddToPrivet,
  GetFromPrivet,
  removeFromPrivet
}