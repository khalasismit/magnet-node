import User from "../models/User.model.js";
import Post from "../models/Post.model.js";
import File from "../models/File.model.js";
import Comment from "../models/Comment.model.js";

// Get User 
export const getUser = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Edit User
export const edit = async (req, res) => {
  try {
    const { firstName, lastName, userName, location, bio, picturePath, email } = req.body;
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: id },
      { firstName, lastName, userName, location, bio, picturePath, email },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/* GET USER'S SAVED POST */
export const getUserSavedPost = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const savedPosts = user.saved || [];

    // Retrieve details for each saved post
    const postWithUrl = await Promise.all(savedPosts.map(async (postId) => {
      const post = await Post.findOne({ _id: postId, visibility: true });
      if (!post) return null;
      
      const author = await User.findById(post.userId);
      const file = await File.findById(post.imageId);
      const userName = author ? author.userName : '';
      const picturePath = author ? author.picturePath : '';
      const url = file ? file.url : '';
      
      return { ...post.toObject(), url, userName, picturePath };
    }));
    
    const filteredPosts = postWithUrl.filter(post => post !== null);
    return res.status(200).json(filteredPosts);
  } catch (err) {
    console.error("Get saved posts error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const followers = await Promise.all(user.followers.map(async (followerId) => {
      return User.findById(followerId);
    }));
    return res.status(200).json(followers.filter(f => f !== null));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const followings = await Promise.all(user.following.map(async (followingId) => {
      return User.findById(followingId);
    }));
    return res.status(200).json(followings.filter(f => f !== null));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const knownUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("following followers");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const uniqueUsers = [...new Set([...user.followers, ...user.following])];
    const Users = await Promise.all(uniqueUsers.map(userId => User.findById(userId)));
    return res.status(200).json(Users.filter(u => u !== null));
  } catch (error) {
    console.error("Get known users error:", error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Get All Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Escapes special regex characters in a string.
 * @param {string} string - The input string to escape.
 * @returns {string} The escaped string.
 */
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Search User
export const searchUser = async (req, res) => {
  try {
    const { search: searchQuery, id } = req.params;
    const escapedSearch = escapeRegExp(searchQuery);
    const regexPattern = `^${escapedSearch}`;
    const users = await User.find({ 
      _id: { $ne: id }, 
      $or: [
        { firstName: { $regex: regexPattern, $options: 'i' } }, 
        { lastName: { $regex: regexPattern, $options: 'i' } }, 
        { userName: { $regex: regexPattern, $options: 'i' } }
      ] 
    }).sort({ firstName: 1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const search = async (req, res) => {
  try {
    const { search: searchQuery } = req.params;
    const escapedSearch = escapeRegExp(searchQuery);
    const regexPattern = `^${escapedSearch}`;
    const users = await User.find({ 
      $or: [
        { firstName: { $regex: regexPattern, $options: 'i' } }, 
        { lastName: { $regex: regexPattern, $options: 'i' } }, 
        { userName: { $regex: regexPattern, $options: 'i' } }
      ] 
    }).sort({ firstName: 1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const suggestions = async (req, res) => {
  try {
    const { userId } = req.params;
    const allUsers = await User.find({});
    const currentUser = await User.findOne({ _id: userId });
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }
    const usersFollowingIds = currentUser.following;
    const usersWithoutCurrentUser = allUsers.filter(user => user._id.toString() !== userId);
    const suggestionsList = usersWithoutCurrentUser.filter(user => !usersFollowingIds.includes(user._id.toString()));
    
    // Shuffle
    suggestionsList.sort(() => Math.random() - 0.8);
    
    // Select first 6
    const randomSuggestions = suggestionsList.slice(0, 6);
    return res.status(200).json(randomSuggestions);
  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const getUserToReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const commentObj = await Comment.findById(commentId).populate("userId");
    if (!commentObj) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const user = commentObj.userId;
    return res.status(200).json(user);
  } catch (err) {
    console.error('Error getting user to reply:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};
