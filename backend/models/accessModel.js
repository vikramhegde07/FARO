import mongoose from 'mongoose';

const accessSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    privillage: {
        type: String,
        enum: ['write', 'review', 'edit'],
        required: true
    }
}, {
    timestamps: true
});

export const Access = mongoose.model('Access', accessSchema);