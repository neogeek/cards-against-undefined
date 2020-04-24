const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateRandomString = (length = 4) =>
    new Array(length)
        .fill('a')
        .map(
            () =>
                alphabet.split('')[Math.floor(Math.random() * alphabet.length)]
        )
        .join('');

module.exports = { generateRandomString };
