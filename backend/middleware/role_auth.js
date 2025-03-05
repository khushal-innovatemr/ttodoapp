const jwt = require('jsonwebtoken');

const role_middleware = (required_roles) => {
    return (req, res, next) => {
        try {
            const role_auth = req.header("Authorization").replace("Bearer ", "");
            if (!role_auth) return res.status(401).json({ error: "Access Denied" });

            const verified = jwt.verify(role_auth, process.env.JWT_SECRET);
            req.user = verified;

            req.user.IsAdmin = (req.user.role === 'admin');

            if (!required_roles.includes(req.user.role)) {
                return res.status(203).json({ error: "Forbidden: You don't have permission, Ps: Request Admin" });
            }
            next();
        } catch (err) {
            console.log("unauthorized", err);
            return res.status(401).json({ error: "Invalid Token" });
        }
    }
}

module.exports = role_middleware;