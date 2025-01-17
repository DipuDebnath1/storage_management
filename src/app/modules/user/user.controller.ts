/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from 'express';
import catchAsync from '../../utills/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utills/sendResponse';
import httpStatus from 'http-status';
import config from '../../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../ErrorHandler/AppError';
import { tokenDecoded } from '../../utills/tokenDecoded';

// *************user*********
// createStudent;
const RegisterUser: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await UserServices.registerUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    success: true,
    data: result,
  });
});

// LoginUser;
const LoginUser: RequestHandler = catchAsync(async (req, res, next) => {
  const data = await UserServices.loginUser(req.body);

  if (data) {
    const token = jwt.sign({ data }, config.accessToken as string, {
      expiresIn: '1m',
    });

    res.cookie('authToken', token, {
      httpOnly: true, 
      secure: config.development === 'production',
      maxAge: 30 * 24 * 3600 * 1000,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged in successfully',
      data: data,
      token: token,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'User not found',
      data: [],
    });
  }
});

// ForgetPassword;
const ForgetPassword: RequestHandler = catchAsync(async (req, res, next) => {
  
  const { email } = req.body
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'please sent valid email')
  }
  const data = await UserServices.forgetPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'sent varification code in your email',
    data: data,
  });
});
//   verifyResetPasswprdVerificationCode
const VerifyResetPasswordVerificationCode: RequestHandler = catchAsync(async (req, res, next) => {
  
  const  {email, varificationCode } = req.body
  if (!email || !varificationCode) {
    throw new AppError(httpStatus.BAD_REQUEST, 'please sent valid email & varificationCode')
  }
  const data = await UserServices.verifyResetPasswordVerificationCode(req.body);

   const token = jwt.sign({ data }, config.resetToken as string, {
      expiresIn: '30d',
    });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'varification Code verify success ',
    data: null,
    token: token,
  });
});


// ResetPassword;
const ResetPassword: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  const {newPassword} = req.body
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided');
  }
  if (!newPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'please provide new password');
  }

  const decoded = tokenDecoded(token, config.resetToken as string);
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token invalid');
  }

  const data = await UserServices.resetPassword({email:decoded.data.email, password:newPassword});

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'password update success',
    data: data,
  });
});


// updateUserProfileDB;
const UpdateUserProfile: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req?.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError(httpStatus.UNAUTHORIZED, 'No token provided'));
  }

  const decoded = jwt.verify(
    token,
    config.accessToken as string,
  ) as JwtPayload & { data: { _id: string } };
  const data = await UserServices.updateUserProfileDB(
    decoded.data._id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile Update in successfully',
    data: data,
  });
});
// DeleteUserRole;
const DeleteUserRole: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new AppError(httpStatus.UNAUTHORIZED, 'No token provided'));
  }

  const decoded = tokenDecoded(token, config.accessToken as string);

  const { userId } = req.body;
  const data = await UserServices.deleteUserDB(userId, decoded.data._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User delete successfully',
    data: data,
  });
});


export const UserController = {
  RegisterUser,
  LoginUser,
  ForgetPassword,
  VerifyResetPasswordVerificationCode,
  UpdateUserProfile,
  DeleteUserRole,
  ResetPassword,
};
