import express from 'express';
import { Island } from '../models/islandModel.js';
import auth from '../middlewares/auth.js';
import { Subsription } from '../models/subsriptionModel.js';
const router = express.Router();

//Get all islands
router.get('/', async(req, res) => {
    try {
        const islands = await Island.find();
        if (!islands)
            return res.status(400).json({ error: "No islands found!" });

        return res.status(200).json(islands);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});

//Get Island by id
router.get('/:id', async(req, res) => {
    const islandId = req.params.id;
    try {
        const islandData = await Island.findByID(islandId);
        if (!islandData)
            return res.status(400).json({ error: "No islands found!" });

        return res.status(200).json(islandData);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});

//Create an island
router.post('/create', async(req, res) => {
    const { title } = req.body;
    try {

        if (!title) {
            return res.status(404).json({
                error: 'Send island title'
            });
        }

        const island = await Island.find({ title: title });

        if (island.length > 0)
            return res.status(400).json({ error: 'Island already exists' });

        const newIsland = new Island({ title });

        await newIsland.save();

        return res.status(201).json({
            message: 'New Island has been created',
            newIsland
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});

//Remove and Island
router.get('/delete/:id', async(req, res) => {
    const islandId = req.params.id;
    try {

        await Island.findByIdAndDelete(islandId);

        return res.status(200).json({ message: 'Island Removed' });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});

//Check Access of islands for the user
router.get('/checkAccess/:id', auth, async(req, res) => {
    try {
        const userId = req.userId;
        const islandId = req.params.id;

        const subscriptionData = await Subsription.findOne({ userId, islandId });
        if (!subscriptionData)
            return res.status(403).json({ error: "No Access Found!" });

        return res.status(200).json({
            subscriptionData,
            message: 'Access Found'
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
});
export default router;