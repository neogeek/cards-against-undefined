const http = require('./http');

const websocket = require('./websocket');

websocket({
    server: http({
        port: process.env.PORT || 5000
    })
});
