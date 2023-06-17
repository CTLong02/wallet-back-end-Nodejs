const UserController = require('./UserController');
const test = require('../utils/testRequireHasToken');
class ServiceController {
    async getNameByNumberPhone(req, res, next) {
        const { phoneNumbers } = req.body;
        try {
            const resByTest = await test(req, 'post');
            if (resByTest.result === 'success') {
                const resByFindUser = await UserController.getUserWithPhoneNumbers(phoneNumbers);
                if (resByFindUser) {
                    res.status(200).json({
                        result: 'success',
                        data: {
                            fullname: resByFindUser.fullname,
                            id: resByFindUser.id,
                        },
                    });
                } else {
                    res.status(404).json({ result: 'fail', reason: 'Số điện thoại không tồn tại trong ví' });
                }
            } else {
                res.status(resByTest.statusCode).json({ result: resByTest.result, reason: resByTest.reason });
            }
        } catch (error) {
            res.status(400).json({
                result: 'fail',
                reason: 'Không đủ tham số',
            });
        }
    }

    async transferMoney(req, res, next) {
        try {
            const resByTest = await test(req, 'post');
            if (resByTest.result === 'success') {
                const { personId1, personId2, money } = req.body;
                const person1 = await UserController.getUserById(personId1);
                const person2 = await UserController.getUserById(personId2);
                const resUpdatePerson1 = await UserController.updateInformation({
                    id: personId1,
                    remainMoney: person1.remainMoney - money,
                });
                const resUpdatePerson2 = await UserController.updateInformation({
                    id: personId2,
                    remainMoney: person2.remainMoney + money,
                });
                if (resUpdatePerson1.result === 'success' && resUpdatePerson2.result === 'success') {
                    const newPerson1 = await UserController.getUserById(personId1);
                    res.status(200).json({ result: 'success', data: { ...newPerson1 } });
                } else {
                    res.status(400).json({
                        result: 'fail',
                        reason: 'Không đủ tham số',
                    });
                }
            } else {
                res.status(resByTest.statusCode).json({ result: resByTest.result, reason: resByTest.reason });
            }
        } catch (error) {
            res.status(400).json({
                result: 'fail',
                reason: 'Không đủ tham số',
            });
        }
    }
}

module.exports = new ServiceController();
