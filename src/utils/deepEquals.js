/**
 * Author: Jeejen.Dong
 * Date  : 17/3/2
 **/
import shallowEquals from './shallowEquals';

export default function deepEquals(first, second, maxDeepCount = 4, curDeepIndex = 0) {
    if (typeof first != 'object' || typeof second != 'object') {
        return shallowEquals(first, second);
    }

    return Object.keys(first).every((key) => {
        if (maxDeepCount > curDeepIndex) {
            return deepEquals(first[key], second[key], maxDeepCount, ++curDeepIndex);
        } else {
            return shallowEquals(first, second[key]);
        }
    });
}