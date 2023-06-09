const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database/connect');

class Card extends Model {}

Card.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
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
