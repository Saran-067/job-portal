import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        // Retrieve token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // Verify token
        jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid or expired token",
                    success: false,
                });
            }

            // Attach user ID to the request object
            req.id = decode.userId;
            next(); // Proceed to the next middleware or route handler
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
        });
    }
};

export default isAuthenticated;
