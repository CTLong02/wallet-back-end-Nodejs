const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');
class TransactionController {
    async getTransactionsById(id, offset) {
        try {
            console.log('id', id);
            console.log('offset', offset);
            const transactions = await Transaction.findAll({
                where: { [Op.or]: [{ senderId: id }, { receiverId: id }] },
                offset: Number.parseInt(offset),
                limit: 20,
                attributes: ['id', 'message', 'time', 'transactionType', 'money', 'senderId', 'receiverId'],
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

    async getTransactionsBySenderId(senderId, offset) {
        try {
            const transactions = await Transaction.findAll({
                limit: 20,
                offset: Number.parseInt(offset),
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

    async getTransactionsByReceiverId(receiverId, offset) {
        try {
            const transactions = await Transaction.findAll({
                offset: Number.parseInt(offset),
                limit: 20,
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
