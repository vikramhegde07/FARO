import express from 'express';
import { ReviewAssignment } from '../models/reviewAssignment.js';
import auth from '../middlewares/auth.js';
import { User } from '../models/userModel.js';
import { ArticleReview } from '../models/articleReview.js';

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

// Route to get all review assignments for a particular user
router.get('/user-assignments/', auth, async(req, res) => {
    try {
        const userId = req.userId;

        // 1. Find review assignments for the user
        const assignments = await ReviewAssignment.find({ users: userId })
            .populate('articleId') // Populate the article details
            .populate('users', 'username email'); // Populate user details, only username and email

        if (assignments.length === 0) {
            return res.status(404).json({ message: 'No review assignments found for this user.' });
        }

        // 2. Create an array of article IDs from the assignments
        const assignedArticleIds = assignments.map(assignment => assignment.articleId._id);

        // 3. Find all reviews by this user for any of these assigned articles
        const existingReviews = await ArticleReview.find({
            userId: userId,
            articleId: { $in: assignedArticleIds } // Check if articleId is in the list of assigned articles
        }).select('articleId'); // Only select articleId to minimize data transfer

        // 4. Create a Set for quick lookup of reviewed article IDs
        const reviewedArticleIds = new Set(existingReviews.map(review => review.articleId.toString()));

        // 5. Map over assignments to add the 'hasBeenReviewed' field
        const assignmentsWithReviewStatus = assignments.map(assignment => {
            const articleIdString = assignment.articleId._id.toString();
            return {
                ...assignment.toObject(), // Convert Mongoose document to plain JavaScript object
                hasBeenReviewed: reviewedArticleIds.has(articleIdString)
            };
        });

        res.status(200).json(assignmentsWithReviewStatus);

    } catch (error) {
        console.error('Error fetching user assignments:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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