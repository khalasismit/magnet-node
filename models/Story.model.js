import mongoose from "mongoose";

const StorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        imageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "File",
            required: true
        },
        visibility: {
            type: Boolean,
            default: true
        }
    },
    { 
        timestamps: true 
    }
);

const Story = mongoose.model("Story", StorySchema);
export default Story;
