/* @flow */

import ObservableObject, { isObservable, isAtom, isExtensible } from '../types/ObservableObject';
import ObservableFactory from '../types/ObservableFactory';
import transformName from '../utils/transformName';
import shallowClone from '../utils/shallowClone';
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

function isObject(obj: Object): boolean {
    return obj !== null && typeof obj === 'object';
}

function supportType(obj: Object): boolean {
    if (isExtensible(obj) || !obj.constructor || !obj.constructor.name) { //Object
        return true;
    }

    return ['Object', 'Array', 'Map', 'Set'].includes(obj.constructor.name);
}

function needObservable(obj) {
    return isObject(obj) && supportType(obj) && isObjectExtensible(obj) && !isAtom(obj);
}

function jointNewChild(target: Object, options: ?ObservableOption): boolean {
    if (!target || typeof target !== 'object' || !target.$$parent || !target.$$targetName) {
        return false;
    }

    let newTarget = shallowClone(target);
    target.$$parent[target.$$targetName] = new JointWrapper(observable(newTarget, options, target.$$targetName, target.$$parent));

    jointNewChild(target.$$parent, options);

    return true;
}

function observable(defaultTarget: any, options: ?ObservableOption = null, targetName: string = '', parentTarget: ?ObservableObject): Object {
    let target = ObservableFactory.create(defaultTarget, targetName, parentTarget);
    if (!target) {
        return defaultTarget;
    }

    let observableTarget = isObservable(defaultTarget) ? defaultTarget : target.$$patchTo(defaultTarget);

    const handler = (propertyKey) => {
        let propertyValue = observableTarget[propertyKey];
        if (!isPrivateValue(propertyKey) && needObservable(propertyValue)) {
            observableTarget[propertyKey] = observable(propertyValue, options, propertyKey, observableTarget);
        }

        //fix In a observable object modified, failed to modify the object of parent
        if (!isPrivateValue(propertyKey) && isObservable(propertyValue) && propertyValue.$$parent !== observableTarget) {
            definedUnEnumerableProperty(observableTarget[propertyKey], '$$parent', observableTarget);
        }

        let descriptor = {
            _value: observableTarget[propertyKey],
            enumerable: !propertyKey.startsWith('$$'),
            get: function() {
                let name = transformName(observableTarget.$$name, isAtom(observableTarget) || isPrivateValue(propertyKey) ? '' : propertyKey);

                options && options.watch && options.watch(name);

                return descriptor._value;
            },
            set: function(value) {
                //let isJoint = false;
                //if (value instanceof JointWrapper) {
                //    isJoint = value.$$joint;
                //    value = value.target;
                //}

                let oldValue = descriptor._value;
                if (!isPrivateValue(propertyKey) && oldValue === value) {
                    return true;
                }

                if (!isAtom(observableTarget)) {
                    // re-observer
                    if (isPrivateValue(propertyKey)) {
                        observableTarget = observable(observableTarget, options, observableTarget.$$name, observableTarget.$$parent);
                    } else if (!isAtom(value)) {
                        descriptor._value = observable(value, options, propertyKey, observableTarget);
                    } else {
                        descriptor._value = value;
                    }
                }

                //jointNewChild(observableTarget, options);

                //if the target parent not null, the changed event has fired in jointNewChild function;
                //if (isJoint) {
                //    return true;
                //}

                if (!isPrivateValue(propertyKey)) {
                    options && options.changed && options.changed(transformName(observableTarget.$$name,
                        isAtom(observableTarget) ? '' : propertyKey));
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
