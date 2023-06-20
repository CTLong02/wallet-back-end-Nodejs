const Transaction = require('../models/Transaction');
class TransactionController {
    async getTransactionsById(id) {}

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
