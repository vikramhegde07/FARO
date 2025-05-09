import mongoose from 'mongoose';

const SubsriptionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    islandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Island',
        required: true
    }
});

export const Subsription = mongoose.model('Subsription', SubsriptionSchema);