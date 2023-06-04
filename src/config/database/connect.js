const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('wallet', 'long', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
});
sequelize
    .authenticate()
    .then(() => console.log('connect successfully'))
    .catch((err) => console.log('connect fail'));

module.exports = sequelize;
