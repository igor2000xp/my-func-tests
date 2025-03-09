function mySlice(array, start, end) {
    const length = array.length;
    const normalizedStart = start < 0 ? Math.max(length + start, 0) : Math.min(start, length);
    const normalizedEnd = end < 0 ? Math.max(length + end, 0) : Math.min(end, length);

    const newLength = Math.max(normalizedEnd - normalizedStart, 0);
    const result = new Array(newLength);

    for (let i = 0; i < newLength; i++) {
        result[i] = array[normalizedStart + i];
    }
    return result;
}

function myPush(array, ...elements) {
    const originalLength = array.length;
    const numElements = elements.length;

    for (let i = 0; i < numElements; i++) {
        array[originalLength + i] = elements[i];
    }
    return array.length;
}

function myReduce(array, callback, initialValue = 0) {
    const len = array.length;
    let accumulator = initialValue;
    let startIndex = 0;

    if (initialValue === undefined) {
        if (len === 0) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        accumulator = array[0];
        startIndex = 1;
    }

    for (let i = startIndex; i < len; i++) {
        accumulator = callback(accumulator, array[i], i, array);
    }
    return accumulator;
}

function chunk(array, size = 1) {
    if (!Array.isArray(array)) {
        throw new TypeError("Input must be an array.");
    }
    if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
        return [];
    }
    const len = array.length;
    if (len === 0) {
        return [];
    }

    const numChunks = Math.ceil(len / size);
    const result = new Array(numChunks);  // pre-allocate
    for (let i = 0, chunkIndex = 0; i < len; i += size, chunkIndex++) {
        result[chunkIndex] = mySlice(array, i, i + size); // Reuse mySlice
    }
    return result;
}

function compact(array) {
    return filter(array, Boolean);
}

function drop(array, n = 1) {
     if (!Array.isArray(array)) {
        throw new TypeError("Input must be an array.");
    }
    return mySlice(array, n, array.length); // Reuse mySlice
}

function dropWhile(array, func) {
    if (!Array.isArray(array)) {
        throw new TypeError("Input must be an array.");
    }
    if (typeof func !== 'function') {
        throw new TypeError("Predicate must be a function.");
    }

    let dropIndex = 0;
    const len = array.length;
    while (dropIndex < len && func(array[dropIndex], dropIndex, array)) {
        dropIndex++;
    }
    return mySlice(array, dropIndex, array.length); //Reuse mySlice
}

function take(array, n = 1) {
    if (!Array.isArray(array)) {
        throw new TypeError("Input must be an array.");
    }
    return mySlice(array, 0, n); // Reuse mySlice
}

function filter(array, func) {
    if (!Array.isArray(array)) {
        throw new TypeError("Input must be an array.");
    }
    if (typeof func !== 'function') {
        throw new TypeError("Predicate must be a function.");
    }
    const len = array.length;
    const result = [];

    for (let i = 0; i < len; i++) {
        if (func(array[i], i, array)) {
            myPush(result, array[i]);  // Reuse myPush
        }
    }
    return result;
}


function find(array, func) {
   if (!Array.isArray(array)) {
        throw new TypeError("Input must be an array.");
    }
    if (typeof func !== 'function') {
        throw new TypeError("Predicate must be a function.");
    }
    const len = array.length;
    for (let i = 0; i < len; i++) {
        if (func(array[i], i, array)) {
            return array[i];
        }
    }
    return undefined;
}

function includes(array, value) {
    return find(array, (item) => Object.is(item, value)) !== undefined;
}

function map(array, iteratee) {
    if (!Array.isArray(array)) {
        throw new TypeError("Input must be an array.");
    }
    if (typeof iteratee !== 'function') {
        throw new TypeError("Iteratee must be a function.");
    }
    const len = array.length;
    const result = new Array(len); // Pre-allocate
    for (let i = 0; i < len; i++) {
        result[i] = iteratee(array[i], i, array);
    }
    return result;
}
function zip(...arrays) {
  if (!arrays.every(Array.isArray)) {
    throw new TypeError("All inputs must be arrays.");
  }
    const maxLen = myReduce(arrays, (max, arr) => Math.max(max, arr.length), 0);  // Reuse myReduce
    return Array.from({ length: maxLen }, (_, i) =>
        Array.from({ length: arrays.length }, (_, j) => arrays[j][i])
    );
}

function merge(object, ...sources) {
    if (object == null) object = {};

    for (const source of sources) {
        if (source == null) continue;

        const keys = Object.keys(source);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const sourceVal = source[key];
            const objectVal = object[key];

            if (sourceVal !== null && typeof sourceVal === 'object' && !Array.isArray(sourceVal) &&
                objectVal !== null && typeof objectVal === 'object' && !Array.isArray(objectVal)) {
                 object[key] = merge(Object.assign({}, objectVal), sourceVal);
            }
           else {
                object[key] = sourceVal;
            }
        }
    }
    return object;
}

function omit(object, keys) {
    if (object == null) {
        return {};
    }
    const keysSet = new Set(keys); // Convert to Set for efficient lookup
    return myReduce(Object.keys(object), (result, key) => { // Reuse myReduce
        if (!keysSet.has(key)) {
            result[key] = object[key];
        }
        return result;
    }, {});
}

function omitBy(object, func) {
    if (object == null) {
        return {};
    }
    if (typeof func !== 'function') {
        throw new TypeError("Predicate must be a function.");
    }
    return myReduce(Object.keys(object), (result, key) => {  // Reuse myReduce
        if (!func(object[key], key)) {
             result[key] = object[key];
        }
        return result;
    }, {});
}

function pick(object, keys) {
    if (object == null) {
        return {};
    }
    const keysSet = new Set(keys); // Convert to Set for efficient lookup
     return myReduce(Object.keys(object), (result, key) => { // Reuse myReduce
        if (keysSet.has(key)) {
            result[key] = object[key];
        }
        return result;
    }, {});
}

function pickBy(object, func) {
    if (object == null) {
        return {};
    }
    if (typeof func !== 'function') {
        throw new TypeError("Predicate must be a function.");
    }

    return myReduce(Object.keys(object), (result, key) => { // Reuse myReduce
        if (func(object[key], key)) {
             result[key] = object[key];
        }
        return result;
    }, {});
}

function toPairs(object) {
    if (object == null) {
        return [];
    }
    return myReduce(Object.keys(object), (result, key) => { // Reuse myReduce
        myPush(result, [key, object[key]]); // Reuse myPush.
        return result;
    }, []);
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
