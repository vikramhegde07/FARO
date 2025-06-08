import express from 'express';
import { EventRegistry } from '../models/eventRegistry.js';
import { sendConfirmationMail } from '../controllers/mail.js';
import { Event } from '../models/eventModel.js';

const router = express.Router();

//Get all registrations
router.get('/', async(req, res) => {
    try {
        const register = await EventRegistry.find().sort({ createdAt: -1 });

        if (register.length === 0)
            return res.status(403).json({ error: "Sorry no registration found" })

        return res.status(200).json(register);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//Get all registrations for an event
router.get('/:eventId', async(req, res) => {
    const eventId = req.params.eventId;
    try {
        const registrations = await EventRegistry.find({ eventId: eventId }).sort({ xreatedAt: -1 });

        if (registrations.length === 0)
            return res.status(403).json({ error: "No user registered!" });

        return res.status(200).json(registrations);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

//create a registration for an event
router.post('/create', async(req, res) => {
    const { fullname, eventId, email } = req.body;
    try {

        if (!fullname || !email || !eventId) {
            return res.status(404).json({
                message: 'Send all required fields'
            });
        }

        const registered = await EventRegistry.findOne({
            email: email,
            eventId: eventId
        })

        if (registered)
            return res.status(400).json({ error: "Email is already used to register in this event" });

        const newRegister = new EventRegistry({
            fullname,
            email,
            eventId
        });
        await newRegister.save();

        const event = await Event.findById(eventId);

        await sendConfirmationMail({
            to: email,
            name: fullname,
            event: {
                name: event.title,
                date: event.eventDate,
                location: event.location
            }
        });

        return res.status(201).json(newRegister);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});


//Remove 1 registeration with registration ID
router.delete('/regId/:id', async(req, res) => {
    const registrationId = req.params.id;
    try {
        await EventRegistry.findByIdAndDelete(registrationId);

        return res.status(200).json({ message: 'Removed from registry' });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

//Remove all registeration for an event
router.delete('/event/:id', async(req, res) => {
    const eventId = req.params.id;
    try {
        const deleteCount = await EventRegistry.deleteMany({ eventId: eventId });

        return res.status(200).json({ message: `Removed ${deleteCount} from registry` });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});
export default router;