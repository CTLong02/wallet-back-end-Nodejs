const jwtUtils = require('../jwt/jwt');
const tetsRequireHasToken = async (req, method) => {
    try {
        if (req.method.toLowerCase() === method) {
            const authorization = req.headers.authorization;
            if (authorization) {
                const keyAuthorization = authorization.split(' ')[0];
                const acccessToken = authorization.split(' ')[1];
                if (keyAuthorization && acccessToken) {
                    const responseVerify = await jwtUtils.verifyAccessToken(acccessToken);
                    if (responseVerify.result === 'success') {
                        return {
                            result: 'success',
                            data: responseVerify.data,
                        };
                    } else {
                        return {
                            result: 'fail',
                            statusCode: 403,
                            reason: responseVerify.reason,
                        };
                    }
                } else {
                    return {
                        result: 'fail',
                        statusCode: 401,
                        reason: 'Không đủ tham số',
                    };
                }
            } else {
                return {
                    result: 'fail',
                    statusCode: 401,
                    reason: 'Không đủ tham số',
                };
            }
        } else {
            return {
                result: 'fail',
                statusCode: 400,
                reason: 'Không đủ tham số',
            };
        }
    } catch (error) {
        return {
            result: 'fail',
            statusCode: 400,
            reason: 'Không đủ tham số',
        };
    }
};

module.exports = tetsRequireHasToken;
