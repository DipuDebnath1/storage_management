/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import catchAsync from "../../utills/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../utills/sendResponse";
import AppError from "../../ErrorHandler/AppError";
import { tokenDecoded } from "../../utills/tokenDecoded";
import config from "../../../config";
import { favoriteService } from "./favorites.service";


// CreateFolder;
const CreateFavorite: RequestHandler = catchAsync(async (req, res, next) => {

  const {favoriteItem, type} = req.body
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  if (!favoriteItem || !type) {
    throw new AppError(httpStatus.BAD_REQUEST, 'provide favorite favoriteItem and type')
  }

  const result = await favoriteService.createFavoriteItem(data._id,favoriteItem, type)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'favorite Item create success',
    data: result
    });
  

});

// CreateFolder;
const GetAllFavorite: RequestHandler = catchAsync(async (req, res, next) => {
  const {name} = req.query
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }
  const result = await favoriteService.getAllFavoritesItem(token.data._id, name as string)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favorites retrived successfully',
    data: result
    });
  

});

// delete Folder;
const RemoveFavorite: RequestHandler = catchAsync(async (req, res, next) => {

  const {id} = req.params
 // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }
  const result = await favoriteService.removeFavoriteItem(token.data._id, id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favorite delete success',
    data: result
    });
  

});

export const FavoriteController = {
  CreateFavorite,
  GetAllFavorite,
  RemoveFavorite
}