import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//method to get all users data
export const getAllUsers = async(req, res) => {
    try {

        const users = await User.find();

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

        return res.status(200).json(userData);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
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
};

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