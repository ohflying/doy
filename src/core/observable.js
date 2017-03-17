/**
 * Author: Jeejen.Dong
 * Date  : 17/2/17
 **/

import { isObservable, isAtom, isExtensible } from '../types/ObservableObject';
import ObservableFactory from '../types/ObservableFactory';
import transformName from '../utils/transformName';
import shallowClone from '../utils/shallowClone';
import isObjectExtensible from '../utils/isObjectExtensible';

function isPrivateValue(propertyKey) {
    return propertyKey === '$$value';
}

function isObject(obj) {
    return obj != null && typeof obj == 'object'
}

function supportType(obj) {
    if (isExtensible(obj) || !obj.constructor || !obj.constructor.name) { //Object
        return true;
    }

    return ['Object', 'Array', 'Map', 'Set'].includes(obj.constructor.name);
}

function needObservable(obj) {
    return isObject(obj) && supportType(obj) && isObjectExtensible(obj) && !isAtom(obj);
}

function jointNewChild(target, options) {
    if (!target || typeof target != 'object' || !target.$$parent || !target.$$targetName) {
        return false;
    }

    let newTarget = shallowClone(target);
    target.$$parent[target.$$targetName] = observable(newTarget, options, target.$$targetName, target.$$parent);

    jointNewChild(target.$$parent, options);

    return true;
}

function observable(defaultTarget: Object, options: Object = {}, targetName: string = "", parentTarget: Object) {
    let target = ObservableFactory.create(defaultTarget, targetName, parentTarget);
    if (target == null) {
        return defaultTarget;
    }

    let observableTarget = isObservable(defaultTarget) ? defaultTarget : target.$$patchTo(defaultTarget);

    const handler = (propertyKey) => {
        let propertyValue = observableTarget[propertyKey];
        if (!isPrivateValue(propertyKey) && needObservable(propertyValue)) {
            observableTarget[propertyKey] = observable(propertyValue, options, propertyKey, observableTarget);
        }

        let descriptor = {
            _value: observableTarget[propertyKey],
            enumerable: !propertyKey.startsWith('$$'),
            get: function() {
                if (options.watch) {
                    options.watch(transformName(observableTarget.$$name, isAtom(observableTarget) || isPrivateValue(propertyKey) ? "" : propertyKey));
                }

                return descriptor._value;
            },
            set: function(value) {
                let oldValue = observableTarget[propertyKey];
                if (!isPrivateValue(propertyKey) && oldValue === value) {
                    return true;
                }

                if (!isAtom(observableTarget)) {
                    if (isPrivateValue(propertyKey)) { //reobserver
                        observableTarget = observable(observableTarget, options, observableTarget.$$name, observableTarget.$$parent);
                    } else if (!isAtom(value)) {
                        descriptor._value = observable(value, options, propertyKey, observableTarget);
                    } else {
                        descriptor._value = value;
                    }
                }

                let fired = jointNewChild(observableTarget, options);

                //if the target parent not null, the changed event has fired in recursionUpdate function;
                if (isPrivateValue(propertyKey) && fired) {
                    return true;
                }

                if (options.changed) {
                    options.changed(transformName(observableTarget.$$name,
                        isAtom(observableTarget) || isPrivateValue(propertyKey) ? "" : propertyKey));
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