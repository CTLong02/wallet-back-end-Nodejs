const sequelize = require('../config/database/connect');
const { DataTypes, Model } = require('sequelize');

class Transaction extends Model {}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        transactionType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        money: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        modelName: 'transaction',
        sequelize,
    },
);

module.exports = Transaction;
