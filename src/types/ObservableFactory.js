/* @flow */

import ObservableArray from './ObservableArray';
import ObservableObject, {isObservable} from './ObservableObject';
import ObservableMap from './ObservableMap';
import ObservableSet from './ObservableSet';
import isObjectExtensible from '../utils/isObjectExtensible';

function isArray(obj: any): boolean {
    return Array.isArray(obj);
}

function isES6Map(obj: any): boolean {
    return obj instanceof Map;
}

function isObject(obj: any): boolean {
    return typeof obj === 'object';
}

function isES6Set(obj: any): boolean {
    return obj instanceof Set;
}

export default class ObservableFactory {
    static create(defaultTarget: any, targetName: string = '', parentTarget: ?ObservableObject<*> = null): ObservableObject<*> | null {
        if (!isObjectExtensible(defaultTarget)) {
            return null;
        }

        if (isObservable(defaultTarget)) {
            return defaultTarget;
        }

        if (isArray(defaultTarget)) {
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
