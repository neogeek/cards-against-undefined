const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateRandomString = (length = 4) =>
    new Array(length)
        .fill('a')
        .map(
            () =>
                alphabet.split('')[Math.floor(Math.random() * alphabet.length)]
        )
        .join('');

const removeArrayItem = (array, filter) => {
    const itemIndex = array.findIndex(filter);

    if (itemIndex !== -1) {
        array.splice(itemIndex, 1);
        return true;
    }
    return false;
};

module.exports = { generateRandomString, removeArrayItem };
