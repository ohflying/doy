/**
 * Author: Jeejen.Dong
 * Date  : 17/2/17
 **/

import shallowEquals from '../utils/shallowEquals';
import transformName from '../utils/transformName';
import ObservableFactory from '../types/ObservableFactory';
import { isObservable } from '../types/ObservableObject';

function needObservable(obj) {
    return obj != null && typeof obj === 'object' && !isObservable(obj);
}

export default function observable(defaultTarget: object, options = {}, targetName: string = "", parentTarget: object = {}) {
    let target = ObservableFactory.create(defaultTarget, targetName, parentTarget);
    if (target == null) {
        return defaultTarget;
    }

    let proxy = new Proxy(target, {
        set: (target, propertyKey, value, receiver) => {
            let oldValue = Reflect.get(target, propertyKey);

            if (shallowEquals(oldValue, value)) {
                return true;
            }

            let result = Reflect.set(target, propertyKey, value, receiver);

            if (options.changed) {
                options.changed(transformName(target.$$name, target.isAtom() ? "" : propertyKey));
            }

            return result;
        },
        get: (target, propertyKey, receiver) => {
            if (typeof propertyKey === 'string' && propertyKey.startsWith('$$')) {
                return Reflect.get(target, propertyKey, receiver);
            }

            let has = Reflect.has(target, propertyKey, receiver);
            let hasInOld = Reflect.has(target.$$defaultTarget, propertyKey, receiver);

            if (!has && hasInOld) {
                return Reflect.get(target.$$defaultTarget, propertyKey, receiver);
            }

            let value = Reflect.get(target, propertyKey, receiver);
            if (typeof value === 'function') {
                return value;
            }

            if (typeof propertyKey !== 'string' || target.isAtom()) {
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
        },
        ownKeys(target) {
            return Object.keys(target).filter((key) => {
                return !key.startsWith('$$') && !target.$$ignoreProps.includes(key);
            })
        }
    });

    return proxy;
}