import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Admin from "../models/Admin.model.js";
import { sendEmail } from "../services/email.service.js";
import { getResetPasswordTemplate } from "../templates/email/resetPassword.template.js";

// user
export const continueWithGoogle = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            userName,
            dob,
            bio,
            location,
            picturePath,
            email,
            status,
            followers,
            following,
            followRequest,
            sentRequest,
            posts,
            savedPosts,
        } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            const newUser = new User({
                firstName,
                lastName,
                userName,
                dob,
                bio,
                location,
                picturePath,
                email,
                status,
                followers,
                following,
                followRequest,
                sentRequest,
                posts,
                savedPosts,
            });
            await newUser.save();
            const createdUser = await User.findOne({ email: newUser.email });
            const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET);
            return res.status(200).json({ user: createdUser, token });
        } else {
            console.log("Continue with google email already exists");
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            return res.status(200).json({ user, token });
        }
    } catch (err) {
        console.error("Google authentication error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// admin
export const continueWithGoogleAdmin = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            userName,
            dob,
            bio,
            location,
            picturePath,
            email,
            status,
            followers,
            following,
            followRequest,
            sentRequest,
            posts,
            savedPosts,
        } = req.body;

        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            const newAdmin = new Admin({
                firstName,
                lastName,
                userName,
                dob,
                bio,
                location,
                picturePath,
                email,
                status,
                followers,
                following,
                followRequest,
                sentRequest,
                posts,
                savedPosts,
            });
            await newAdmin.save();
            const createdAdmin = await Admin.findOne({ email: newAdmin.email });
            const token = jwt.sign({ id: createdAdmin._id }, process.env.JWT_SECRET);
            return res.status(200).json({ admin: createdAdmin, token });
        } else {
            console.log("Continue with google admin email already exists");
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
            return res.status(200).json({ admin, token });
        }
    } catch (err) {
        console.error("Google admin authentication error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/* REGISTER USER */
export const signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            userName,
            dob,
            bio,
            location,
            picturePath,
            email,
            password,
            status,
            followers,
            following,
            followRequest,
            sentRequest,
            posts,
            savedPosts,
        } = req.body;

        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        const newUser = new User({
            firstName,
            lastName,
            userName,
            dob,
            bio,
            location,
            picturePath,
            email,
            password: hashedPassword,
            status,
            followers,
            following,
            followRequest,
            sentRequest,
            posts,
            savedPosts,
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// admin signup
export const signupAdmin = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            userName,
            dob,
            bio,
            location,
            picturePath,
            email,
            password,
            status,
            followers,
            following,
            followRequest,
            sentRequest,
            posts,
            savedPosts,
        } = req.body;

        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        const newAdmin = new Admin({
            firstName,
            lastName,
            userName,
            dob,
            bio,
            location,
            picturePath,
            email,
            password: hashedPassword,
            status,
            followers,
            following,
            followRequest,
            sentRequest,
            posts,
            savedPosts,
        });
        await newAdmin.save();
        res.status(201).json(newAdmin);
    } catch (err) {
        console.error("Admin signup error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log("Invalid User");
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid Password");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const userObj = user.toObject();
        delete userObj.password;
        return res.status(200).json({ user: userObj, token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// admin login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            console.log("Invalid admin");
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log("Invalid Password");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
        const adminObj = admin.toObject();
        delete adminObj.password;
        console.log("Admin login success", adminObj, token);
        return res.status(200).json({ admin: adminObj, token });
    } catch (err) {
        console.error("Admin login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json("user doesn't exist");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const html = getResetPasswordTemplate(user.userName, email, token);

        try {
            await sendEmail({
                to: email,
                subject: 'RESET PASSWORD LINK',
                html
            });
            console.log('Email sent successfully');
            return res.status(200).json("Success");
        } catch (error) {
            console.error('Email sending failed:', error);
            return res.status(400).json("email not found");
        }
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json("server Err");
    }
};

export const resetpassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
        res.status(200).json("Password updated successfully");
    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json("server Err");
    }
};