import express from 'express';
import { User } from '../models/userModel.js';
import auth from '../middlewares/auth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

//route to get all users
router.get('/', async(req, res) => {
    try {

        const users = await User.find();

        if (!users)
            return res.status(403).json({ error: "No Users Found" });

        return res.status(200).json(users);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//route to get one user data with token
router.get('/getOne', auth, async(req, res) => {
    try {

        const userData = await User.findById(req.userId);

        if (!userData)
            return res.status(403).json({ error: "No user data found" });

        return res.status(200).json(userData);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

//get user data with id
router.get('/getOne/:userId', async(req, res) => {
    const userId = req.params;
    try {

        const userData = await User.findById(userId);

        if (!userData)
            return res.status(403).json({ error: "No user Found" });

        return res.status(200).json(userData);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

//register a new user
router.post('/register', async(req, res) => {
    const { username, email, password, user_type } = req.body;
    try {

        if (!username ||
            !email ||
            !password ||
            !user_type
        ) {
            return res.status(404).json({
                error: 'Send all required fields'
            });
        }

        const user = await User.find({ email: email });
        if (user.length == 1)
            return res.status(400).json({ error: 'Email already exists!' });

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
            user_type
        });

        await newUser.save();

        const payload = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24hr' });
        // return user information and token  
        return res.status(201).json({
            Success: "New user has been created",
            user: newUser,
            token: token
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});

//login for a user
router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {

        if (!email ||
            !password
        ) {
            return res.status(404).json({
                error: 'Send all required fields'
            });
        }

        const userData = await User.findOne({ email: email });

        if (!userData)
            return res.status(403).json({ error: 'No user found with email' });

        const isPassword = await bcrypt.compare(password, userData.password);

        if (!isPassword)
            return res.status(404).json({ error: 'Invalid Password' });

        const payload = {
            id: userData._id,
            email: userData.email,
            username: userData.username
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24hr' });

        //return userdata and token
        return res.status(200).json({
            message: 'Login Successfull',
            User: userData,
            token: token
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

//route to update some of user profile data
router.patch('/update', auth, async(req, res) => {
    const { username, email, phone, address } = req.body;
    const userId = req.userId;
    try {
        if (!userId && (!username || !email || !phone || !address)) {
            return res.status(404).json({
                error: 'Send minimum required fields'
            });
        }

        //creating payload
        const payload = {};
        //checking each parameter if they are sent and if sent add to payload
        if (username) payload.username = username;
        if (email) payload.email = email;
        if (phone) payload.phone = phone;
        if (address) payload.address = address;

        //find the user with id and update with payload
        await User.findByIdAndUpdate(userId, payload);

        return res.status(200).json({ message: "User profile updated." });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});

//route to change user password
router.patch('/changePassword', auth, async(req, res) => {
    const { oldPass, newPass } = req.body;
    const userId = req.userId;
    try {

        if (!oldPass || !newPass) {
            return res.status(404).json({
                error: 'Send minimum requirements'
            });
        }

        const userData = await User.findById(userId);

        if (!userData)
            return res.status(403).json({ error: 'No user found!' });

        const isOldPass = await bcrypt.compare(oldPass, userData.password);

        if (!isOldPass)
            return res.status(400).json({ error: "Old password do not match!" });

        const passwordHash = await bcrypt.hash(newPass, 10);

        await User.findByIdAndUpdate(userId, { password: passwordHash });

        return res.status(200).json({ message: 'User password changed successfully' });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;