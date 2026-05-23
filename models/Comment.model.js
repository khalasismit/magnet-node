import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
        replies: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: []
        }]
    }, {
        timestamps: true
    }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
