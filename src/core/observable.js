/**
 * Author: Jeejen.Dong
 * Date  : 17/2/17
 **/

import { isObservable } from '../types/ObservableObject';
import ObservableFactory from '../types/ObservableFactory';
import shallowEqual from 'fbjs/lib/shallowEqual';
import transformName from '../utils/transformName';
import getOwnKeys from '../utils/getOwnKeys';

function isPrivateValue(propertyKey) {
    return propertyKey === '$$value';
}

function needObservable(obj) {
    return obj != null && typeof obj === 'object' && !isObservable(obj);
}

function recursionUpdate(target, options) {
    if (!target) {
        return;
    }

    if (target.$$parent && target.$$name) {
        target.$$parent[target.$$name] = observable(Object.assign(new target.constructor, target), options, target.$$name, target.$$parent);
        recursionUpdate(target.$$parent);
    }
}

function observable(defaultTarget: object, options = {}, targetName: string = "", parentTarget: object = {}) {
    let target = ObservableFactory.create(defaultTarget, targetName, parentTarget);
    if (target == null) {
        return defaultTarget;
    }

    let proxy = new Proxy(target, {
        set: (target, propertyKey, value, receiver) => {
            let oldValue = Reflect.get(target, propertyKey);

            if (!isPrivateValue(propertyKey) && shallowEqual(oldValue, value)) {
                return true;
            }

            target[propertyKey] = value;

            recursionUpdate(target, options);

            if (options.changed) {
                options.changed(transformName(target.$$name, target.$$isAtom() || isPrivateValue(propertyKey) ? "" : propertyKey));
            }

            return true;
        },
        get: (target, propertyKey, receiver) => {
            if (typeof propertyKey === 'string' && propertyKey.startsWith('$$')) {
                return Reflect.get(target, propertyKey, receiver);
            }

            let has = Reflect.has(target, propertyKey, receiver);

            if (!has) {
                if (Reflect.has(target.$$defaultTarget, propertyKey, receiver)) {
                    let property = Reflect.get(target.$$defaultTarget, propertyKey, receiver);
                    return typeof property === 'function' ? property.bind(target.$$defaultTarget) : property;
                }
            }

            let value = Reflect.get(target, propertyKey, receiver);
            if (typeof value === 'function' || typeof propertyKey !== 'string' || target.$$isAtom()) {
                return value;
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
        ownKeys: (target) => {
            return getOwnKeys(target.$$getRealValue());
        },
        has: (target, propertyKey) => {
            return Reflect.has(target.$$getRealValue(), propertyKey);
        },
        getOwnPropertyDescriptor: (target, propertyKey) => {
            return Reflect.getOwnPropertyDescriptor(target.$$getRealValue(), propertyKey);
        },
        defineProperty: (target, propertyKey, attributes) => {
            return Reflect.defineProperty(target.$$getRealValue(), propertyKey, attributes);
        },
        getPrototypeOf: (target) => {
            return Reflect.getPrototypeOf(target.$$defaultTarget);
        }
    });

    return proxy;
}

export default observable;