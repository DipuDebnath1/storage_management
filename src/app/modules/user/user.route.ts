import express from 'express';
import { UserController } from './user.controller';
import validationRequest from '../../utills/validationRequest';
import userValidation from './user.validation';
import {
  verifyAdmin,
  verifyLoginUser,
  verifyUser,
} from '../../../midlewere/auth';
const router = express.Router();

//******* user ***********
router.post(
  '/signup',
  validationRequest(userValidation.userValidationSchema),
  UserController.createStudent,
);
router.post('/signin', UserController.LoginUser);
router.post('/delete', verifyAdmin(), UserController.DeleteUserRole);
router.post('/reset', verifyAdmin(), UserController.RestoreUserRole);

router.get('/:id', verifyLoginUser(), UserController.FindSingleUser);

router.put('/update-profile', verifyUser(), UserController.UpdateUserProfile);

export const UserRoute = router;
