// /* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
// import config from "../../config";
import bcrypt from 'bcrypt';
import config from '../../../config';

// password123 =  $2b$10$qx9jGbAFw4CUK4HoUn/MKehg2wYevxbQHWZ.MYsRulThLotnpbt.C
const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },

    avatar: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    varificationCode: {
      type: Number,
    },
    expireIn: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const userData = this;
  userData.password = await bcrypt.hash(
    userData.password,
    Number(config.saltRounds),
  );
  next();
});

userSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform: function (doc, ret, options) {
    ret.password = undefined;
    return ret;
  },
});

export const UserCollection = model<TUser>('user', userSchema);
