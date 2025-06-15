import mongoose from 'mongoose';

const sampleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    }
})

const IslandSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    articleTypes: {
        type: [String],
        default: ['General']
    },
    samples: {
        type: [sampleSchema],
        default: []
    }
});

export const Island = mongoose.model('Island', IslandSchema);