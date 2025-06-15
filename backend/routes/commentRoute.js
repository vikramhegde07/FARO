import express from 'express';
import { Comment } from '../models/commentModel.js';
import auth from '../middlewares/auth.js';

const router = express.Router();


//Get all comments
router.get('/', async(req, res) => {
    try {
        const comments = await Comment.find();
        if (comments.length === 0)
            return res.status(403).json({
                error: "Sorry! No comments found"
            });

        return res.status(200).json({
            message: "All Comments",
            comments
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//Route to get comments for an article
router.get('/article/:articleId', async(req, res) => {
    const articleId = req.params.articleId;
    try {
        const comments = await Comment.find({ articleId }).sort({ createdAt: -1 });
        if (comments.length === 0)
            return res.status(403).json({
                error: "No Comments found for the post"
            });

        return res.status(200).json({
            message: 'Comments found for the article',
            comments
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

//Create new Comment for a post
router.post('/create', auth, async(req, res) => {
    const { articleId, message } = req.body;
    const userId = req.userId;
    try {
        if (!articleId || !message || !userId) {
            return res.status(404).json({
                message: 'Send all required fields'
            });
        }

        const newComment = new Comment({
            articleId,
            message,
            userId
        });

        await newComment.save();

        return res.status(201).json({
            message: "New Comment Added Successfully",
            newComment
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});


export default router;
