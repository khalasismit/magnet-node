import User from "../models/User.model.js";

export const requests = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const data = await Promise.all(user.followRequest.map(async (reqId) => {
            return User.findById(reqId);
        }));
        return res.status(200).json(data.filter(u => u !== null));
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const follow = async (req, res) => {
    try {
        const { userId, followId } = req.params;
        const user1 = userId; // mine
        const user2 = followId; // other

        const updatedUser = await User.findByIdAndUpdate(
            { _id: user1 },
            { $push: { sentRequest: user2 } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const user1userName = updatedUser.userName;

        const updatedUser2 = await User.findByIdAndUpdate(
            { _id: user2 },
            { $push: { followRequest: user1 } },
            { new: true }
        );
        if (!updatedUser2) {
            return res.status(404).json({ error: "Target user not found" });
        }
        const user2userName = updatedUser2.userName;
        
        console.log(`${user1userName} sent request to ${user2userName}`);
        return res.status(200).json(updatedUser);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const accept = async (req, res) => {
    try {
        const { userId, followId } = req.params;
        const user1 = userId; // other
        const user2 = followId; // mine

        const updatedUser = await User.findByIdAndUpdate(
            { _id: user2 },
            { $pull: { sentRequest: user1 }, $push: { following: user1 } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const user1userName = updatedUser.userName;
        
        const updatedUser2 = await User.findByIdAndUpdate(
            { _id: user1 },
            { $pull: { followRequest: user2 }, $push: { followers: user2 } },
            { new: true }
        );
        if (!updatedUser2) {
            return res.status(404).json({ error: "Follower user not found" });
        }
        const user2userName = updatedUser2.userName;
        
        console.log(`${user1userName} started following ${user2userName}`);
        return res.status(200).json(updatedUser2);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const reject = async (req, res) => {
    try {
        const { userId, followId } = req.params;
        const user1 = userId; // other
        const user2 = followId; // mine
        
        const updatedUser = await User.findByIdAndUpdate(
            { _id: user1 },
            { $pull: { followRequest: user2 } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "Target user not found" });
        }
        const user1userName = updatedUser.userName;

        const updatedUser2 = await User.findByIdAndUpdate(
            { _id: user2 },
            { $pull: { sentRequest: user1 } },
            { new: true }
        );
        if (!updatedUser2) {
            return res.status(404).json({ error: "User not found" });
        }
        const user2userName = updatedUser2.userName;
        
        console.log(`${user1userName} rejected request from ${user2userName}`);
        return res.status(200).json(updatedUser);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const cancel = async (req, res) => {
    try {
        const { userId, followId } = req.params;
        const user1 = userId;
        const user2 = followId;

        const updatedUser = await User.findByIdAndUpdate(
            { _id: user1 },
            { $pull: { sentRequest: user2 } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const user1userName = updatedUser.userName;

        const updatedUser2 = await User.findByIdAndUpdate(
            { _id: user2 },
            { $pull: { followRequest: user1 } },
            { new: true }
        );
        if (!updatedUser2) {
            return res.status(404).json({ error: "Target user not found" });
        }
        const user2userName = updatedUser2.userName;
        
        console.log(`${user1userName} cancelled request to ${user2userName}`);
        return res.status(200).json(updatedUser);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const unfollow = async (req, res) => {
    try {
        const { userId, followId } = req.params;
        const user1 = userId;
        const user2 = followId;

        const updatedUser = await User.findByIdAndUpdate(
            { _id: user1 },
            { $pull: { following: user2 } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const user1userName = updatedUser.userName;
        
        const updatedUser2 = await User.findByIdAndUpdate(
            { _id: user2 },
            { $pull: { followers: user1 } },
            { new: true }
        );
        if (!updatedUser2) {
            return res.status(404).json({ error: "Target user not found" });
        }
        const user2userName = updatedUser2.userName;
        
        console.log(`${user1userName} stopped following ${user2userName}`);
        return res.status(200).json(updatedUser);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};