import express from 'express';
import { Event } from '../models/eventModel.js';
import auth from '../middlewares/auth.js';
import { User } from '../models/userModel.js';
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


//route to create an event
router.post('/create', auth, async(req, res) => {
    const { title, location, eventDate, desc } = req.body;
    try {
        if (!title ||
            !location ||
            !eventDate ||
            !desc
        ) {
            return res.status(404).json({
                message: 'Send all required fields'
            });
        }

        if (!req.userId)
            return res.status(404).json({ error: "Forbidden! No access found" });

        const userData = await User.findById(req.userId);
        if (userData.user_type !== 'admin')
            return res.status(404).json({ error: "Forbidden! No access found" });

        const newEvent = new Event({ title, location, eventDate, desc });
        await newEvent.save();

        return res.status(201).json(newEvent);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});
export default router;