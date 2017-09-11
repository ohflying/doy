/* @flow */

import shallowEquals from './shallowEquals';

export default function deepEquals(first: any, second: any, maxDeepCount: number = 4, curDeepIndex: number = 0): boolean {
    if (typeof first !== 'object' || typeof second !== 'object') {
        return shallowEquals(first, second);
    }

    let firstKeys = Object.keys(first);
    let secondKeys = Object.keys(second);

    if (firstKeys.length !== secondKeys.length) {
        return false;
    }

    return firstKeys.every((key) => {
        if (maxDeepCount > curDeepIndex) {
            return deepEquals(first[key], second[key], maxDeepCount, curDeepIndex + 1);
        } else {
            return shallowEquals(first[key], second[key]);
        }
    });
}
