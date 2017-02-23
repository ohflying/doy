/**
 * Author: Jeejen.Dong
 * Date  : 17/2/17
 **/

import shallowEquals from '../utils/shallowEquals';
import referenceCopy from '../utils/referenceCopy';

function isObservable (obj) {
    return obj && obj.$$observable;
}

function needObservable(obj) {
    return obj != null && typeof obj === 'object' && !isObservable(obj);
}

function transformName(targetName, propertyKey) {
    return (targetName || "") + (propertyKey ? ((targetName ? "$" : "") + propertyKey) : "");
}

export default function observable(defaultTarget: object, options = {}, targetName: string = "", parentTarget: object = {}) {
    let target = Object.assign({}, defaultTarget || {}, {
        $$parentTarget: parentTarget,
        $$name: transformName(parentTarget.$$name, targetName),
        $$selfName: targetName,
        $$observable: true
    });

    let proxy = new Proxy(target, {
        set: (target, propertyKey, value, receiver) => {
            let oldValue = Reflect.get(target, propertyKey);

            if (shallowEquals(oldValue, value)) {
                return;
            }

            Reflect.set(target, propertyKey, value, receiver);

            if (options.changed) {
                options.changed(transformName(target.$$name, propertyKey));
            }
        },
        get: (target, propertyKey, receiver) => {
            if (typeof propertyKey !== 'string' || propertyKey.startsWith('$$') || target.$$Atom) {
                return Reflect.get(target, propertyKey, receiver);
            }

            let value = Reflect.get(target, propertyKey, receiver);
            if (typeof value === 'function') {
                return Reflect.get(target, propertyKey, receiver);
            }

            if (needObservable(value)) {
                value = observable(value || {}, options, propertyKey, target);
                Reflect.set(target, propertyKey, value, receiver);
            }

            if (options.watch) {
                options.watch(transformName(target.$$name, propertyKey));
            }

            return value;
        }
    });

    return proxy;
}