import express from 'express';
import { Subsription } from '../models/subsriptionModel.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

//Base route in the router
router.get('/', async(req, res) => {
    try {
        return res.status(200).json('Hello from Router');
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//Find Subscriptions of users with id
router.get('/user/:id', async(req, res) => {
    try {
        const userId = req.params.id;

        const subscrData = await Subsription.findAll({ userId });

        if (!subscrData)
            return res.status(403).json({ error: "No Subscription Found!" });

        return res.status(200).json(subscrData);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

//Find Subscriptions of users with token
router.get('/user', auth, async(req, res) => {
    try {
        const userId = req.userId;

        const now = new Date();

        // Fetch active and expired subscriptions
        const subscriptions = await Subsription
            .find({ userId })
            .populate({
                path: "islandId",
                model: "Island",
                select: "title"
            })
            .sort({ expiresIn: -1 });

        const active = subscriptions.filter(sub => sub.expiresIn > now);
        const expired = subscriptions.filter(sub => sub.expiresIn <= now);

        return res.status(200).json({
            hasActive: active.length > 0,
            active: active,
            expired: expired
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

router.post('/user/create', auth, async(req, res) => {
    const { islandId } = req.body;
    const userId = req.userId;
    try {
        if (!islandId) {
            return res.status(404).json({
                message: 'Send minimun required fields'
            });
        };

        const now = new Date();
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);


        const newSub = new Subsription({ userId, islandId, expiresIn: oneMonthLater });
        await newSub.save();

        return res.status(201).json({ newSub });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

router.post('/admin/create', auth, async(req, res) => {
    const { islandId, userId } = req.body;
    try {
        if (!islandId) {
            return res.status(404).json({
                message: 'Send minimun required fields'
            });
        };

        const now = new Date();
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);


        const newSub = new Subsription({ userId, islandId, expiresIn: oneMonthLater });
        await newSub.save();

        return res.status(201).json({ newSub });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;