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

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    content: {
        type: [contentBlockSchema],
        default: []
    }
}, {
    timestamps: true
});

export const Event = mongoose.model('Event', eventSchema);