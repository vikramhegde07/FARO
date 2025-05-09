import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

export const ArticleReview = mongoose.model('ArticleReview', reviewSchema);