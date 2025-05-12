import { Island } from '../models/islandModel.js';
import { Subsription } from '../models/subsriptionModel.js';

//method to get all islands
export const getAllIslands = async(req, res) => {
    try {
        const islands = await Island.find();
        if (!islands)
            return res.status(400).json({ error: "No islands found!" });

        return res.status(200).json(islands);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
};

//method to get 1 island with id
export const getIslandWithId = async(req, res) => {
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
};

//method to create a new island
export const createIsland = async(req, res) => {
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
};

//method to remove an island
export const removeIsland = async(req, res) => {
    const islandId = req.params.id;
    try {

        await Island.findByIdAndDelete(islandId);

        return res.status(200).json({ message: 'Island Removed' });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ error: err.message });
    }
};

//Check Access of islands for the user
export const checkAccess = async(req, res) => {
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
};