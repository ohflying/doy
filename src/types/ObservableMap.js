/* @flow */

import ObservableObject from './ObservableObject';
import getProperty from '../utils/getProperty';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

//$FlowIgnore
export default class ObservableMap extends ObservableObject<Map<*, *>> {
    constructor(defaultTarget: Map<*, *>, targetName: string, parent: ?ObservableObject<*>) {
        super(defaultTarget, targetName, parent, true, defaultTarget);
    }

    clear(): any {
        return this.$$notify(getProperty(Object.getPrototypeOf(this), 'clear').bind(this)());
    }

    delete(key: any): any {
        return this.$$notify(getProperty(Object.getPrototypeOf(this), 'delete').bind(this)(key));
    }

    set(key: any, value: any): any {
        return this.$$notify(getProperty(Object.getPrototypeOf(this), 'set').bind(this)(key, value));
    }

    $$patchTo(target: Map<*, *>): Map<*, *> {
        target = target || new Map();
        super.$$patchTo(target);
        ['clear', 'delete', 'set'].forEach((key) => {
            definedUnEnumerableProperty(target, key, getProperty(this, key));
        });

        return target;
    }
}
