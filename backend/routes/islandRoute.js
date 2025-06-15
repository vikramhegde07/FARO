import express from 'express';
import auth from '../middlewares/auth.js';
import { checkAccess, createIsland, getAllIslands, getIslandWithId, removeIsland } from '../controllers/island.js';
import { Island } from '../models/islandModel.js';
import upload from '../middlewares/upload.js';
import { uploadImageToS3 } from '../controllers/uploadController.js';
import deleteS3Files from '../middlewares/remover.js';
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

//update island title and article types
router.patch('/edit', async(req, res) => {
    const { title, islandId } = req.body;
    let { articleTypes } = req.body;
    try {
        if (!islandId)
            return res.status(404).json({ error: "Send island id for editing" });

        if (typeof articleTypes === 'string') articleTypes = JSON.parse(articleTypes);

        await Island.findByIdAndUpdate(islandId, { title: title, articleTypes: articleTypes });

        return res.status(200).json({ message: 'updated' });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});

//route to add/update samples
router.put('/samples', upload.array('images'), async(req, res, next) => {
    const images = req.files;
    const { islandId, sampleName, sampleId } = req.body;
    let { prevLink } = req.body;

    try {
        const islandData = await Island.findById(islandId);
        if (!islandData)
            return res.status(404).json({
                error: "Sorry! No island found"
            });


        const uploadedImages = [];
        const final = await Promise.all(images.map(async(image) => {
            const uploaded = await uploadImageToS3(image.buffer, 'samples', image.originalname, image.mimetype);
            uploadedImages.push(uploaded.url);
        }))
        const prevSample = islandData.samples.filter(sample => sample.name === sampleName)

        let filesToDelete = [];
        if (prevSample.length > 0) {
            if (!prevLink) {
                filesToDelete = prevSample[0].images;
            } else {
                prevLink.forEach(link => uploadedImages.push(link));
                filesToDelete = prevSample[0].images.filter(link => !prevLink.includes(link))
            }
            req.s3FilesToDelete = filesToDelete;
        }

        if (sampleId) {

            let currentSample = islandData.samples.id(sampleId);
            if (!currentSample) {
                return res.status(404).json({ message: 'Sample not found within this island.' });
            }
            currentSample.name = sampleName;
            currentSample.images = uploadedImages;

            await islandData.save();
        } else {
            const newSample = {
                name: sampleName,
                images: uploadedImages
            }
            await Island.findByIdAndUpdate(islandId, {
                $addToSet: {
                    samples: newSample
                }
            })
        }

        next();
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
}, deleteS3Files, async(req, res) => {
    return res.status(200).json({ message: 'Sample Updated successfully' });

});

export default router;