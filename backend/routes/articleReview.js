import express from 'express';
import auth from '../middlewares/auth';
import { addReview, getAllReviews, getAllUserReviewWithAuth, getReviewForArticle, getReviewWithUserId, removeArticleReviews, removeReviewById, updateReview } from '../controllers/articleReview';

const router = express.Router();

//Get All Reviews
router.get('/', getAllReviews);

//Get All reviews for an article
router.get('/article/:id', getReviewForArticle);

//Get All Reviews made by user with id
router.get('/user/id/:id', getReviewWithUserId);

//Get All Reviews made by user with token
router.get('/user/id/:id', auth, getAllUserReviewWithAuth);

//Add new review
router.post('/add', auth, addReview);

//Update review
router.patch('/update', auth, updateReview);

//Delete review by Id
router.delete('/review/:id', removeReviewById);

//Delete review by article
router.delete('/article/:id', removeArticleReviews);

export default router;