/**
 * Author: Jeejen.Dong
 * Date  : 17/2/22
 **/

import transformName from '../utils/transformName';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

export default class ObservableObject {
    constructor(defaultTarget: Object, targetName: string = "", parent: ObservableObject = null, atom: Boolean = false, value: Object = null) {
        this.$$observable = true;
        this.$$atom = atom || (defaultTarget || {}).$$atom || false;
        this.$$parent = parent;
        this.$$targetName = targetName;
        this.$$name = transformName(parent ? parent.$$name: "", targetName);
        this.$$defaultTarget = defaultTarget;
        this.$$value = value;
    }

    $$notify(result) {
        this.$$value = this.$$value;
        return result;
    }

    $$patchTo(target) {
        target = target || {};
        Object.keys(this).concat('$$notify').forEach((key) => {
            definedUnEnumerableProperty(target, key, this[key]);
        });

        return target;
    }
}

export const isObservable = (obj) => {
    return obj && obj.$$observable;
};

export const isAtom = (obj) => {
    return obj && obj.$$atom;
};
