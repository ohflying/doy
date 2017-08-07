/* @flow */

import ObservableObject from './ObservableObject';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';
import getPrototypeOf from '../utils/getPrototypeOf';

export default class ObservableSet extends ObservableObject {
    constructor(defaultTarget: Set<*>, targetName: string, parent: ?ObservableObject) {
        super(defaultTarget, targetName, parent, true, defaultTarget);
    }

    add(value: any) {
        return this.$$notify(getPrototypeOf(this, 'add').bind(this)(value));
    }

    clear() {
        return this.$$notify(getPrototypeOf(this, 'clear').bind(this)());
    }

    delete(value: any) {
        return this.$$notify(getPrototypeOf(this, 'delete').bind(this)(value));
    }

    $$patchTo(target: Object) {
        target = target || new Set();
        super.$$patchTo(target);
        ['add', 'clear', 'delete'].forEach((key) => {
            //$FlowIgnore
            definedUnEnumerableProperty(target, key, this[key]);
        });

        return target;
    }
}
