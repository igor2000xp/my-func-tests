function chunk(array, size = 1) {
    if (size <= 0) return [];
    let result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

function compact(array) {
    return filter(array, Boolean);
}

function drop(array, n = 1) {
    return filter(array, (_, index) => index >= n);
}

function dropWhile(array, func) {
    let dropIndex = 0;
    while (dropIndex < array.length && func(array[dropIndex], dropIndex, array)) {
        dropIndex++;
    }
    return drop(array, dropIndex);
}

function take(array, n = 1) {
    return filter(array, (_, index) => index < n);
}

function filter(array, func) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
        if (func(array[i], i, array)) {
            result.push(array[i]);
        }
    }
    return result;
}

function find(array, func) {
    for (let i = 0; i < array.length; i++) {
        if (func(array[i], i, array)) {
            return array[i];
        }
    }
    return undefined;
}

function includes(array, value) {
    return find(array, (item) => item === value) !== undefined;
}

function map(array, iteratee) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(iteratee(array[i], i, array));
    }
    return result;
}

function zip(...arrays) {
    const maxLen = Math.max(...arrays.map(arr => arr.length));
    return Array.from({ length: maxLen }, (_, i) => arrays.map(arr => arr[i]));
}

function merge(object, ...sources) {
    if (object == null) object = {};
    for (let source of sources) {
        if (source != null) {
            for (let key in source) {
                if (source[key] !== null && typeof source[key] === 'object' &&
                    object[key] !== null && typeof object[key] === 'object') {
                    object[key] = merge(object[key], source[key]);
                } else {
                    object[key] = source[key];
                }
            }
        }
    }
    return object;
}

function omit(object, keys) {
    const keysLookup = new Set(keys);
    return filter(Object.keys(object), (key) => !keysLookup.has(key))
        .reduce((result, key) => {
            result[key] = object[key];
            return result;
        }, {});
}

function omitBy(object, func) {
    return filter(Object.keys(object), (key) => !func(object[key], key, object))
        .reduce((result, key) => {
            result[key] = object[key];
            return result;
        }, {});
}

function pick(object, keys) {
    const keysLookup = new Set(keys);
    return filter(Object.keys(object), (key) => keysLookup.has(key))
        .reduce((result, key) => {
            result[key] = object[key];
            return result;
        }, {});
}

function pickBy(object, func) {
    return filter(Object.keys(object), (key) => func(object[key], key, object))
        .reduce((result, key) => {
            result[key] = object[key];
            return result;
        }, {});
}

function toPairs(object) {
    return map(Object.keys(object), (key) => [key, object[key]]);
}

module.exports = {
    chunk,
    compact,
    drop,
    dropWhile,
    take,
    filter,
    find,
    includes,
    map,
    zip,
    merge,
    omit,
    omitBy,
    pick,
    pickBy,
    toPairs
};
