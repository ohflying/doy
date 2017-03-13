/**
 * Author: Jeejen.Dong
 * Date  : 17/3/9
 **/

export default function definedUnEnumerableProperty(obj, property, value) {
    if (Object.isExtensible(obj)) {
        Object.defineProperty(obj, property, {
            writable: false,
            enumerable: false,
            configurable: true,
            value: value
        });
    }
};
