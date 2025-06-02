import mongoose from 'mongoose';

const registrySchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: false,
        enum: ['Completed', 'Pending'],
        default: 'Pending'
    },
}, {
    timestamps: true
});

export const EventRegistry = mongoose.model('EventRegistry', registrySchema);