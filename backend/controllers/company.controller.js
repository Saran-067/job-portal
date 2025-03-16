import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        if (!req.id) {
            return res.status(401).json({
                message: "Unauthorized: Please log in first.",
                success: false
            });
        }

        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({ message: "Company name is required.", success: false });
        }

        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({ message: "You can't register the same company.", success: false });
        }

        company = await Company.create({ name: companyName, userId: req.id });

        return res.status(201).json({ message: "Company registered successfully.", company, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


export const getCompany = async (req, res) => {
    try {
        const userId = req.session.user?._id; // Get user ID from session
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized. Please log in.",
                success: false
            });
        }

        const companies = await Company.find({ userId });
        if (!companies.length) {
            return res.status(404).json({
                message: "No companies found.",
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const userId = req.session.user?._id; // Get user ID from session
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized. Please log in.",
                success: false
            });
        }

        const { name, description, website, location } = req.body;
        const file = req.file;

        let logo;
        if (file) {
            // Upload image to Cloudinary
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = { name, description, website, location };
        if (logo) updateData.logo = logo;

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            success: true,
            company
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
