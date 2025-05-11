import express from 'express';
import auth from '../middlewares/auth.js';
import { checkAccess, createIsland, getAllIslands, getIslandWithId, removeIsland } from '../controllers/island.js';
const router = express.Router();

//Get all islands
router.get('/', getAllIslands);

//Get Island by id
router.get('/:id', getIslandWithId);

//Create an island
router.post('/create', createIsland);

//Remove and Island
router.get('/delete/:id', removeIsland);

//Check Access of islands for the user
router.get('/checkAccess/:id', auth, checkAccess);

export default router;