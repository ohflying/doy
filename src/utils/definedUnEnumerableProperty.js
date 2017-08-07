/* @flow */

import isObjectExtensible from './isObjectExtensible';

export default function definedUnEnumerableProperty(obj: Object, property: string, value: any): void {
    if (isObjectExtensible(obj)) {
        Object.defineProperty(obj, property, {
            writable: false,
            enumerable: false,
            configurable: true,
            value: value
        });
    }
}
