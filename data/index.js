const glob = require('glob');
const { basename, join, resolve } = require('path');

glob.sync(join(__dirname, '*.json')).forEach(file => {
    exports[basename(file, '.json')] = require(resolve(file));
});
