import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    fileName: {
        type: String,
        trim: true
    },
    originalName: {
        type: String,
        required: true,
        trim: true
    },
    mimetype: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    uploadDate: { 
        type: Date, 
        default: Date.now 
    },
});

const File = mongoose.model("File", FileSchema);
export default File;
