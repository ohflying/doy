/**
 * Author: Jeejen.Dong
 * Date  : 17/3/2
 **/
import ObservableObject from './ObservableObject';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

export default class ObservableSet extends ObservableObject {
    constructor(defaultTarget: Set, targetName: String, parent: ObservableObject) {
        super(defaultTarget, targetName, parent, true, defaultTarget);
    }

    add(value) {
        return this.$$notify(Object.getPrototypeOf(this).add.bind(this)(value));
    }

    clear() {
        return this.$$notify(Object.getPrototypeOf(this).clear.bind(this)());
    }

    delete(value) {
        return this.$$notify(Object.getPrototypeOf(this).delete.bind(this)(value));
    }

    $$patchTo(target) {
        target = target || new Set();
        super.$$patchTo(target);
        ['add', 'clear', 'delete'].forEach((key) => {
            definedUnEnumerableProperty(target, key, this[key]);
        });

        return target;
    }
}