/**
 * Author: Jeejen.Dong
 * Date  : 17/2/22
 **/

import ObservableArray from './ObservableArray';
import ObservableObject from './ObservableObject';
import ObservableMap from './ObservableMap';

function isArray(obj) {
    return Array.isArray(obj);
}

function isMap(obj) {
    return obj instanceof GLOBAL.Map;
}

function isObject(obj) {
    return typeof obj === 'object';
}

export default class ObservableFactory {
    static create(defaultTarget: Object, targetName: String = "", parentTarget: ObservableObject = null) {
        if (isArray(defaultTarget)) {
            return new ObservableArray(defaultTarget, targetName, parentTarget)
        }

        if (isMap(defaultTarget)) {
            return new ObservableMap(defaultTarget, targetName, parentTarget);
        }

        if (isObject(defaultTarget)) {
            return new ObservableObject(defaultTarget, targetName, parentTarget);
        }

        return null;
    }
}