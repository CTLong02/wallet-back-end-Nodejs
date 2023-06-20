const { Model, DataTypes } = require('sequelize');
const Card = require('./Card');
const Transaction = require('./Transaction');
const sequelize = require('../config/database/connect');

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        accessToken: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: null,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumbers: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^((\+|00)84|0)(3[2-9]|5[689]|7[0|6-9]|8[1-9]|9[0-9])(\d{7})$/,
            },
        },
        identifyPerson: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        numberofAccount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        remainMoney: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
    },
    { modelName: 'User', sequelize },
);
User.hasMany(Card, { foreignKey: { name: 'userId' } });
Card.belongsTo(User, { foreignKey: { name: 'userId' } });
User.hasMany(Transaction, { foreignKey: { name: 'senderId' } });
Transaction.belongsTo(User, { foreignKey: { name: 'senderId' } });
User.hasMany(Transaction, { foreignKey: { name: 'receiverId' } });
Transaction.belongsTo(User, { foreignKey: { name: 'receiverId' } });
module.exports = User;
