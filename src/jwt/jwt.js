const jwt = require('jsonwebtoken');
const User = require('../models/User');
const createAccessToken = (data) => {
    return jwt.sign(data, process.env.JWT_KEY, { expiresIn: '1d' });
};
const verifyAccessToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ where: { phoneNumbers: decoded.phoneNumbers } });
        if (user.accessToken === token) {
            return {
                result: 'success',
                data: user.dataValues,
            };
        } else {
            return {
                result: 'fail',
                reason: 'Không có quyền truy cập',
            };
        }
    } catch (error) {
        console.log('err ', error);
        return {
            result: 'fail',
            reason: 'Hết hạn quyền truy cập',
        };
    }
};

module.exports = { createAccessToken, verifyAccessToken };
