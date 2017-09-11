/* @flow */

import ObservableObject from './ObservableObject';
import getProperty from '../utils/getProperty';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

//$FlowIgnore
export default class ObservableArray extends ObservableObject<Array<*>> {
    constructor(defaultTarget: Array<*>, targetName: string, parent: ?ObservableObject<*>) {
        super(defaultTarget, targetName, parent, true, defaultTarget);
    }

    pop(): any {
        return this.$$notify(getProperty(Object.getPrototypeOf(this), 'pop').bind(this)());
    }

    push(items: any): number {
        return this.$$notify(getProperty(Object.getPrototypeOf(this), 'push').bind(this)(items));
    }

    reverse(): Array<*> {
        return this.$$notify(getProperty(Object.getPrototypeOf(this), 'reverse').bind(this)());
    }

    shift(): any {
        return this.$$notify(getProperty(Object.getPrototypeOf(this), 'shift').bind(this)());
    }

    splice(start: number, deleteCount: number, items: any): Array<*> {
        if (items) {
            return this.$$notify(getProperty(Object.getPrototypeOf(this), 'splice').bind(this)(start, deleteCount, items));
        } else {
            return this.$$notify(getProperty(Object.getPrototypeOf(this), 'splice').bind(this)(start, deleteCount));
        }
    }

    unshift(items: any): number {
        return this.$$notify(getProperty(Object.getPrototypeOf(this), 'unshift').bind(this)(items));
    }

    $$patchTo(target: Array<*>): Array<*> {
        target = target || [];
        super.$$patchTo(target);
        ['pop', 'push', 'reverse', 'shift', 'splice', 'unshift'].forEach((key) => {
            definedUnEnumerableProperty(target, key, getProperty(this, key));
        });

        return target;
    }
}
