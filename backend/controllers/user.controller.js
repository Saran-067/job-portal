import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check if the role matches
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with the current role.",
                success: false
            });
        }

        // Store user ID in session
        req.session.userId = user._id;
        req.session.role = user.role;

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: `Welcome back, ${user.fullname}`,
            user,
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Logout failed.", success: false });
            }
            res.clearCookie("connect.sid"); // Remove session cookie
            return res.status(200).json({
                message: "Logged out successfully.",
                success: true
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        if (!req.session.userId) {
            return res.status(401).json({
                message: "User not authenticated.",
                success: false
            });
        }

        const file = req.file;
        let cloudResponse;

        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        let skillsArray = skills ? skills.split(",") : [];

        const userId = req.session.userId;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Updating data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        // Upload resume if file is provided
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
