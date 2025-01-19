import express from 'express';
import { UserController } from './user.controller';
import validationRequest from '../../utills/validationRequest';
import userValidation from './user.validation';
import {
  verifyUser,
} from '../../../midlewere/auth';
const router = express.Router();

//******* user ***********
router.post(
  '/signup', validationRequest(userValidation.userValidationSchema), UserController.RegisterUser,
);
router.post('/signin', UserController.LoginUser);
router.post('/forgetPassword', UserController.ForgetPassword);
router.post('/VerifyOTP', UserController.VerifyResetPasswordVerificationCode);
router.post('/resetPassword', UserController.ResetPassword);
router.post('/delete',  UserController.DeleteUserRole);

router.put('/update-profile', verifyUser(), UserController.UpdateUserProfile);

export const UserRoute = router;
