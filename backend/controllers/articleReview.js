import { ArticleReview } from "../models/articleReview.js";

//Delete Review by id
export const removeReviewById = async(reviewId) => {
    const deleteCount = await ArticleReview.findByIdAndDelete(reviewId);
    return deleteCount;
};

//Delete all review for article by article id
export const removeArticleReviews = async(articleId) => {
    const deleteCount = await ArticleReview.deleteMany({ articleId: articleId });
    return deleteCount;
};