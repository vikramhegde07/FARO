import { Event } from "../models/eventModel.js";

export const addRemovables = async(req, res, next) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Extract image URLs from content
    req.s3FilesToDelete = event.content
        .filter(block => block.type === 'image')
        .map(block => block.value);


    // Proceed to delete files
    next();
}