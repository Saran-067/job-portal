const isAuthenticated = (req, res, next) => {
    try {
        // Check if session exists and contains user data
        if (!req.session || !req.session.userId) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // Attach user ID from session to request object
        req.id = req.session.userId;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
        });
    }
};

export default isAuthenticated;
