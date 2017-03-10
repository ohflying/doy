/**
 * Author: Jeejen.Dong
 * Date  : 17/2/22
 **/

import ObservableObject from './ObservableObject';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

export default class ObservableMap extends ObservableObject {
    constructor(defaultTarget: Map, targetName: String, parent: ObservableObject) {
        super(defaultTarget, targetName, parent, true, defaultTarget);
    }

    clear() {
        return this.$$notify(Object.getPrototypeOf(this).clear.bind(this)());
    }

    delete(key) {
        return this.$$notify(Object.getPrototypeOf(this).delete.bind(this)(key));
    }

    set(key,value) {
        return this.$$notify(Object.getPrototypeOf(this).set.bind(this)(key, value));
    }

    $$patchTo(target) {
        target = target || new Map();
        super.$$patchTo(target);
        ['clear', 'delete', 'set'].forEach((key) => {
            definedUnEnumerableProperty(target, key, this[key]);
        });

        return target;
    }
}