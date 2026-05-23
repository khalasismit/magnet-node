import jwt from "jsonwebtoken";

/**
 * Express middleware to verify Authorization JWT token.
 */
export const verifyToken = (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            return res.status(403).json({ error: "Access Denied: Token missing" });
        }
        
        if (token.startsWith("Bearer ")) {
            token = token.slice(7).trimStart();
        }
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;  
        console.log("Token verified successfully");
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
