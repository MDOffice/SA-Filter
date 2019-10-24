export const clone = (obj: any | null) => {
    let copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != typeof obj) {
        return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);
            }
        }
        return copy;
    }

    throw new Error('Unable to copy obj! Its type isn\'t supported.');
};

export const arraysEqual = (a: string | string[] | null, b: string | string[] | null) => {
    if (a === b) {
        return true;
    }
    if (a == null || b == null) {
        return false;
    }
    if (a.length != b.length) {
        return false;
    }

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};

export const throwErr = (message: string) => {
    // Remove multiple spaces:
    message = message.replace(/ +(?= )/g, '');
    message = message.trim();

    throw `SAFilter: ${message}`;
};

/*
 * Match plain objects ({}) but NOT null
 */
export const isPlainObject = (value: any) => {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    } else {
        var prototype = Object.getPrototypeOf(value);
        return prototype === null || prototype === Object.prototype;
    }
};

export const ordinalSuffixOf = (num: number) => {
    let j = num % 10;
    let k = num % 100;

    if (j === 1 && k !== 11) {
        return `${num}st`;
    }

    if (j === 2 && k !== 12) {
        return `${num}nd`;
    }

    if (j === 3 && k !== 13) {
        return `${num}rd`;
    }

    return `${num}th`;
};

