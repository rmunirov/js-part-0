// Test utils

const testBlock = (name) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};

const areEqual = (a, b) => {
    // Compare arrays of primitives
    // Remember: [] !== []
    if (a === b) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
        return a.every((value, i) => areEqual(value, b[i]));
    }
    return false;
};

const test = (whatWeTest, actualResult, expectedResult) => {
    if (areEqual(actualResult, expectedResult)) {
        console.log(`[OK] ${whatWeTest}\n`);
    } else {
        console.error(`[FAIL] ${whatWeTest}`);
        console.debug('Expected:');
        console.debug(expectedResult);
        console.debug('Actual:');
        console.debug(actualResult);
        console.log('');
    }
};

// Functions

const getType = (value) => {
    // Return string with a native JS type of value
    return typeof value;
};

const getTypesOfItems = (arr) => {
    // Return array with types of items of given array
    if (!Array.isArray(arr)) {
        throw new TypeError('Passed parameter is not an array');
    }
    return arr.map((item) => getType(item));
};

const allItemsHaveTheSameType = (arr) => {
    // Return true if all items of array have the same type
    if (!Array.isArray(arr)) {
        throw new TypeError('Passed parameter is not an array');
    }
    if (arr.length <= 1) {
        return true;
    }
    const type = typeof arr[0];
    for (let i = 1; i < arr.length; i++) {
        const typeTocompare = typeof arr[i];
        if (typeTocompare !== type) {
            return false;
        }
    }
    return true;
};

const getRealType = (value) => {
    // Return string with a “real” type of value.
    // For example:
    //     typeof new Date()       // 'object'
    //     getRealType(new Date()) // 'date'
    //     typeof NaN              // 'number'
    //     getRealType(NaN)        // 'NaN'
    // Use typeof, instanceof and some magic. It's enough to have
    // 12-13 unique types but you can find out in JS even more :)
    const type = typeof value;

    if (type === 'number') {
        if (isNaN(value)) {
            return 'NaN';
        }
        if (!isFinite(value)) {
            return 'Infinity';
        }
    }

    if (value === null) {
        return 'null';
    }
    if (Array.isArray(value)) {
        return 'array';
    }
    if (value instanceof Date) {
        return 'date';
    }
    if (value instanceof RegExp) {
        return 'regexp';
    }
    if (value instanceof Set) {
        return 'set';
    }
    if (value instanceof Map) {
        return 'map';
    }
    if (value instanceof Error) {
        return 'error';
    }
    if (value instanceof ArrayBuffer) {
        return 'arrayBuffer';
    }
    if (value instanceof DataView) {
        return 'dataView';
    }
    if (value instanceof Promise) {
        return 'promise';
    }

    return type;
};

const getRealTypesOfItems = (arr) => {
    // Return array with real types of items of given array
    if (!Array.isArray(arr)) {
        throw new TypeError('Passed parameter is not an array');
    }
    return arr.map((item) => getRealType(item));
};

const everyItemHasAUniqueRealType = (arr) => {
    // Return true if there are no items in array
    // with the same real type
    if (!Array.isArray(arr)) {
        throw new TypeError('Passed parameter is not an array');
    }
    const types = new Set();
    for (const item of arr) {
        const type = getRealType(item);
        if (types.has(type)) {
            return false;
        }
        types.add(type);
    }
    return true;
};

const countRealTypes = (arr) => {
    // Return an array of arrays with a type and count of items
    // with this type in the input array, sorted by type.
    // Like an Object.entries() result: [['boolean', 3], ['string', 5]]
    if (!Array.isArray(arr)) {
        throw new TypeError('Passed parameter is not an array');
    }
    const result = new Map();
    for (const item of arr) {
        const type = getRealType(item);
        if (result.has(type)) {
            const value = result.get(type);
            result.set(type, value + 1);
        } else {
            result.set(type, 1);
        }
    }

    return [...result.entries()].sort((a, b) => {
        if (a[0] > b[0]) {
            return 1;
        }
        if (a[0] < b[0]) {
            return -1;
        }
        return 0;
    });
};

// Tests

testBlock('getType');

test('Boolean', getType(true), 'boolean');
test('Number', getType(123), 'number');
test('String', getType('whoo'), 'string');
test('Array', getType([]), 'object');
test('Object', getType({}), 'object');
test(
    'Function',
    getType(() => {}),
    'function'
);
test('Undefined', getType(undefined), 'undefined');
test('Null', getType(null), 'object');

testBlock('allItemsHaveTheSameType');

test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);

test('All values are strings', allItemsHaveTheSameType(['11', '12', '13']), true);

test(
    'All values are strings but wait',
    allItemsHaveTheSameType(['11', new String('12'), '13']),
    false
    // What the result?
);

test(
    'Values like a number',
    allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]),
    true
    // What the result?
);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
    // Add values of different types like boolean, object, date, NaN and so on
    true,
    123,
    'whoo',
    [],
    {},
    () => {},
    undefined,
    null,
    NaN,
    Infinity,
    new Date(),
    new RegExp(),
    new Set(),
    new Map(),
    Symbol(''),
    new Error(),
    new ArrayBuffer(),
    new DataView(new ArrayBuffer()),
    new Promise(() => {}),
];

test('Check basic types', getTypesOfItems(knownTypes), [
    // What the types?
    'boolean',
    'number',
    'string',
    'object',
    'object',
    'function',
    'undefined',
    'object',
    'number',
    'number',
    'object',
    'object',
    'object',
    'object',
    'symbol',
    'object',
    'object',
    'object',
    'object',
]);

test('Check real types', getRealTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'array',
    'object',
    'function',
    'undefined',
    'null',
    'NaN',
    'Infinity',
    'date',
    'regexp',
    'set',
    'map',
    'symbol',
    'error',
    'arrayBuffer',
    'dataView',
    'promise',
    // What else?
]);

testBlock('everyItemHasAUniqueRealType');

test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);

test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, '123' === 123]), false);

test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);

testBlock('countRealTypes');

test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

// Add several positive and negative tests
