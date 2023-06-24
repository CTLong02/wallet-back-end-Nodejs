const UserController = require('./UserController');
const test = require('../utils/testRequireHasToken');
const TransactionController = require('./TransactionController');
class ServiceController {
    async getNameByNumberPhone(req, res, next) {
        // console.log('phoneeeeeeeee----------', req.body);
        // console.log(req);
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
                const { senderId, receiverId, money, message, time, transactionType } = req.body;
                const formNew = {
                    ...req.body,
                    time: new Date(time),
                };
                // console.log('formNew-----', formNew);
                const person1 = await UserController.getUserById(senderId);
                const person2 = await UserController.getUserById(receiverId);
                if (senderId !== receiverId) {
                    const resByCreateTransaction = await TransactionController.createTransaction(formNew);
                    // console.log('resByCreateTransaction', resByCreateTransaction);
                    const resUpdatePerson1 = await UserController.updateInformation({
                        id: senderId,
                        remainMoney: person1.remainMoney - Number.parseInt(money),
                    });
                    const resUpdatePerson2 = await UserController.updateInformation({
                        id: receiverId,
                        remainMoney: person2.remainMoney + Number.parseInt(money),
                    });
                    if (
                        resUpdatePerson1.result === 'success' &&
                        resUpdatePerson2.result === 'success' &&
                        resByCreateTransaction.result === 'success'
                    ) {
                        const newPerson1 = await UserController.getUserById(senderId);
                        res.status(200).json({ result: 'success', data: { ...newPerson1 } });
                    } else {
                        res.status(400).json({
                            result: 'fail',
                            reason: 'Không đủ tham số',
                        });
                    }
                } else {
                    res.status(400).json({ result: 'fail', reason: 'Bạn không thể chuyển tiền cho chính mình' });
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

    async getTransactions(req, res, next) {
        try {
            const resByTest = await test(req, 'post');
            if (resByTest.result === 'success') {
                const data = [];
                const userId = resByTest.data.id;
                if (req.body.typeOfTransaction === 'all') {
                    const resByFindTransactions = await TransactionController.getTransactionsById(
                        userId,
                        req.body.offset,
                    );
                    for (let i = 0; i < resByFindTransactions.data.length; i++) {
                        const transaction = resByFindTransactions.data[i];
                        const user = await UserController.getUserById(
                            transaction['senderId'] === userId ? transaction['receiverId'] : transaction['senderId'],
                        );
                        if (transaction['senderId'] === userId) {
                            data[i] = {
                                id: transaction.id,
                                message: transaction.message,
                                time: transaction.time,
                                transactionType: transaction.transactionType,
                                money: transaction.money,
                                receiver: {
                                    fullname: user.fullname,
                                },
                            };
                        } else {
                            data[i] = {
                                message: transaction.message,
                                time: transaction.time,
                                transactionType: transaction.transactionType,
                                money: transaction.money,
                                sender: {
                                    fullname: user.fullname,
                                },
                            };
                        }
                    }
                } else if (req.body.typeOfTransaction === 'sender') {
                    const resByFindTransactions = await TransactionController.getTransactionsBySenderId(
                        userId,
                        req.body.offset,
                    );
                    for (let i = 0; i < resByFindTransactions.data.length; i++) {
                        const transaction = resByFindTransactions.data[i];
                        const user = await UserController.getUserById(transaction['receiverId']);
                        data[i] = {
                            id: transaction.id,
                            message: transaction.message,
                            time: transaction.time,
                            transactionType: transaction.transactionType,
                            money: transaction.money,
                            receiver: {
                                fullname: user.fullname,
                            },
                        };
                    }
                } else {
                    const resByFindTransactions = await TransactionController.getTransactionsByReceiverId(
                        userId,
                        req.body.offset,
                    );
                    for (let i = 0; i < resByFindTransactions.data.length; i++) {
                        const transaction = resByFindTransactions.data[i];
                        const user = await UserController.getUserById(transaction['senderId']);
                        data[i] = {
                            id: transaction.id,
                            message: transaction.message,
                            time: transaction.time,
                            transactionType: transaction.transactionType,
                            money: transaction.money,
                            sender: {
                                fullname: user.fullname,
                            },
                        };
                    }
                }
                res.status(201).json({ result: 'success', data: [...data] });
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
