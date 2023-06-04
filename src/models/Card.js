const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database/connect');
const User = require('./User');

class Card extends Model {}

Card.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        cardNumbers: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[0-9]+$/,
            },
        },
        bankName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expireDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    { modelName: 'card', sequelize },
);
module.exports = Card;
