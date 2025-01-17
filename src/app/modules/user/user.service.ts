/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import httpStatus from 'http-status';
import AppError from '../../ErrorHandler/AppError';
import { TUser } from './user.interface';
import { UserCollection } from './user.model';
import bcrypt from 'bcrypt';
import { sendMail } from '../../mailSender';
import { resetPasswordVarificationMessage } from '../../mailSender/mailFormat';

// ********user*********

// sign up User
const registerUserIntoDB = async (payload: TUser) => {
  try {
    const result = await UserCollection.create(payload);
    return result;
  } catch (err: any) {
    console.log('Error user signup failed', err);
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'user account create failed',
    );
  }
};
// login user
const loginUser = async (payload: Partial<TUser>) => {
  const { password, email } = payload;

  try {
    const user = await UserCollection.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'user not found');
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password as string, user.password);

    if (isMatch) {
      // check user.isDeleted
      if (user.isDeleted) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'sorry you already deleted!',
        );
      }
 
      // all ok sent user
      return user;
    } else {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Password does not match');
    }
  } catch (err) {
    console.log('Error comparing passwords:', err);
    throw err;
  }
};

//forget password   
const forgetPassword = async (payload: Partial<TUser>) => {
  const user = await UserCollection.findOne({ email: payload })
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found')    
  }
  // generatevarificationNumber
  function generatevarificationNumber() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  
  // genarate varification data 
  const expireTime = Date.now() + 1000*60*30; //30 min expire time 
  const varificationNumber = generatevarificationNumber();

  user.varificationCode = varificationNumber
  user.expireIn = expireTime
  user.save()

  const htmlMessage = resetPasswordVarificationMessage(varificationNumber)

  const mailRes = await sendMail({ user: user.email, subject: "Reset password Varification code", htmlMessage: htmlMessage })
    if (!mailRes) {
    throw new AppError(httpStatus.NOT_FOUND, 'password reset requst failed !')    
  }
  return null
}

// verifyResetPasswprdVerificationCode 
const verifyResetPasswordVerificationCode = async (payload: Partial<TUser>) => {
  const {email, varificationCode } = payload;

  try {
    const user = await UserCollection.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'user not found');
    }

    // verify time 
    const presentTime = Date.now()
    if (presentTime>user.expireIn) {
      throw new AppError(httpStatus.BAD_REQUEST, 'sorry varification code time expired')
    }

    // Compare the varification Code
    if (varificationCode!==user.varificationCode) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'sorry verfication not match ',
        );
 
      } 
      return user;
  } catch (err) {
    console.log('Error comparing passwords:', err);
    throw err;
  }
};
// reset password 
const resetPassword = async (payload:Partial<TUser>) => {
  try {
    const user = await UserCollection.findOne({ email: payload.email })
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST,"user not found")
    }
    user.password = payload.password as string
    user.save()     

    return user;
  } catch (error: any) {
    throw new AppError(
      httpStatus.CONFLICT,
      error.message || 'user restore failed',
    );
  }
};

// updateUserProfileDB;
const updateUserProfileDB = async (userId: string, payload: Partial<TUser>) => {
  try {
    // console.log(userId, payload);
    const result = UserCollection.findByIdAndUpdate(userId, payload, { new: true });
    return result;
  } catch (err: any) {
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'user account update failed',
    );
  }
};

// ********admin******

// delete user
const deleteUserDB = async (userId: string, adminId: string) => {
  try {
    if (userId === adminId) {
      throw new AppError(httpStatus.BAD_REQUEST, 'you can not deleted you');
    }
    const user = await UserCollection.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, "user Can't found !");
    }
    if (user.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'user already have deleted');
    }

    user.isDeleted = true;
    await user.save();

    return user;
  } catch (error: any) {
    throw new AppError(
      httpStatus.CONFLICT,
      error.message || 'user delete failed',
    );
  }
};



export const UserServices = {
  registerUserIntoDB,
  loginUser,
  forgetPassword,
  verifyResetPasswordVerificationCode,
  updateUserProfileDB,
  deleteUserDB,
  resetPassword
};
