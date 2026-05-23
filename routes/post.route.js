import express from "express";
import multer from 'multer';
import { 
    Feed, 
    comment, 
    deletePost, 
    deleteComment, 
    editPost, 
    explore, 
    getComments, 
    getPost, 
    getUserPosts, 
    getpostsadmin, 
    removePost, 
    savePost, 
    toggleCommentLike, 
    toggleLike, 
    getComment 
} from "../controllers/post.controller.js";
import User from "../models/User.model.js";
import Post from "../models/Post.model.js";
import Admin from "../models/Admin.model.js";
import { validateRequest } from "../validation/validate.middleware.js";
import { 
    createPostSchema, 
    editPostSchema, 
    commentSchema, 
    toggleCommentLikeSchema, 
    savePostSchema 
} from "../validation/post.validation.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

/* ROUTE FOR CREATING A NEW POST */
router.post("/create", upload.single("file"), validateRequest(createPostSchema), async (req, res) => {
  try {
    const { userId, caption, fileId } = req.body;
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newPost = new Post({
      userId: user._id,
      userName: user.userName,
      location: user.location,
      imageId: fileId,
      caption: caption,
      likes: [],
      comments: [],
      visibility: true,
    });
    await newPost.save();
    await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { posts: newPost._id } },
      { new: true }
    );
    const posts = await Post.find();
    return res.status(201).json(posts);
  } catch (err) {
    return res.status(409).json({ message: err.message });
  }
});

router.post("/admin/create", upload.single("file"), validateRequest(createPostSchema), async (req, res) => {
  try {
    const { userId, caption, fileId } = req.body;
    const user = await Admin.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const newPost = new Post({
      userId: user._id,
      userName: user.userName,
      location: user.location,
      imageId: fileId,
      caption: caption,
      likes: [],
      comments: [],
      visibility: true,
    });
    await newPost.save();
    await Admin.findByIdAndUpdate(
      { _id: userId },
      { $push: { posts: newPost._id } },
      { new: true }
    );
    const posts = await Post.find();
    return res.status(201).json(posts);
  } catch (err) {
    return res.status(409).json({ message: err.message });
  }
});

/* ROUTES TO GET ALL POSTS */ 
router.get("/", Feed);
router.get("/admin", getpostsadmin);
router.get("/explore", explore);

router.post("/edit/:postId", validateRequest(editPostSchema), editPost);

/* ROUTE FOR SINGLE POST */ 
router.get("/:postId", getPost);
router.get("/:userId/posts", getUserPosts);
router.patch("/:postId/toggleSave", validateRequest(savePostSchema), savePost);
router.patch("/:postId/remove", removePost);
router.patch("/:postId/delete", deletePost);

/* ROUTES FOR LIKE/UNLIKE POST */ 
router.patch("/:postId/toggleLike/:userId", toggleLike);

/* ROUTES RELATED TO COMMENT */ 
router.get("/:postId/comment/", getComments);
router.get("/:postId/comments/:commentId", getComment);
router.post("/:postId/comment/new", validateRequest(commentSchema), comment);
router.patch("/:postId/comment/toggleCommentLike", validateRequest(toggleCommentLikeSchema), toggleCommentLike);
router.patch("/:postId/comment/delete", deleteComment);

export default router;
