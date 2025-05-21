import express from 'express';
import { Access } from '../models/accessModel.js';
import auth from '../middlewares/auth.js';
import { User } from '../models/userModel.js';

const router = express.Router();

//Get all access route requests
router.get('/', async(req, res) => {
    try {
        const requests = await Access.find().sort({ created_at: -1 });
        if (requests.length === 0)
            return res.status(404).json({ error: "No requests found!" });

        return res.status(200).json(requests);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//create new access request
router.post('/create', auth, async(req, res) => {
    const { privillage } = req.body;
    const userId = req.userId;
    try {

        if (!privillage || !userId) {
            return res.status(404).json({
                message: 'Send all required fields'
            });
        }

        const userData = await User.findById(userId);

        if (!userData)
            return res.status(404).json({ error: "No user found!" });

        const newAccess = new Access({
            userId,
            privillage
        });

        await newAccess.save();

        return res.status(201).json({ message: "The request has been submitted" });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

//Allow or revoke new access request
router.patch('/update/create', auth, async(req, res) => {
    const userId = req.userId;
    const { action, accessId } = req.body;
    try {
        if (!userId || !action || !accessId)
            return res.status(403).json({ error: "Send all required fields" });

        const adminData = await User.findById(userId);
        if (!adminData)
            return res.status(404).json({ error: "No admin account found" });

        if (adminData.user_type !== 'admin')
            return res.status(403).json({ error: "No admin privillages" });

        if (action === 'allow') {
            const accessData = await Access.findById(accessId);
            const userData = await User.findById(accessData.userId);

            const allowed = ['read', 'write', 'review', 'edit'];
            if (!allowed.includes(accessData.privillage))
                return res.status(400).json({ message: 'Invalid privilege value' });

            if (userData.privillage.includes(accessData.privillage))
                return res.status(404).json({ error: "User already has the privillage" });

            await User.findByIdAndUpdate(
                accessData.userId, {
                    $addToSet: {
                        privillage: accessData.privillage
                    }
                }, { new: true }
            )

            res.status(200).json({ message: "User Privillage has been granted!" });
        } else {
            res.status(200).json({ message: "User request has been revoked" })
        }
        await Access.findByIdAndDelete(accessId);
        return res;
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});


export default router;