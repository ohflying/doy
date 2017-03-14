/**
 * Author: Jeejen.Dong
 * Date  : 17/3/9
 **/

import isObjectExtensible from './isObjectExtensible';

export default function definedUnEnumerableProperty(obj, property, value) {
    if (isObjectExtensible(obj)) {
        Object.defineProperty(obj, property, {
            writable: false,
            enumerable: false,
            configurable: true,
            value: value
        });
    }
};
