/**
 * Author: Jeejen.Dong
 * Date  : 17/2/17
 **/

import { isObservable } from '../types/ObservableObject';
import ObservableFactory from '../types/ObservableFactory';
import deepEquals from '../utils/deepEquals';
import transformName from '../utils/transformName';
import getOwnKeys from '../utils/getOwnKeys';

function isPrivateValue(propertyKey) {
    return propertyKey === '$$value';
}
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

            if (!isPrivateValue(propertyKey) && deepEquals(oldValue, value)) {
                return true;
            }

            let result = Reflect.set(target, propertyKey, value, receiver);

            if (options.changed) {
                options.changed(transformName(target.$$name, target.$$isAtom() || isPrivateValue(propertyKey) ? "" : propertyKey));
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
                let property =  Reflect.get(target.$$defaultTarget, propertyKey, receiver);
                return typeof property === 'function' ? property.bind(target.$$defaultTarget) : property;
            }

            let value = Reflect.get(target, propertyKey, receiver);
            if (typeof value === 'function') {
                return value;
            }

            if (typeof propertyKey !== 'string' || target.$$isAtom()) {
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