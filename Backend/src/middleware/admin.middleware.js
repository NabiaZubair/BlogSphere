// use AFTER authMiddleware, because it needs req.user
export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "admin only" });
    }
    next();
};