import mongoose from 'mongoose';

const contentBlockSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['heading', 'subheading', 'paragraph', 'points', 'image', 'link', 'table', 'code'],
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // Can be string, array, object depending on type
        required: true,
    },
    classes: {
        type: String,
        default: '', // e.g., "text-center fw-bold text-lg"
    }
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

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        authorName: {
            type: String,
            required: true
        },
        linkToProfile: {
            type: String,
            required: false
        }
    },
    articleType: {
        type: String,
        required: false
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
    }
}, {
    timestamps: true
});

export const Article = mongoose.model('Article', articleSchema);