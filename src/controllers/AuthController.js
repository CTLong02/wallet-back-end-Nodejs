const User = require('../models/User');
const jwtUtils = require('../jwt/jwt');
const UserController = require('./UserController');

class AuthController {
    async signIn(req, res, next) {
        if (req.method.toLowerCase() === 'post') {
            const response = await UserController.getUser(req.body);
            if (response.result === 'success') {
                const accessToken = jwtUtils.createAccessToken(response.data);
                const reponseUpdateAccessToken = await UserController.updateAccessToken(
                    accessToken,
                    response.data.phoneNumbers,
                );
                if (reponseUpdateAccessToken.result === 'success') {
                    const userData = await UserController.getUserWithPhoneNumbers(response.data.phoneNumbers);
                    res.status(response.statusCode).json({
                        result: response.result,
                        data: {
                            ...userData,
                        },
                    });
                } else {
                    res.status(reponseUpdateAccessToken.statusCode).json({
                        result: reponseUpdateAccessToken.result,
                        reason: reponseUpdateAccessToken.reason,
                    });
                }
            } else {
                res.status(response.statusCode).json({ result: response.result, reason: response.reason });
            }
        } else {
            res.status(400).json({ result: 'fail', reason: 'Không đủ tham số' });
        }
    }

    async signOut(req, res, next) {
        if (req.method.toLowerCase() === 'post') {
            const authorization = req.headers.authorization;
            if (authorization) {
                const keyAuthorization = authorization.split(' ')[0];
                const acccessToken = authorization.split(' ')[1];
                if (keyAuthorization === 'Bearer' && acccessToken) {
                    const responseVerify = await jwtUtils.verifyAccessToken(acccessToken);
                    if (responseVerify.result === 'success') {
                        const resWithUpdateAccessToken = await UserController.updateAccessToken(
                            null,
                            responseVerify.data.phoneNumbers,
                        );
                        if (resWithUpdateAccessToken.result === 'success') {
                            res.status(200).json({ result: responseVerify.result });
                        } else {
                            res.status(resWithUpdateAccessToken.statusCode).json({
                                result: resWithUpdateAccessToken.result,
                                reason: resWithUpdateAccessToken.reason,
                            });
                        }
                    } else {
                        res.status(403).json({
                            result: responseVerify.result,
                            reason: responseVerify.reason,
                        });
                    }
                } else {
                    res.status(401).json({ result: 'fail', reason: 'Không đủ tham số' });
                }
            } else {
                res.status(401).json({ result: 'fail', reason: 'Không đủ tham số' });
            }
        } else {
            res.status(400).json({ result: 'fail', reason: 'Không đủ tham số' });
        }
    }

    async signUp(req, res, next) {
        if (req.method.toLowerCase() === 'post') {
            const response = await UserController.createUser(req.body);
            if (response.result === 'success') {
                const accessToken = jwtUtils.createAccessToken(response.data);
                const reponseUpdateAccessToken = await UserController.updateAccessToken(
                    accessToken,
                    response.data.phoneNumbers,
                );
                if (reponseUpdateAccessToken.result === 'success') {
                    res.status(response.statusCode).json({
                        result: response.result,
                        data: {
                            ...response.data,
                            accessToken,
                        },
                    });
                } else {
                    res.status(reponseUpdateAccessToken.statusCode).json({
                        result: reponseUpdateAccessToken.result,
                        reason: reponseUpdateAccessToken.reason,
                    });
                }
            } else {
                res.status(response.statusCode).json({ result: response.result, reason: response.reason });
            }
        } else {
            res.status(400).json({ result: 'fail', reason: 'Không đủ tham số' });
        }
    }
}

module.exports = new AuthController();
