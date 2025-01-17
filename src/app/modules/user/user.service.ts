/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import httpStatus from 'http-status';
import AppError from '../../ErrorHandler/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import bcrypt from 'bcrypt';

// ********user*********

// sign up User
const createUserIntoDB = async (payload: TUser) => {
  try {
    const result = await User.create(payload);
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
    const user = await User.findOne({ email });

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

      // check user.isBlocked

      if (user.isBlocked) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'sorry you already blocked!',
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

// find single user
const findSingleUser = async (id: string) => {
  try {
    const data = await User.findById(id)
      // .populate('totalFollower', 'name email img')
      // .populate('totalFollowing', 'name email img');
      .populate('totalFollower')
      .populate('totalFollowing');

    return data;
  } catch (err) {
    console.log('Error comparing passwords:', err);
    throw err;
  }
};
// updateUserProfileDB;
const updateUserProfileDB = async (userId: string, payload: Partial<TUser>) => {
  try {
    // console.log(userId, payload);
    const result = User.findByIdAndUpdate(userId, payload, { new: true });
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
    const user = await User.findById(userId);
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

// restore user
const restoreUserDB = async (userId: string, adminId: string) => {
  try {
    if (userId === adminId) {
      throw new AppError(httpStatus.BAD_REQUEST, 'you can not restore you');
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, "user Can't found !");
    }
    if (!user.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'user not found delete list');
    }

    user.isDeleted = false;
    await user.save();

    return user;
  } catch (error: any) {
    throw new AppError(
      httpStatus.CONFLICT,
      error.message || 'user restore failed',
    );
  }
};


export const UserServices = {
  createUserIntoDB,
  loginUser,
  findSingleUser,
  updateUserProfileDB,
  deleteUserDB,
  restoreUserDB
};
