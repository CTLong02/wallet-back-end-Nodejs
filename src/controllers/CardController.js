const Card = require('../models/Card');
class CardController {
    async createCard(newCard) {
        try {
            await Card.sync();
            const { cardNumbers, userId, bankName, expireDate } = newCard;
            const expire = new Date(expireDate);
            console.log('run 10');
            const card = await Card.create({
                cardNumbers,
                userId,
                bankName,
                expireDate: expire,
            });
            return {
                result: 'success',
                statusCode: 201,
                // data: {
                //     cardNumbers: card.dataValues.cardNumbers,
                //     userId: card.dataValues.userId,
                //     bankName: card.dataValues.bankName,
                //     expireDate: card.dataValues.expireDate.toJSON(),
                // },
            };
        } catch (error) {
            return {
                result: 'fail',
            };
        }
    }

    async findCardByUserId(userId) {
        try {
            const cards = await Card.findAll(
                { where: { userId: userId } },
                { attributes: ['id', 'cardNumbers', 'bankName', 'expireDate'] },
            );
            const newCards = cards.map((card, index) => {
                return { ...card.dataValues, expireDate: card.dataValues.expireDate.toJSON() };
            });
            return {
                result: 'success',
                data: [...newCards],
            };
        } catch (error) {
            return {
                result: 'fail',
            };
        }
    }

    async deleteCard(cardData) {
        try {
            const { cardNumbers, userId, bankName } = cardData;
            const card = await Card.destroy({ where: { cardNumbers, userId, bankName } });
            if (card) {
                return {
                    result: 'success',
                    statusCode: 200,
                };
            } else {
                return {
                    result: 'fail',
                    statusCode: 404,
                    reason: 'Không tìm thấy thẻ',
                };
            }
        } catch (error) {
            return {
                result: 'fail',
                statusCode: 501,
                reason: 'Không đủ tham số',
            };
        }
    }
}

module.exports = new CardController();
