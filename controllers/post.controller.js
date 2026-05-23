import User from "../models/User.model.js";
import Post from "../models/Post.model.js";
import File from "../models/File.model.js";
import Comment from "../models/Comment.model.js";

/* GET FEED POST */
export const Feed = async (req, res) => {
  try {
    const posts = await Post.find({ visibility: true });

    const postWithUrl = await Promise.all(posts.map(async (post) => {
      const user = await User.findById(post.userId);
      const file = await File.findById(post.imageId);
      const userName = user ? user.userName : '';
      const picturePath = user ? user.picturePath : '';
      const url = file ? file.url : '';
      return { ...post.toObject(), url, userName, picturePath };
    }));

    return res.status(200).json(postWithUrl);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const AdminFeed = async (req, res) => {
  try {
    const posts = await Post.find();
    const postWithUrl = await Promise.all(posts.map(async (post) => {
      const user = await User.findOne({ _id: post.userId });
      const file = await File.findById(post.imageId);
      const url = file ? file.url : '';
      return { ...post.toObject(), url, user: user ? user.toObject() : null };
    }));
    return res.status(200).json(postWithUrl);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getpostsadmin = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

/* GET A SINGLE POST */
export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = await User.findById(post.userId);
    const file = await File.findById(post.imageId);
    const userName = user ? user.userName : '';
    const picturePath = user ? user.picturePath : '';
    const url = file ? file.url : '';
    return res.status(200).json({ ...post.toObject(), userName, url, picturePath });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

/* GET USER'S ALL POSTS */
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId: userId, visibility: true });
    const postWithUrl = await Promise.all(posts.map(async (post) => {
      const user = await User.findById(post.userId);
      const file = await File.findById(post.imageId);
      const userName = user ? user.userName : '';
      const picturePath = user ? user.picturePath : '';
      const url = file ? file.url : '';
      return { ...post.toObject(), url, userName, picturePath };
    }));
    return res.status(200).json(postWithUrl);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

/* GET ALL POST FOR EXPLORE PAGE */
export const explore = async (req, res) => {
  try {
    const posts = await Post.find({ visibility: true });
    const postWithUrl = await Promise.all(posts.map(async (post) => {
      const user = await User.findById(post.userId);
      const file = await File.findById(post.imageId);
      const userName = user ? user.userName : '';
      const picturePath = user ? user.picturePath : '';
      const url = file ? file.url : '';
      return { ...post.toObject(), url, userName, picturePath };
    }));
    return res.status(200).json(postWithUrl);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

/* CHECK IF POST IS LIKED OR NOT */
export const isLiked = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const post = await Post.findById({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const liked = post.likes.includes(userId);
    return res.status(200).json({ isLiked: liked });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/* LIKE/UNLIKE POST */
export const toggleLike = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const post = await Post.findById({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    if (!user || !post) {
      return res.status(404).json({ error: "User or Post not found" });
    }
    const isSaved = user.saved.includes(postId);
    if (isSaved) {
      post.saved.pull(userId);
      user.saved.pull(postId);
    } else {
      post.saved.push(userId);
      user.saved.push(postId);
    }
    await user.save();
    await post.save();
    return res.status(200).json({ updatedPost: post, updatedUser: user });
  } catch (err) {
    console.error("Save post error:", err);
    return res.status(400).json({ error: err.message });
  }
};

/* Edit post */
export const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { fileId, caption } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { caption: caption, imageId: fileId },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error("Edit post error:", err);
    return res.status(400).json({ error: err.message });
  }
};

export const removePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { visibility: false },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    await post.save();
    const user = await User.findOneAndUpdate(
      { _id: post.userId },
      { $pull: { posts: post._id, saved: post._id } },
      { new: true }
    );
    if (user) {
      await user.save();
    }
    const posts = await Post.find({ visibility: true });
    return res.status(200).json({ updatedPosts: posts, updatedUser: user });
  } catch (err) {
    console.error("Remove post error:", err);
    return res.status(400).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const user = await User.findOneAndUpdate(
      { _id: post.userId },
      { $pull: { posts: post._id, saved: post._id } },
      { new: true }
    );

    // remove post from all users who saved it
    for (const userId of post.saved) {
      await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { saved: postId } },
        { new: true }
      );
    }

    if (user) {
      await user.save();
    }
    await Post.findOneAndDelete({ _id: postId });
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (err) {
    console.error("Delete post error:", err);
    return res.status(400).json({ error: err.message });
  }
};

const populateCommentsRecursively = async (comments, depth) => {
  if (depth <= 0) {
    return;
  }

  // Populate userId for each comment
  await Comment.populate(comments, { path: 'userId' });

  // Populate replies for each comment
  await Comment.populate(comments, { path: 'replies' });

  // Recursively populate replies and userId fields for each reply
  for (const comment of comments) {
    await populateCommentsRecursively(comment.replies, depth - 1);
  }
};

/* GET ALL COMMENTS OF A POST */
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const depth = 5;

    const comments = await Comment.find({ type: 'comment', postId }).exec();

    // Populate comments, replies, and userId fields recursively
    await populateCommentsRecursively(comments, depth);

    return res.status(200).json(comments);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* COMMENT */
export const comment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, comment, commentId } = req.body;

    let newComment = new Comment({
      type: "comment",
      userId,
      postId,
      comment,
      parentId: null,
      replies: [],
    });

    // If parentId is provided, add the comment as a reply
    if (commentId) {
      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      newComment = new Comment({
        type: "reply",
        userId,
        postId,
        comment,
        parentId: commentId,
        replies: [],
      });
      await newComment.save();
      parentComment.replies.push(newComment._id);
      await parentComment.save();
    } else {
      await newComment.save();
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id }
      });
    }
    const updatedPost = await Post.findById(postId);
    return res.status(201).json({ updatedPost, newComment });
  } catch (error) {
    console.error("Comment error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* LIKE/UNLIKE COMMENT */
export const toggleCommentLike = async (req, res) => {
  try {
    const { commentId, userId } = req.body;
    const commentObj = await Comment.findById(commentId);
    if (!commentObj) {
      return res.status(404).json({ error: "Comment not found" });
    }
    const isLiked = commentObj.likes.includes(userId);
    if (isLiked) {
      commentObj.likes.pull(userId);
    } else {
      commentObj.likes.push(userId);
    }
    await commentObj.save();
    return res.status(200).json(commentObj);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { commentId } = req.body;

    const commentObj = await Comment.findById(commentId);
    if (!commentObj) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // If it's a reply, remove it from parent comment's replies array
    if (commentObj.type === "reply") {
      const parentComment = await Comment.findById(commentObj.parentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      parentComment.replies = parentComment.replies.filter(replyId => replyId.toString() !== commentId);
      await parentComment.save();
    } else {
      // If it's a top-level comment, remove it from the post's comments array
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: commentId }
      });
    }

    // Delete the comment itself
    await Comment.findByIdAndDelete(commentId);
    const updatedPost = await Post.findById(postId);
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const commentObj = await Comment.findOne({ _id: commentId });
    if (!commentObj) {
      return res.status(404).json({ error: "Comment not found" });
    }
    return res.status(200).json(commentObj);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
