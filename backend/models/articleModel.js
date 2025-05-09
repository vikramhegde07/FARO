import mongoose from 'mongoose';

const contentBlockSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['heading', 'subheading', 'paragraph', 'points', 'image', 'link'],
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // Can be string, array, object depending on type
        required: true,
    },
});

const relatedLinksBlockSchema = new mongoose.Schema({
    linkText: {
        type: String,
        required: true
    },
    linkAddr: {
        type: String,
        required: true
    }
});

const relatedFilesBlockSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    linkToFile: {
        type: String,
        required: true
    }
});

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    island: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Island',
        required: true
    },
    tier: {
        type: String,
        enum: ['free', 'paid'],
        required: false,
        default: 'paid'
    },
    approval: {
        type: Boolean,
        default: false
    },
    content: {
        type: [contentBlockSchema],
        default: []
    },
    relatedLinks: {
        type: [relatedLinksBlockSchema],
        default: []
    },
    relatedFiles: {
        type: [relatedFilesBlockSchema],
        default: []
    }
}, {
    timestamps: true
});

export const Article = mongoose.model('Article', articleSchema);