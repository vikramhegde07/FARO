import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import upload from "../middlewares/upload.js";
import { uploadImageToS3 } from "./uploadController.js";
import deleteS3Files from "../middlewares/remover.js";

//method to get all users data
export const getAllUsers = async(req, res) => {
    try {

        const users = await User.find().sort({ username: 1 });

        if (!users)
            return res.status(403).json({ error: "No Users Found" });

        return res.status(200).json(users);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
};

//method to get one user data with user token
export const getOneUserWithToken = async(req, res) => {
    try {

        const userData = await User.findById(req.userId);

        if (!userData)
            return res.status(403).json({ error: "No user data found" });

        const payload = {
            id: userData._id,
            username: userData.username,
            email: userData.email,
            password: userData.password
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24hr' });

        return res.status(200).json({
            userData,
            token
        });

        return res.status(200).json(userData);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
};

//method to get users with special privillages
export const getPrivillaged = async(req, res) => {
    try {
        const users = await User.find({
            // either they have a privilege that is not 'read'
            privillage: { $elemMatch: { $ne: 'read' } }
        });

        if (users.length === 0)
            return res.status(404).json({ error: 'No users have additional privillages' });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//method to get one user data with user id
export const getOneUserWithId = async(req, res) => {
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
};

//method to register a new user
export const registerUser = async(req, res) => {
    const { username, email, password } = req.body;
    try {

        if (!username ||
            !email ||
            !password
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
            password: passwordHash
        });

        await newUser.save();

        const payload = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            password: newUser.password
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
};

//method to login the user
export const loginUser = async(req, res) => {
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
            username: userData.username,
            password: userData.password
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
};

//method to check user login on app load
export const checkUserLogin = async(req, res) => {
    const email = req.email;
    const password = req.password;
    try {
        const userData = await User.findOne({ email: email });

        if (!userData)
            return res.status(403).json({ error: 'No user found with email' });

        const isPassword = await bcrypt.compare(password, userData.password);

        if (!isPassword)
            return res.status(404).json({ error: 'Invalid Password' });

        const payload = {
            id: userData._id,
            email: userData.email,
            username: userData.username,
            password: userData.password
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

}

//method to update the user profile
export const updateUserProfile = async(req, res) => {
    const { username, email, phone } = req.body;
    const userId = req.userId;
    try {
        if (!userId && (!username || !email || !phone)) {
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

        //find the user with id and update with payload
        await User.findByIdAndUpdate(userId, payload);

        return res.status(200).json({ message: "User profile updated." });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
};

//method to update the password
export const updatePassword = async(req, res) => {
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
};

//method to update user profile images
export const updateProfileImage = async(req, res) => {
    try {
        const userId = req.userId;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { buffer, originalname, mimetype } = req.file;

        // Upload image to S3
        const { url, key } = await uploadImageToS3(buffer, 'profiles', originalname, mimetype);

        // Update user in DB
        const updatedUser = await User.findByIdAndUpdate(userId, { profile_pic: url });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Profile image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading user profile image:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}