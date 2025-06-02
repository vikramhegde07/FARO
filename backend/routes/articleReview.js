import express from 'express';
import auth from '../middlewares/auth.js';
import { removeArticleReviews, removeReviewById } from '../controllers/articleReview.js';
import { ArticleReview } from '../models/articleReview.js';

const router = express.Router();

//Get All Reviews
router.get('/', async(req, res) => {
    try {
        const reviews = await ArticleReview.find();

        if (!reviews)
            return res.status(403).json({ error: "No Reviews Found!" });

        return res.status(200).json(reviews);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ error: err.message });
    }
});

// Get All reviews for an article
router.get('/article/:id', async(req, res) => {
    const articleId = req.params.id;

    try {

        // 1. Use .populate() correctly to get user details
        const reviews = await ArticleReview.find({ articleId: articleId })
            .populate('userId', 'username email'); // 'userId' is the field to populate, 'username email' are the fields to include from the User model

        if (!reviews || reviews.length === 0) { // Check for empty array instead of !reviews for better semantics
            return res.status(404).json({ message: "No reviews found for this article." });
        }

        return res.status(200).json(reviews);
    } catch (err) {
        console.error('Server error: ' + err.message); // Use console.error for errors
        res.status(500).json({ error: 'Server error', details: err.message }); // Send more informative error
    }
});

//Add new review
router.post('/add', auth, async(req, res) => {
    const { articleId } = req.body;
    let { content } = req.body;
    const userId = req.userId;
    try {

        if (!articleId || !content || !userId) {
            return res.status(404).json({
                error: 'Send all required fields'
            });
        }

        if (typeof content === 'string') content = JSON.parse(content);


        const newReview = new ArticleReview({
            articleId,
            userId,
            content
        });

        await newReview.save();

        return res.status(201).json({ message: "Review Submitted" });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});

//Update review
router.patch('/update', auth, async(req, res) => {
    const { reviewId, comments } = req.body;
    const userId = req.userId;

    try {

        if (!reviewId || !comments || userId) {
            return res.status(404).json({
                error: 'Send all required fields'
            });
        }

        const review = await ArticleReview.findOne({ reviewId });

        if (review.userId !== userId)
            return res.status(400).json({ error: "Sorry! you do not have the credentials to edit the review" });

        await ArticleReview.findByIdAndUpdate(reviewId, { comments: comments });

        return res.status(200).json({ message: "Updated Successfully" });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});

//Delete review by Id
router.delete('/review/:id', async(req, res) => {
    const reviewId = req.params.id;

    try {
        if (!reviewId)
            return res.status(404).json({ error: "Please send review ID" });

        const deleteCount = await removeReviewById(reviewId);

        return res.status(200).json({ message: `${deleteCount} - Review Removed` });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});

//Delete review by article
router.delete('/article/:id', async(req, res) => {
    const articleId = req.params.id;

    try {
        if (!articleId)
            return res.status(404).json({ error: "Please send article ID" });

        const deleteCount = await removeArticleReviews(articleId);

        return res.status(200).json({
            message: 'Deleted all reviews',
            deleteCount
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;