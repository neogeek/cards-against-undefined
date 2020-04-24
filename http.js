const { join } = require('path');
const { readFileSync } = require('fs');
const { createServer } = require('http');

const getContentType = path => {
    const [, extension] = path.match(/\.([^\.]+)$/);
    switch (extension) {
        case 'html':
            return 'text/html';
        case 'js':
            return 'text/javascript';
        case 'svg':
            return 'image/svg+xml';
        case 'ico':
            return 'image/x-icon';
    }
};

const server = ({ port }) =>
    createServer((req, res) => {
        let path = join(__dirname, 'dist/', 'index.html');

        if (req.url.match(/\.(js|ico|svg)$/)) {
            path = join(__dirname, 'dist/', req.url);
        }

        res.writeHead(200, { 'Content-Type': getContentType(path) });

        res.end(readFileSync(path));
    }).listen(port);

module.exports = server;
