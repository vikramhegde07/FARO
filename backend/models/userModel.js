import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: false
    },
    profile_pic: {
        type: String,
        required: false,
        default: ''
    },
    user_type: {
        type: String,
        enum: ['reader', 'author', 'admin'],
        default: 'reader'
    },
    address: {
        type: String,
        required: false,
        default: ''
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subsription',
        required: false
    }
});

export const User = mongoose.model('User', userSchema);