const removeArrayItem = (array, filter) => {
    const itemIndex = array.findIndex(filter);

    if (itemIndex !== -1) {
        array.splice(itemIndex, 1);
        return true;
    }
    return false;
};

module.exports = { removeArrayItem };
