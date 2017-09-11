/* @flow */

import isObjectExtensible from './isObjectExtensible';

export default function definedUnEnumerableProperty(obj: any, property: string, value: any): void {
    if (isObjectExtensible(obj)) {
        Object.defineProperty(obj, property, {
            writable: false,
            enumerable: false,
            configurable: true,
            value: value
        });
    }
}
