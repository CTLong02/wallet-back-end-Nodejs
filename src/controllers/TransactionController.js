const Transaction = require('../models/Transaction');
class TransactionController {
    async getTransactionsBySenderId(senderId) {
        try {
            const transactions = await Transaction.findAll({
                where: { senderId },
                attributes: ['id', 'message', 'time', 'transactionType', 'money', 'receiverId'],
            });
            return {
                result: 'success',
                data: [
                    ...transactions.map((transaction) => {
                        return { ...transaction.dataValues, time: transaction.dataValues.time.toJSON() };
                    }),
                ],
            };
        } catch (error) {
            return {
                result: 'fail',
            };
        }
    }

    async getTransactionsByReceiverId(receiverId) {
        try {
            const transactions = await Transaction.findAll({
                where: { receiverId },
                attributes: ['id', 'message', 'time', 'transactionType', 'money', 'senderId'],
            });
            return {
                result: 'success',
                data: [
                    ...transactions.map((transaction) => {
                        return { ...transaction.dataValues, time: transaction.dataValues.time.toJSON() };
                    }),
                ],
            };
        } catch (error) {
            return {
                result: 'fail',
            };
        }
    }

    async createTransaction(data) {
        // console.log('data', data);
        try {
            await Transaction.sync();
            const transaction = await Transaction.create(data);
            // console.log('transaction', transaction);
            return {
                result: 'success',
                data: transaction.dataValues,
            };
        } catch (error) {
            // console.log('error', error);
            return {
                result: 'fail',
            };
        }
    }
}

module.exports = new TransactionController();
