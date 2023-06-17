const AuthRouter = require('./AuthRouter');
const AccountRouter = require('./AccountRouter');
const UserController = require('./UserRouter');
const ServiceRouter = require('./ServiceRouter');

function route(app) {
    app.use('/resources', UserController);
    app.use('/api/v1/auth', AuthRouter);
    app.use('/api/v1/account', AccountRouter);
    app.use('/api/v1/service', ServiceRouter);
}
module.exports = route;
