/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../app/utills/catchAsync';
import AppError from '../app/ErrorHandler/AppError';
import httpStatus from 'http-status';
import { tokenDecoded } from '../app/utills/tokenDecoded';
import config from '../config';


// verifyLoginUser;
export const verifyLoginUser = () => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const token = req.cookies.authToken
      if (!token) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized  user please Login' });
      }

      const decoded = tokenDecoded(token, config.accessToken as string);
      if (!decoded) {
        new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, missing token or invalid token');
      }
      next()
    },
  );
};

// verifyLoginUser;
export const verifyResetPassworduser = () => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const token = req.cookies.resetPasswordToken
      if (!token) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized  user please Login' });
      }

      const decoded = tokenDecoded(token, config.resetToken as string);
      if (!decoded) {
        new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, missing token or invalid token');
      }
      next()
    },
  );
};

// verifyLoginUser;
export const verifyPermitionPrivetFolder = () => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const token = req.cookies.privetFolderAccess
      if (!token) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized  user please Login privet Folder' });
      }

      const decoded = tokenDecoded(token, config.privetFolderToken as string);
      if (!decoded) {
        new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, missing token or invalid token');
      }
      next()
    },
  );
};
