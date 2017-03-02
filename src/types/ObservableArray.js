/**
 * Author: Jeejen.Dong
 * Date  : 17/2/22
 **/

import ObservableObject from './ObservableObject';

export default class ObservableArray extends ObservableObject {
    constructor(defaultTarget: Object, targetName: string, parent: ObservableObject) {
        super(defaultTarget, targetName, parent);

        this.$$atom = true;
        this.$$value = this.$$defaultTarget;
    }

    $$cloneToSelf(defaultTarget: Object) {
    }

    pop() {
        return this.$$notify(this.$$value.pop());
    }

    push(items) {
        return this.$$notify(this.$$value.push(items));
    }

    reverse() {
        return this.$$notify(this.$$value.reverse());
    }

    shift() {
        return this.$$notify(this.$$value.shift());
    }

    splice(start, deleteCount, items) {
        if (items) {
            return this.$$notify(this.$$value.splice(start, deleteCount, items));
        } else {
            return this.$$notify(this.$$value.splice(start, deleteCount));
        }
    }

    unshift(items) {
        return this.$$notify(this.$$value.unshift(items))
    }
}