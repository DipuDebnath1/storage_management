/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const token = jwt.sign({ data }, config.accessToken as string, {
      expiresIn: '7d',
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
    });
});

// LoginUser;
const LogOutUser: RequestHandler = catchAsync(async (req, res, next) => {
  res.clearCookie("authToken")
 sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Log Out in successfully',
      data: null,
    });
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
//   verify Reset Passwprd Verification Code
const VerifyResetPasswordVerificationCode: RequestHandler = catchAsync(async (req, res, next) => {
  
  const  {email, varificationCode } = req.body
  if (!email || !varificationCode) {
    throw new AppError(httpStatus.BAD_REQUEST, 'please sent valid email & varificationCode')
  }
  const data = await UserServices.verifyResetPasswordVerificationCode(req.body);

   const token = jwt.sign({ data }, config.resetToken as string, {
      expiresIn: '7d',
   });
  // set reset token 
  res.cookie('resetPasswordToken', token, {
    httpOnly: true,
    secure: config.development === "production",
    maxAge:1000 * 60 * 30
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'varification Code verify success please reset password in after 10 min',
    data: null,
  });
});

// ResetPassword;
const ResetPassword: RequestHandler = catchAsync(async (req, res, next) => {
  const {newPassword} = req.body

  if (!newPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'please provide new password');
  }
// Check authorization header
  const token  = req.cookies.resetPasswordToken
  // Verify token
  const {data} = tokenDecoded(token, config.resetToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await UserServices.resetPassword( data, newPassword );

  const authToken = jwt.sign({ data: result }, config.accessToken as string, { expiresIn: 7 })
  // clear reset token 
  res.clearCookie('resetPasswordToken')
  // set auth token 
   res.cookie('authToken', authToken, {
    httpOnly: true,
    secure: config.development === "production",
    maxAge:1000 * 60 * 60 * 24 * 7
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'password reset success',
    data: result,
  });
});

// updateUserProfileDB;
const UpdateUserProfile: RequestHandler = catchAsync(async (req, res, next) => {
  const { name } = req.body
  
  const payload: Record<string, any> = {};

  if (name) {
    payload['name'] = name
  }
   if (req.file) {
    payload['avatar'] = `${config.localApi}/${req.file.path.replace(/\\/g, '/')}`
  }
  
  // checking data 
  if (!Object.keys(payload).length) {
    throw new AppError(httpStatus.BAD_REQUEST,'please provide data !')
  }
// Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const result = await UserServices.updateUserProfileDB(
    data._id,
    payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile Update in successfully',
    data: result,
  });
});

// updateUserProfileDB;
const UpdateUserPassword: RequestHandler = catchAsync(async (req, res, next) => {
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  //paylad data
  const { newPassword, oldPassword } = req.body
  // checking oladpassword and newpassworld
  if (newPassword === oldPassword) {
    throw new AppError(httpStatus.BAD_REQUEST,'newpassword & oldpassword is same  !')
  }
  // checking oladpassword and newpassworld
  if (!newPassword || !oldPassword) {
    throw new AppError(httpStatus.BAD_REQUEST,'please provide newpassword & oldpassword data !')
  }


  const result = await UserServices.updateUserPassword(
    data._id,
    oldPassword,newPassword
    );

  res.clearCookie('authToken');
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update password successfully',
    data: result,
  });
});

// set privet pin;
const SetPrivetFolderPin: RequestHandler = catchAsync(async (req, res, next) => {
  const { privetPIN } = req.body
  // check PIN 
  if (!privetPIN || typeof privetPIN !=="number" || privetPIN.toString().length!==4) {
    throw new AppError(httpStatus.BAD_REQUEST, 'provide 4 digit PIN')
  }
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }
   await UserServices.setPrivetFolderPin(data._id,privetPIN);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'privet pin set successfully',
    data: null,
  });
});

// set privet pin;
const LoginPrivetFolder: RequestHandler = catchAsync(async (req, res, next) => {
  const { privetPIN } = req.body
  // check PIN 
  if (!privetPIN || typeof privetPIN !=="number" || privetPIN.toString().length!==4) {
    throw new AppError(httpStatus.BAD_REQUEST, 'provide 4 digit PIN')
  }
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }
  const result = await UserServices.loginPrivetFolder(data._id,privetPIN);
  
  const privetFolderToken = jwt.sign({ data: result }, config.privetFolderToken as string, {
    expiresIn:'1h'
  })

  res.cookie("privetFolderAccess", privetFolderToken, {
    httpOnly: true,
    secure: config.development === "production",
    maxAge:1000 * 60 * 60
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'privet access permition success',
    data: null,
  });
});

// set privet pin;
const LogOutPrivetFolder: RequestHandler = catchAsync(async (req, res, next) => {
  
  // Check authorization header
   res.clearCookie('privetFolderAccess')
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'privet access Logout success',
    data: null,
  });
});

// DeleteUserRole;
const DeleteAccount: RequestHandler = catchAsync(async (req, res, next) => {
  // Check authorization header
     const token  = req.cookies.authToken
  // Verify token
  const {data} = tokenDecoded(token, config.accessToken as string);
    
  if (!token || !data) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }
  const result = await UserServices.deleteAccount(data._id);
    res.clearCookie("authToken")

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'account delete successfully',
    data: result,
  });
});


export const UserController = {
  RegisterUser,
  LoginUser,
  LogOutUser,
  ForgetPassword,
  VerifyResetPasswordVerificationCode,
  ResetPassword,
  UpdateUserProfile,
  UpdateUserPassword,
  DeleteAccount,
  SetPrivetFolderPin,
  LoginPrivetFolder,
  LogOutPrivetFolder
};
