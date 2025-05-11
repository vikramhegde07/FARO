import express from 'express';
import auth from '../middlewares/auth.js';
import { getAllUsers, getOneUserWithId, getOneUserWithToken, loginUser, registerUser, updatePassword, updateUserProfile } from '../controllers/user.js';


const router = express.Router();

//route to get all users
router.get('/', getAllUsers);

//route to get one user data with token
router.get('/getOne', auth, getOneUserWithToken);

//get user data with id
router.get('/getOne/:userId', getOneUserWithId);

//register a new user
router.post('/register', registerUser);

//login for a user
router.post('/login', loginUser);

//route to update some of user profile data
router.patch('/update/auth/profile', auth, updateUserProfile);

//route to change user password
router.patch('/update/auth/password', auth, updatePassword);

export default router;