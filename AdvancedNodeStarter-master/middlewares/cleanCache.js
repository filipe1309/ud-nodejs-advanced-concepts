const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
    await next(); // this will make sure that the route handler is executed first and then the middleware
    clearHash(req.user.id);
}
