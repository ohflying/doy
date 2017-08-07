/* @flow */

import ObservableArray from './ObservableArray';
import ObservableObject, { isObservable } from './ObservableObject';
import ObservableMap from './ObservableMap';
import ObservableSet from './ObservableSet';
import isObjectExtensible from '../utils/isObjectExtensible';
import forceAssign from '../utils/forceAssign';

function isArray(obj) {
    return Array.isArray(obj);
}

function isES6Map(obj) {
    return obj instanceof Map;
}

function isObject(obj) {
    return typeof obj === 'object';
}

function isES6Set(obj) {
    return obj instanceof Set;
}

export default class ObservableFactory {
    static create(defaultTarget: Object, targetName: string = '', parentTarget: ?ObservableObject = null): ?ObservableObject {
        if (!isObjectExtensible(defaultTarget)) {
            return null;
        }

        if (isObservable(defaultTarget)) {
            return defaultTarget;
        }

        if (isArray(defaultTarget)) {
            //$FlowIgnore
            return new ObservableArray(defaultTarget, targetName, parentTarget);
        }

        if (isES6Map(defaultTarget)) {
            return new ObservableMap(defaultTarget, targetName, parentTarget);
        }

        if (isES6Set(defaultTarget)) {
            return new ObservableSet(defaultTarget, targetName, parentTarget);
        }

        if (isObject(defaultTarget)) {
            return new ObservableObject(defaultTarget, targetName, parentTarget);
        }

        return null;
    }
}
