import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
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
}, {
    timestamps: true
});

export const Comment = mongoose.model('Comment', commentSchema);