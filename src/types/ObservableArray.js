/**
 * Author: Jeejen.Dong
 * Date  : 17/2/22
 **/

import ObservableObject from './ObservableObject';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

export default class ObservableArray extends ObservableObject {
    constructor(defaultTarget: Object, targetName: string, parent: ObservableObject) {
        super(defaultTarget, targetName, parent, true, defaultTarget);
    }

    pop() {
        return this.$$notify(Object.getPrototypeOf(this).pop.bind(this)());
    }

    push(items) {
        return this.$$notify(Object.getPrototypeOf(this).push.bind(this)(items));
    }

    reverse() {
        return this.$$notify(Object.getPrototypeOf(this).reverse.bind(this)());
    }

    shift() {
        return this.$$notify(Object.getPrototypeOf(this).shift.bind(this)());
    }

    splice(start, deleteCount, items) {
        if (items) {
            return this.$$notify(Object.getPrototypeOf(this).splice.bind(this)(start, deleteCount, items));
        } else {
            return this.$$notify(Object.getPrototypeOf(this).splice.bind(this)(start, deleteCount));
        }
    }

    unshift(items) {
        return this.$$notify(Object.getPrototypeOf(this).unshift.bind(this)(items))
    }

    $$patchTo(target) {
        target = target || [];
        super.$$patchTo(target);
        ['pop', 'push', 'reverse', 'shift', 'splice', 'unshift'].forEach((key) => {
            definedUnEnumerableProperty(target, key, this[key]);
        });

        return target;
    }
}