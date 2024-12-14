export const isArrayEmpty = (arr) => {
    if (Array.isArray(arr)) {
      return arr.length == 0;
    }
    return true;
}

export const isArrayNotEmpty = (arr) => {
    if (Array.isArray(arr)) {
        return arr.length > 0
    }
    return false;
};
