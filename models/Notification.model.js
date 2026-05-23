import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
