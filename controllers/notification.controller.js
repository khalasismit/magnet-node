import File from "../models/File.model.js";
import Notification from "../models/Notification.model.js";

/**
 * Creates a new notification.
 */
export const newNotif = async (req, res) => {
    try {
        const { senderId, receiverId, message, postId } = req.body;
        const notification = new Notification({
            senderId,
            receiverId,
            message,
            postId
        });
        await notification.save();
        
        const notif = await Notification.findOne({ 
            senderId, 
            receiverId, 
            postId, 
            message 
        }).populate("senderId", "userName picturePath").populate("postId", "imageId");
        
        const file = await File.findOne({ _id: notif.postId.imageId });
        const url = file ? file.url : '';
        
        return res.status(201).json({ ...notif.toObject(), url });
    } catch (err) {
        console.error("New notification error:", err);
        return res.status(400).json({ message: "Server Error" });
    }
};

/**
 * Retrieves all notifications for a user.
 */
export const getNotif = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifs = await Notification.find({ receiverId: userId })
            .populate("senderId", "userName picturePath")
            .populate("postId", "imageId");
            
        const notifications = await Promise.all(notifs.map(async (notif) => {
            const file = await File.findOne({ _id: notif.postId?.imageId });
            const url = file ? file.url : '';
            return { ...notif.toObject(), url };
        }));
        
        return res.status(200).json(notifications);
    } catch (err) {
        console.error("Get notifications error:", err);
        return res.status(400).json({ message: "Server Error" });
    }
};

/**
 * Deletes a notification.
 */
export const delNotif = async (req, res) => {
    try {
        const { senderId, receiverId, postId, message } = req.body;
        const deletedNotif = await Notification.findOneAndDelete({ 
            senderId, 
            receiverId, 
            postId, 
            message 
        });
        return res.status(200).json(deletedNotif);
    } catch (err) {
        console.error("Delete notification error:", err);
        return res.status(400).json({ message: "Server Error" });
    }
};
