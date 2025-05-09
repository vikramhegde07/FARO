import mongoose from 'mongoose';

const IslandSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    }

});

export const Island = mongoose.model('Island', IslandSchema);