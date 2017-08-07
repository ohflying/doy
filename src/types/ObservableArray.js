/* @flow */

import ObservableObject from './ObservableObject';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';
import getPrototypeOf from '../utils/getPrototypeOf';

export default class ObservableArray extends ObservableObject {
    constructor(defaultTarget: Array<*>, targetName: string, parent: ?ObservableObject) {
        super(defaultTarget, targetName, parent, true, defaultTarget);
    }

    pop() {
        return this.$$notify(getPrototypeOf(this, 'pop').bind(this)());
    }

    push(items: any): number {
        return this.$$notify(getPrototypeOf(this, 'push').bind(this)(items));
    }

    reverse() {
        return this.$$notify(getPrototypeOf(this, 'reverse').bind(this)());
    }

    shift() {
        return this.$$notify(getPrototypeOf(this, 'shift').bind(this)());
    }

    splice(start: number, deleteCount: number, items: Array<*>): Array<*> {
        if (items) {
            return this.$$notify(getPrototypeOf(this, 'splice').bind(this)(start, deleteCount, items));
        } else {
            return this.$$notify(getPrototypeOf(this, 'splice').bind(this)(start, deleteCount));
        }
    }

    unshift(items: Array<*>): number {
        return this.$$notify(getPrototypeOf(this, 'unshift').bind(this)(items));
    }

    $$patchTo(target: Object) {
        target = target || [];
        super.$$patchTo(target);
        ['pop', 'push', 'reverse', 'shift', 'splice', 'unshift'].forEach((key) => {
            //$FlowIgnore
            definedUnEnumerableProperty(target, key, this[key]);
        });

        return target;
    }
}
