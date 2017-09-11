/* @flow */
import ObservableObject from './ObservableObject';
import getProperty from '../utils/getProperty';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

//$FlowIgnore
export default class ObservableSet extends ObservableObject<Set<*>> {
    constructor(defaultTarget: Set<*>, targetName: string, parent: ?ObservableObject<*>) {
        super(defaultTarget, targetName, parent, true, defaultTarget);
    }

    add(value: any): any {
        return this.$$notify(getProperty(Object.getPrototypeOf(this), 'add').bind(this)(value));
    }

    clear(): any {
        return this.$$notify(getProperty(Object.getPrototypeOf(this), 'clear').bind(this)());
    }

    delete(value: any): any {
        return this.$$notify(getProperty(Object.getPrototypeOf(this), 'delete').bind(this)(value));
    }

    $$patchTo(target: Set<*>): Set<*> {
        target = target || new Set();
        super.$$patchTo(target);
        ['add', 'clear', 'delete'].forEach((key) => {
            definedUnEnumerableProperty(target, key, getProperty(this, key));
        });

        return target;
    }
}
