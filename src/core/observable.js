/* @flow */

import ObservableObject, { isObservable, isAtom, isExtensible } from '../types/ObservableObject';
import ObservableFactory from '../types/ObservableFactory';
import transformName from '../utils/transformName';
import shallowClone from '../utils/shallowClone';
import getProperty from '../utils/getProperty';
import isObjectExtensible from '../utils/isObjectExtensible';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

class JointWrapper {
    $$joint: boolean = true;
    target: Object;
    constructor(target: Object) {
        this.target = target;
    }
}

function isPrivateValue(propertyKey: string): boolean {
    return propertyKey === '$$value';
}

function isObject(obj: any): boolean {
    return obj !== null && typeof obj === 'object';
}

function supportType(obj: any): boolean {
    if (isExtensible(obj) || !obj.constructor || !obj.constructor.name) {
        return true;
    }

    return ['Object', 'Array', 'Map', 'Set'].includes(obj.constructor.name);
}

function needObservable(obj: any): boolean {
    return isObject(obj) && supportType(obj) && isObjectExtensible(obj) && !isAtom(obj);
}

function observable(defaultTarget: any, options: Object = {}, targetName: string = '', parentTarget?: ?ObservableObject<*>): any {
    let target = ObservableFactory.create(defaultTarget, targetName, parentTarget);
    if (target === null || target === undefined) {
        return defaultTarget;
    }

    let observableTarget: ObservableObject<*> = isObservable(defaultTarget) ? defaultTarget : target.$$patchTo(defaultTarget);

    const handler = (propertyKey) => {
        let propertyValue = getProperty(observableTarget, propertyKey);
        if (!isPrivateValue(propertyKey) && needObservable(propertyValue)) {
            propertyValue = observable(propertyValue, options, propertyKey, observableTarget);
        }

        //fix In a observable object modified, failed to modify the object of parent
        if (!isPrivateValue(propertyKey) && isObservable(propertyValue) && propertyValue.$$parent !== observableTarget) {
            definedUnEnumerableProperty(propertyValue, '$$parent', observableTarget);
        }

        let descriptor = {
            _value: propertyValue,
            enumerable: !propertyKey.startsWith('$$'),
            get: function() {
                if (options.watch) {
                    options.watch(transformName(observableTarget.$$name, isAtom(observableTarget) || isPrivateValue(propertyKey) ? '' : propertyKey));
                }

                return descriptor._value;
            },
            set: function(value) {
                if (!isPrivateValue(propertyKey) && descriptor._value === value) {
                    return true;
                }

                if (!isAtom(observableTarget)) {
                    //re-observer
                    if (isPrivateValue(propertyKey)) {
                        observableTarget = observable(observableTarget, options, observableTarget.$$name, observableTarget.$$parent);
                    } else if (!isAtom(value)) {
                        descriptor._value = observable(value, options, propertyKey, observableTarget);
                    } else {
                        descriptor._value = value;
                    }
                }

                if (options.changed) {
                    options.changed(transformName(observableTarget.$$name,
                        isAtom(observableTarget) || isPrivateValue(propertyKey) ? '' : propertyKey));
                }
            }
        };

        Object.defineProperty(observableTarget, propertyKey, descriptor);
    };

    let properties = ['$$value'];
    if (!isAtom(observableTarget)) {
        properties = properties.concat(Object.keys(observableTarget));
    }

    properties.forEach(handler);

    return observableTarget;
}

export default observable;
