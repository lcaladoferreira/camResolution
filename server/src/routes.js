const httpProxy = require('express-http-proxy');
const path = require('../environment');


exports.init = (app) => {
    
    const userServiceProxy = httpProxy(path.USER_SERVICE);

    app.get('/users', (req, res, next) => {
        userServiceProxy(req, res, next);
    });
}

