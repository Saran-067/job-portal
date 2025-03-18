import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// ✅ User Registration
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePhotoUrl = null;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url;
        }

        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                profile: newUser.profile
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// ✅ User Login
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required.",
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

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with the selected role.",
                success: false
            });
        }

        // ✅ Store userId in session & force session save
        req.session.userId = user._id;
        req.session.role = user.role;
        req.session.save((err) => {
            if (err) console.error("Session save error:", err);
        });

        return res.status(200).json({
            message: `Welcome back, ${user.fullname}`,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            },
            success: true
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// ✅ User Logout
export const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Logout Error:", err);
                return res.status(500).json({ message: "Logout failed.", success: false });
            }
            res.clearCookie("connect.sid"); // Remove session cookie
            return res.status(200).json({
                message: "Logged out successfully.",
                success: true
            });
        });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// ✅ Update User Profile
export const updateProfile = async (req, res) => {
    try {
        console.log("Session Data:", req.session); // Debugging session

        if (!req.session || !req.session.userId) {
            return res.status(401).json({
                message: "User not authenticated.",
                success: false
            });
        }

        const { fullname, email, phoneNumber, bio, skills } = req.body;
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
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Updating user fields
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

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            },
            success: true
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
