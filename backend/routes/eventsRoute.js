import express from 'express';
import { Event } from '../models/eventModel.js';
import auth from '../middlewares/auth.js';
import { User } from '../models/userModel.js';
import upload from '../middlewares/upload.js';
import { uploadImageToS3 } from '../controllers/uploadController.js';
import { addRemovables } from '../controllers/event.js';
import deleteS3Files from '../middlewares/remover.js';

const router = express.Router();

// Route to get all expired events (events before today)
router.get('/expired', async(req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // reset to start of the day

        const expiredEvents = await Event.find({
            eventDate: { $lt: today } // eventDate less than today
        }).sort({ eventDate: -1 }); // optional: sort by date descending (most recent expired first)

        if (!expiredEvents || expiredEvents.length === 0) {
            return res.status(404).json({ error: "No expired events found" });
        }

        res.status(200).json(expiredEvents);
    } catch (err) {
        console.error('Server error: ' + err.message);
        res.status(500).send({ message: err.message });
    }
});


// Route to get all upcoming events from current date
router.get('/upcoming', async(req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // reset time to start of the day

        const upcomingEvents = await Event.find({
            eventDate: { $gte: today } // eventDate greater than or equal to today
        }).sort({ eventDate: 1 }); // optional: sort by date ascending

        if (!upcomingEvents || upcomingEvents.length === 0) {
            return res.status(404).json({ error: "No upcoming events found" });
        }

        res.status(200).json(upcomingEvents);
    } catch (err) {
        console.error('Server error: ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//Route to get one event data
router.get('/getOne/:eventId', async(req, res) => {
    const eventId = req.params.eventId;

    try {
        if (!eventId)
            return res.status(404).json({ error: "Sorry! Need event id." });

        const eventData = await Event.findById(eventId);
        if (!eventData)
            return res.status(403).json({ error: 'Sorry! no event found.' })

        return res.status(200).json(eventData);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});


//route to create an event
router.post('/create', auth, upload.array('images'), async(req, res) => {
    try {
        const { title, location, eventDate, content } = req.body;

        if (!title || !location || !eventDate || !content) {
            return res.status(400).json({ error: 'Send all required fields' });
        }

        const parsedContent = JSON.parse(content);
        const updatedContent = [];
        let fileIndex = 0;

        // Replace 'upload' images with S3 uploaded URLs
        for (let block of parsedContent) {
            if (block.type === 'image' && block.value === 'upload') {
                const file = req.files[fileIndex];
                const uploadedUrl = await uploadImageToS3(
                    file.buffer,
                    'events/images',
                    file.originalname,
                    file.mimetype
                );
                updatedContent.push({ type: 'image', value: uploadedUrl.url });
                fileIndex++;
            } else {
                updatedContent.push(block);
            }
        }

        const newEvent = new Event({
            title,
            location,
            eventDate,
            content: updatedContent,
        });

        const saved = await newEvent.save();

        return res.status(201).json(saved);
    } catch (err) {
        console.error('Error creating event:', err);
        return res.status(500).json({ message: err.message });
    }
});

//Route to remove a published event
router.delete('/delete/:id', auth, async(req, res, next) => {

    if (!req.userId)
        return res.status(403).json({ error: 'No user id detected' });

    const user = await User.findById(req.userId);

    if (!user)
        return res.status(403).json({ error: "No user found!" });

    if (user.user_type !== 'admin')
        return res.status(404).json({ error: "Access restricted" });
    else
        next();

}, addRemovables, deleteS3Files, async(req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event and images deleted successfully' });
});

export default router;