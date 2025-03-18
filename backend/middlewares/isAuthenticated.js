const isAuthenticated = (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }
        req.id = req.session.userId;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export default isAuthenticated;
