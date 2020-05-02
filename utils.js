const removeArrayItem = (array, filter) => {
    const itemIndex =
        typeof filter === 'function'
            ? array.findIndex(filter)
            : array.indexOf(filter);

    if (itemIndex !== -1) {
        array.splice(itemIndex, 1);
        return true;
    }
    return false;
};

module.exports = { removeArrayItem };
