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
  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'accound already deleted')    
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
          'sorry verfication varify failed',
        );
 
      } 
      return user._id;
  } catch (err) {
    console.log('Error comparing passwords:', err);
    throw err;
  }
};
// reset password 
const resetPassword = async (id: string, password:string ) => {
  try {
    const user = await UserCollection.findById(id)
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST,"user not found")
    }
    user.password =password 
    user.save()     

    return user;
  } catch (error: any) {
    throw new AppError(
      httpStatus.CONFLICT,
      error.message || 'user reset failed',
    );
  }
};

// updateUserProfileDB;
const updateUserProfileDB = async (userId: string, payload: Partial<TUser>) => {
  try {
    // console.log(userId, payload);
    const result =await UserCollection.findByIdAndUpdate(userId, payload, { new: true });
    return result;
  } catch (err: any) {
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'user profile update failed',
    );
  }
};

// updateUserProfileDB;
const updateUserPassword = async (userId: string, oldPassword:string, newPassword:string) => {
  try {
    // console.log(userId, payload);
    const user =await UserCollection.findById(userId)

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND,'user not found')
    }

    const isValidUser =await bcrypt.compare(oldPassword, user.password)

    if (!isValidUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "sorry password not match")
    }
    user.password = newPassword
    await user.save()

    return user;
  } catch (err: any) {
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'user profile update failed',
    );
  }
};

// ********admin******

// delete user
const deleteAccount = async (userId:string) => {
  const res = await UserCollection.findByIdAndUpdate(userId, { isDeleted: true })
  if (!res) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found!")
  }
  return null
};



export const UserServices = {
  registerUserIntoDB,
  loginUser,
  forgetPassword,
  verifyResetPasswordVerificationCode,
  resetPassword,
  updateUserProfileDB,
  updateUserPassword,
  deleteAccount,
};
