import express from 'express';
import auth from '../middlewares/auth.js';
import { checkAccess, createIsland, getAllIslands, getIslandWithId, removeIsland } from '../controllers/island.js';
import { Island } from '../models/islandModel.js';
const router = express.Router();

//Get all islands
router.get('/', getAllIslands);

//Get Island by id
router.get('/:id', getIslandWithId);

//Create an island
router.post('/create', createIsland);

//Remove and Island
router.delete('/delete/:id', removeIsland);

//Check Access of islands for the user
router.get('/checkAccess/:id', auth, checkAccess);

//update island title
router.patch('/edit', async(req, res) => {
    const { title, islandId } = req.body;
    try {
        if (!title || !islandId)
            return res.status(404).json({ error: "Send new title and island id for editing" });

        await Island.findByIdAndUpdate(islandId, { title: title });

        return res.status(200).json({ message: 'updated' });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;