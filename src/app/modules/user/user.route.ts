import express from 'express';
import { UserController } from './user.controller';
import validationRequest from '../../utills/validationRequest';
import userValidation from './user.validation';
import { verifyLoginUser, verifyResetPassworduser } from '../../../midlewere/auth';
import { uploadFile } from '../../utills/storage';
const router = express.Router();

//******* user ***********
router.post(
  '/signup', validationRequest(userValidation.userValidationSchema), UserController.RegisterUser,
);
router.post('/signin', UserController.LoginUser);
router.post('/signout',verifyLoginUser(), UserController.LogOutUser);
router.post('/forgetPassword', UserController.ForgetPassword);
router.post('/VerifyOTP', UserController.VerifyResetPasswordVerificationCode);
router.post('/resetPassword',verifyResetPassworduser(), UserController.ResetPassword);
router.put('/update-profile', verifyLoginUser(), uploadFile.single('file'), UserController.UpdateUserProfile);
router.put('/update-password',verifyLoginUser(), UserController.UpdateUserPassword);
router.delete('/delete', verifyLoginUser(),  UserController.DeleteAccount);


export const UserRoute = router;
