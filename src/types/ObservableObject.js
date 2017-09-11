/* @flow */

import transformName from '../utils/transformName';
import getProperty from '../utils/getProperty';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

export default class ObservableObject<T> {
    $$observable: boolean = true;
    $$atom: boolean = false;
    $$parent: ?ObservableObject<*> = null;
    $$targetName: string;
    $$name: string;
    $$defaultTarget: T;
    $$value: ?T;
    constructor(defaultTarget: T, targetName: string = '', parent: ?ObservableObject<*> = null, atom: boolean = false, value: ?T = null) {
        this.$$atom = atom || !!(defaultTarget || {}).$$atom || false;
        this.$$parent = parent;
        this.$$targetName = targetName;
        this.$$name = transformName(parent ? parent.$$name : '', targetName);
        this.$$defaultTarget = defaultTarget;
        this.$$value = value;
    }

    $$notify<R>(result: R): R {
        this.$$value = this.$$value;
        return result;
    }

    $$patchTo(target: T): T {
        target = target || {};
        Object.keys(this).concat('$$notify').forEach((key) => {
            definedUnEnumerableProperty(target, key, getProperty(this, key));
        });

        return target;
    }
}

export const isObservable = (obj: any): boolean => {
    return obj && obj.$$observable;
};

export const isAtom = (obj: any): boolean => {
    return obj && obj.$$atom;
};

export const isExtensible = (obj: any): boolean => {
    return obj && obj.$$extensible;
};
