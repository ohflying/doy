/**
 * Author: Jeejen.Dong
 * Date  : 17/3/2
 **/
import shallowEquals from './shallowEquals';

export default function deepEquals(first, second, maxDeepCount = 4, curDeepIndex = 0) {
    if (typeof first != 'object' || typeof second != 'object') {
        return shallowEquals(first, second);
    }

    let firstKeys = Object.keys(first);
    let secondKeys = Object.keys(second);

    if (firstKeys.length != secondKeys.length) {
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