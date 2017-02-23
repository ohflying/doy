/**
 * Author: Jeejen.Dong
 * Date  : 17/2/17
 **/

const arrayEquals = function(first, second) {
    if (first.length !== second.length) {
        return false;
    }

    return first.every((value, index) => {
        return first[index] === second[index];
    });
};

const objectEquals = function(first, second) {
    if (Object.keys(first).length != Object.keys(second).length) {
        return false;
    }

    return Object.keys(first).every((key) => {
        return first[key] === second[key];
    })
};

export default function shallowEquals(first, second) {
    if (first === second) {
        return true;
    }

    if (typeof first !== typeof second || typeof first === 'function' || typeof first !== 'object') {
        return false;
    }

    if (Array.isArray(first)) {
        return arrayEquals(first, second);
    }

    return objectEquals(first, second);
}