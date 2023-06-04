const UserController = require('./UserController');
const CardController = require('./CardController');
const test = require('../utils/testRequireHasToken');
class AccountController {
    async uploadAvatar(req, res, next) {
        try {
            const resWithTest = await test(req, 'put');
            if (resWithTest.result === 'success') {
                UserController.upload(req, resWithTest.data.phoneNumbers, res);
            } else {
                res.status(resWithTest.statusCode).json({ result: resWithTest.result, reason: resWithTest.reason });
            }
        } catch (error) {
            res.status(400).json({ result: 'fail', reason: 'Không đủ tham số' });
        }
    }

    async createCard(req, res, next) {
        try {
            const resWithTest = await test(req, 'post');
            console.log('resWithTest', resWithTest);
            if (resWithTest.result === 'success') {
                const resWithcreateCard = await CardController.createCard(req.body);
                if (resWithcreateCard.result === 'success') {
                    console.log('resWithTest.data.id', resWithTest.data.id);
                    const cards = await CardController.findCardByUserId(resWithTest.data.id);
                    res.status(201).json({ result: 'success', data: [...cards.data] });
                } else {
                    res.status(400).json({ result: 'fail', reason: 'Không đủ tham số' });
                }
            } else {
                res.status(resWithTest.statusCode).json({ result: resWithTest.result, reason: resWithTest.reason });
            }
        } catch (error) {
            res.status(400).json({ result: 'fail', reason: 'Không đủ tham số' });
        }
    }
}

module.exports = new AccountController();
