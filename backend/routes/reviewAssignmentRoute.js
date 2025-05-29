import express from 'express';
import { ReviewAssignment } from '../models/reviewAssignment.js';
import auth from '../middlewares/auth.js';
import { User } from '../models/userModel.js';

const router = express.Router();

//Get all assignements
router.get('/', async(req, res) => {
    try {
        const assignemnts = await ReviewAssignment.find().sort({ createdAt: -1 });
        if (assignemnts.length === 0)
            return res.status(404).json({ error: "No assignemnts found" });

        return res.status(200).json(assignemnts);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//Create new Assignment
router.post('/create', auth, async(req, res) => {
    const userId = req.userId;
    let { articleId, users } = req.body;
    try {
        if (!articleId || !users) {
            return res.status(404).json({
                message: 'Send all required fields'
            });
        }
        const adminData = await User.findById(userId);
        if (!adminData || adminData.user_type !== 'admin')
            return res.status(403).json({ error: "Not authorized" });

        if (typeof users === 'string') users = JSON.parse(users);

        let assignemntData = await ReviewAssignment.findOne({ articleId });
        if (assignemntData !== null) {

            let changed = false;
            users.assignment.forEach(user => {
                if (!assignemntData.users.includes(user)) {
                    changed = true;
                    assignemntData.users.push(user);
                }
            });
            if (changed) {
                await assignemntData.save();
                return res.status(200).json({
                    message: "Assigned some new users",
                    assignemntData
                });
            } else
                return res.status(200).json({ message: "User(s) is/are already assigned" })
        }

        const newAssignemnt = new ReviewAssignment({
            articleId,
            users: users.assignment
        });
        await newAssignemnt.save();

        return res.status(201).json({
            message: "Created New Assignments",
            newAssignemnt
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;