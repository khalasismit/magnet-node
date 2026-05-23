import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            default: 'public'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        imageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "File",
            required: true,
        },
        caption: {
            type: String,
            maxlength: 60,
            trim: true
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: [],
        }],
        visibility: {
            type: Boolean,
            default: true
        },
        saved: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        }]
    }, {
    timestamps: true
}
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
