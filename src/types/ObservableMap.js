/**
 * Author: Jeejen.Dong
 * Date  : 17/2/22
 **/

import ObservableObject from './ObservableObject';

export default class ObservableMap extends ObservableObject {
    constructor(defaultTarget: Object, targetName: String, parent: ObservableObject) {
        super(defaultTarget, targetName, parent);

        this.$$atom = true;
    }

    _cloneToSelf(defaultTarget) {
        super._cloneToSelf(defaultTarget);

        for(let [key, value] of defaultTarget.entries()) {
            this.set(key, value);
        }
    }
}