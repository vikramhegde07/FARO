import express from 'express';
import auth from '../middlewares/auth.js';
import { checkUserLogin, getAllUsers, getOneUserWithId, getOneUserWithToken, loginUser, registerUser, updatePassword, updateProfileImage, updateUserProfile } from '../controllers/user.js';
import upload from '../middlewares/upload.js';
import deleteS3Files from '../middlewares/remover.js';
import { User } from '../models/userModel.js';


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

//login for a user
router.post('/checkLogin', auth, checkUserLogin);

//route to update some of user profile data
router.patch('/update/auth/profile', auth, updateUserProfile);

//route to change user password
router.patch('/update/auth/password', auth, updatePassword);

//route to change user profile image
router.post('/update/auth/prof_pic', auth, upload.single('image'), async(req, res, next) => {
    const userData = await User.findById(req.userId);
    if (!userData)
        return res.status(404).json({ error: "No User Found!" });

    if (userData.profile_pic !== '') {
        req.s3FilesToDelete = [userData.profile_pic];
    }
    next();
}, deleteS3Files, updateProfileImage);

router.delete('/delete/auth/remove_pic', auth, async(req, res, next) => {
    const userData = await User.findById(req.userId);
    if (!userData)
        return res.status(404).json({ error: "No User Found!" });

    if (userData.profile_pic !== '') {
        req.s3FilesToDelete = [userData.profile_pic];
    } else
        return res.status(404).json({ error: "no image to remove" });
    next();
}, deleteS3Files, async(req, res) => {
    await User.findByIdAndUpdate(req.userId, { profile_pic: '' });
    return res.status(200).json({ message: "Profile pic removed" });
})

export default router;