const User = require('../models/user');

exports.mockUserAuth = async (req, res, next) => {
    try {
        const mockUserId = req.headers['x-user-id'];
        if (!mockUserId) {
            return res.status(401).json({ error: 'x-user-id header is missing' });
        }
        let user = await User.findOne({ mockUserId: mockUserId });
        if (!user) {
            user = await User.create({ mockUserId: mockUserId });
        }
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};