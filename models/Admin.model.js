import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      maxlength: 25,
      unique: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      maxlength: 50,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 60,
      trim: true,
    },
    picturePath: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    status: {
      type: Boolean,
      default: false
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: []
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: []
    }],
    followRequest: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: []
    }],
    sentRequest: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: []
    }],
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: []
    }],
    saved: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: []
    }]
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;