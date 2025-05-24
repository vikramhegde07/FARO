import express from 'express';
import auth from '../middlewares/auth.js';
import { checkUserLogin, getAllUsers, getOneUserWithId, getOneUserWithToken, getPrivillaged, loginUser, registerUser, updatePassword, updateProfileImage, updateUserProfile } from '../controllers/user.js';
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

//route to get privillaged users
router.get('/privillaged', getPrivillaged);

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

//route to delete a user profile image
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

//route to revoke or grant user privillage
router.patch('/update/privillage', auth, async(req, res) => {
    const adminId = req.userId;
    const { action, userId, privillage } = req.body;
    try {

        if (!adminId || !privillage)
            return res.status(403).json({ error: "Send all required fields!" });

        const adminData = await User.findById(adminId);
        if (!adminData)
            return res.status(404).json({ error: "No admin account found!" });

        if (adminData.user_type !== 'admin')
            return res.status(404).json({ error: "No admin privillages!" });

        const allowed = ['read', 'write', 'review', 'edit'];
        if (!allowed.includes(privillage))
            return res.status(400).json({ message: 'Invalid privilege value' });

        const userData = await User.findById(userId);

        if (action === 'allow') {
            if (userData.privillage.includes(privillage))
                return res.status(404).json({ error: "User already has the privillage" });

            await User.findByIdAndUpdate(
                userId, {
                    $addToSet: {
                        privillage: privillage
                    }
                }, { new: true }
            )

            res.status(200).json({ message: "The user privillage has been granted!" });
        } else if (action === 'revoke') {
            if (!userData.privillage.includes(privillage))
                return res.status(404).json({ error: "User doesn't have the privillage!" });
            await User.findByIdAndUpdate(
                userId, {
                    $pull: {
                        privillage: privillage
                    }
                }, { new: true }
            );
            res.status(200).json({ message: "The user privillage has been removed" });
        }

        return res;
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;