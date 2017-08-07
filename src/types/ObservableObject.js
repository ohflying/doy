/* @flow */

import transformName from '../utils/transformName';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

export default class ObservableObject {
    // public
    $$observable: boolean = true;
    $$atom: boolean;
    $$parent: ?ObservableObject;
    $$targetName: string;
    $$name: string;
    $$defaultTarget: Object;
    $$value: *;
    constructor(defaultTarget: any, targetName: string = '', parent: ?ObservableObject = null, atom: boolean = false, value: * = null) {
        //$FlowFixMe
        this.$$atom = atom || (defaultTarget || {}).$$atom || false;
        this.$$parent = parent;
        this.$$targetName = targetName;
        this.$$name = transformName(parent ? parent.$$name : '', targetName);
        this.$$defaultTarget = defaultTarget;
        this.$$value = value;
    }

    $$notify(result: any) {
        this.$$value = this.$$value;
        return result;
    }

    $$patchTo(target: Object): Object {
        target = target || {};
        Object.keys(this).concat('$$notify').forEach((key) => {
            //$FlowIgnore
            definedUnEnumerableProperty(target, key, this[key]);
        });

        return target;
    }
}

export const isObservable = (obj: ?Object) => {
    return obj && obj.$$observable;
};

export const isAtom = (obj: ?Object) => {
    return obj && obj.$$atom;
};

export const isExtensible = (obj: ?Object) => {
    return obj && obj.$$extensible;
};
