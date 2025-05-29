import mongoose from 'mongoose';

const assignemntSchema = mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }]
}, {
    timestamps: true
});

export const ReviewAssignment = mongoose.model('ReviewAssignment', assignemntSchema);