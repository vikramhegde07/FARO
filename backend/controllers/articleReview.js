import { ArticleReview } from "../models/articleReview";

//Get all reviews in Database
export const getAllReviews = async(req, res) => {
    try {
        const reviews = await ArticleReview.find();

        if (!reviews)
            return res.status(403).json({ error: "No Reviews Found!" });

        return res.status(200).json(reviews);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ error: err.message });
    }
};

//Get All reviews for an article
export const getReviewForArticle = async(req, res) => {
    const articleId = req.params.id;
    try {

        const reviews = await ArticleReview.findById(articleId);

        if (!reviews)
            return res.status(403).json({ error: "No reviews found for the article" });

        return res.status(200).json(reviews);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
}

//Get All Reviews made by user with id
export const getReviewWithUserId = async(req, res) => {
    try {
        const userId = req.params.id;

        const reviews = await ArticleReview.find({ userId });

        if (!reviews)
            return res.status(403).json({ error: "No reviews found!" });

        return res.status(200).json(reviews);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
};

//Get All Reviews made by user with token
export const getAllUserReviewWithAuth = async(req, res) => {
    const userId = req.userId;
    try {
        const reviews = await ArticleReview.find({ userId });

        if (!reviews)
            return res.status(403).json({ error: "No reviews found!" });

        return res.status(200).json(reviews);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
};


//Add Review for an article
export const addReview = async(req, res) => {
    const { articleId, comments } = req.body;
    const userId = req.userId;
    try {

        if (!articleId || !comments || userId) {
            return res.status(404).json({
                error: 'Send all required fields'
            });
        }

        const newReview = new ArticleReview({
            articleId,
            userId,
            comments
        });

        await newReview.save();

        return res.status(201).json({ message: "Review Submitted" });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
};

//Update review comments
export const updateReview = async(req, res) => {
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
};

//Delete Review by id
export const removeReviewById = async(req, res) => {
    const reviewId = req.params.id;

    try {
        if (!reviewId)
            return res.status(404).json({ error: "Please send review ID" });

        await ArticleReview.findByIdAndDelete(reviewId);

        return res.status(200).json({ message: 'Review Removed' });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
};

//Delete all review for article by article id
export const removeArticleReviews = async(req, res) => {
    const articleId = req.params.id;

    try {
        if (!articleId)
            return res.status(404).json({ error: "Please send article ID" });

        const deleteCount = await ArticleReview.deleteMany({ articleId: articleId });

        return res.status(200).json({
            message: 'Deleted all reviews',
            deleteCount
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
};