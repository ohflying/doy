/* @flow */
import isObjectExtensible from './isObjectExtensible';

export default function forceAssign(target: Object, ...sources: Array<Object>): Object {
    if (!isObjectExtensible(target) || !sources || sources.length <= 0) {
        return target;
    }

    let originalPropertyDescriptor = {};
    sources.forEach((source) => {
        if (!source) return;

        Object.keys(source).forEach((key) => {
            if (!target.hasOwnProperty(key)) return;

            let descriptor = Object.getOwnPropertyDescriptor(target, key);
            if (descriptor && !descriptor.writable) {
                originalPropertyDescriptor[key] = descriptor;

                Object.defineProperty(target, key, Object.assign({}, descriptor, {
                    writable: true
                }));
            }
        });
    });

    Object.assign(target, ...sources);

    Object.keys(originalPropertyDescriptor).forEach((key) => {
        Object.defineProperty(target, key, Object.assign(originalPropertyDescriptor[key], {
            value: target[key]
        }));
    });

    return target;
}
