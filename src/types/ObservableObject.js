/**
 * Author: Jeejen.Dong
 * Date  : 17/2/22
 **/

import transformName from '../utils/transformName';

export default class ObservableObject {
    constructor(defaultTarget: object, targetName: string = "", parent: ObservableObject = null) {
        this.$$observable = true;
        this.$$atom = (defaultTarget || {}).$$atom;
        this.$$parent = parent;
        this.$$targetName = targetName;
        this.$$name = transformName(parent.$$name, targetName);
        this.$$defaultTarget = defaultTarget;
        this.$$ignoreProps = [];
        this._cloneToSelf(defaultTarget);
    }

    _cloneToSelf(defaultTarget: Object) {
        if (!defaultTarget) {
            return;
        }

        Object.keys(defaultTarget).forEach((key) => {
            if (!this.hasOwnProperty(key)) {
                this[key] = defaultTarget[key];
            }
        });
    }

    isAtom() {
        return this.$$atom;
    }
}

export const isObservable = (obj) => {
    return obj && obj.$$observable;
};