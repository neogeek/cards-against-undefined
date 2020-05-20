const http = require('http-single-serve');

const websocket = require('./websocket');

websocket({
    server: http({
        port: process.env.PORT || 5000
    })
});
