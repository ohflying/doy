/* @flow */

export default function shallowClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    let className = obj.constructor ? obj.constructor.name : '';

    if (className === 'Set' || className === 'Map') {
        return new obj.constructor(obj);
    } else {
        return Object.assign(new obj.constructor, obj); //eslint-disable-line
    }
}
