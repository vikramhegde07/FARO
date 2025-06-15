import { Comment } from "../models/commentModel.js";
import { Subsription } from "../models/subsriptionModel.js";

// function to check for the comment posting
export const checkSubscription = async(userId, islandId) => {
    const subscriptions = await Subsription
        .findAll({
            userId,
            islandId
        })
        .sort({ createdAt: -1 });


}