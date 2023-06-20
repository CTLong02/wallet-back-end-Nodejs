const User = require('../models/User');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const CardController = require('./CardController');
class UserController {
    // [Get] Lấy thông tin của người dùng
    async getUserWithPhoneNumbers(phoneNumbers) {
        const user = await User.findOne({
            attributes: [
                'id',
                'fullname',
                'gender',
                'phoneNumbers',
                'identifyPerson',
                'numberofAccount',
                'remainMoney',
                'avatar',
                'accessToken',
            ],
            where: { phoneNumbers },
        });
        const userData = user.dataValues;
        const resFindingCards = await CardController.findCardByUserId(userData.id);
        if (resFindingCards.result === 'success') {
            return {
                ...userData,
                cards: [...resFindingCards.data],
            };
        } else {
            return {
                ...userData,
                cards: [],
            };
        }

        // return user.dataValues;
    }

    async getUserById(id) {
        const user = await User.findOne({
            attributes: [
                'id',
                'fullname',
                'gender',
                'phoneNumbers',
                'identifyPerson',
                'numberofAccount',
                'remainMoney',
                'avatar',
                'accessToken',
            ],
            where: { id },
        });
        const userData = user.dataValues;
        const resFindingCards = await CardController.findCardByUserId(userData.id);
        if (resFindingCards.result === 'success') {
            return {
                ...userData,
                cards: [...resFindingCards.data],
            };
        } else {
            return {
                ...userData,
                cards: [],
            };
        }

        // return user.dataValues;
    }

    async getUser(accountData) {
        try {
            const { phoneNumbers, password } = accountData;
            const user = await User.findOne({
                attributes: [
                    'fullname',
                    'gender',
                    'phoneNumbers',
                    'identifyPerson',
                    'numberofAccount',
                    'remainMoney',
                    'avatar',
                ],
                where: { phoneNumbers: phoneNumbers, password: password },
            });
            if (user) {
                return {
                    result: 'success',
                    statusCode: 200,
                    data: user.dataValues,
                };
            } else {
                const userWithNumberofAccount = await User.findOne({ where: { phoneNumbers: phoneNumbers } });
                if (userWithNumberofAccount) {
                    return {
                        result: 'fail',
                        statusCode: 400,
                        reason: 'Mật khẩu không chính xác',
                    };
                } else {
                    return {
                        result: 'fail',
                        statusCode: 404,
                        reason: 'Tài khoản không tồn tại',
                    };
                }
            }
        } catch (error) {
            return {
                result: 'fail',
                statusCode: 400,
                reason: 'Không đủ tham số',
            };
        }
    }

    //[POST] tạo tài khoản mới
    async createUser(newAccountData) {
        try {
            await User.sync();
            const { fullname, gender, password, phoneNumbers, identifyPerson } = newAccountData;
            let numberofAccount = `9704229281${Math.floor(Math.random() * 1000000).toString()}`;
            while (true) {
                const userTest = await User.findOne({ where: { numberofAccount: numberofAccount } });
                if (userTest) {
                    numberofAccount = `9704229281${Math.floor(Math.random() * 1000000).toString()}`;
                } else {
                    break;
                }
            }
            const findUserWithphoneNumbers = await User.findOne({ where: { phoneNumbers: phoneNumbers } });
            if (findUserWithphoneNumbers) {
                return {
                    result: 'fail',
                    statusCode: 400,
                    reason: 'Tài khoản với số điện thoại này đã tồn tại',
                };
            } else {
                const user = await User.create({
                    fullname,
                    gender,
                    password,
                    phoneNumbers,
                    identifyPerson,
                    numberofAccount,
                });
                const userData = user.dataValues;
                return {
                    result: 'success',
                    statusCode: 201,
                    data: {
                        fullname: userData.fullname,
                        gender: userData.gender,
                        phoneNumbers: userData.phoneNumbers,
                        identifyPerson: userData.identifyPerson,
                        numberofAccount: userData.numberofAccount,
                        avatar: userData.avatar,
                    },
                };
            }
        } catch (error) {
            return {
                result: 'fail',
                statusCode: 400,
                reason: 'Không đủ tham số',
            };
        }
    }

    //cập nhập accessToken
    async updateAccessToken(newToken, phoneNumbers) {
        try {
            await User.update(
                {
                    accessToken: newToken,
                },
                { where: { phoneNumbers: phoneNumbers } },
            );
            return {
                result: 'success',
            };
        } catch (error) {
            return {
                result: 'fail',
                statusCode: 400,
                reason: 'Không đủ tham số',
            };
        }
    }

    // [POST] cập nhập avatar cho user
    async upload(req, phoneNumbers, res) {
        try {
            const form = new formidable.IncomingForm({
                uploadDir: './src/resources/avatars',
                keepExtensions: true,
                maxFieldsSize: 10 * 1024 * 1024,
            });

            form.parse(req, async (err, fields, file) => {
                const update = async (nameAvatar) => {
                    await User.update(
                        {
                            avatar: `/resources/avatar/${nameAvatar}`,
                        },
                        {
                            where: { phoneNumbers },
                        },
                    );
                    const newUser = await User.findOne({ where: { phoneNumbers } });
                    return newUser.dataValues;
                };
                const remove = async () => {
                    const findUser = await User.findOne({ where: { phoneNumbers } });
                    if (findUser.avatar) {
                        const imagePath = path.join(__dirname, `..${findUser.avatar}`);
                        fs.unlinkSync(imagePath);
                    }
                };
                await remove();
                const newUser = await update(file.avatar.newFilename);
                res.status(200).json({ result: 'success', data: newUser });
            });
        } catch (error) {
            res.status(400).json({ result: 'fail', reason: 'Không đủ tham số' });
        }
    }

    async getAvatar(req, res, next) {
        try {
            if (req.params.idAvatar) {
                const imagePath = path.join(__dirname, `../resources/avatars/${req.params.idAvatar}`);
                const imageData = fs.readFileSync(imagePath);
                res.end(imageData);
            } else {
                res.status(404).json({ result: 'fail', reason: 'Ảnh không tồn tại' });
            }
        } catch (error) {
            res.status(400).json({ result: 'fail', reason: 'Không đủ tham số' });
        }
    }

    async updateInformation(form) {
        try {
            const { id, gender, password, remainMoney } = form;
            console.log('remainMoney', remainMoney);
            await User.update(
                {
                    gender,
                    password,
                    remainMoney,
                },
                { where: { id } },
            );
            return {
                result: 'success',
            };
        } catch (error) {
            return {
                result: 'fail',
            };
        }
    }
}

module.exports = new UserController();
