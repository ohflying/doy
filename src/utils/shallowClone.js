/**
 * Author: Jeejen.Dong
 * Date  : 17/3/10
 **/

export default function shallowClone(obj) {
    if (obj == null || typeof obj !== 'object') {
        return obj;
    }

    let className = obj.constructor ? obj.constructor.name : '';

    if (className == 'Set' || className == 'Map') {
        return Object.assign(new obj.constructor(obj), obj);
    } else {
        return Object.assign(new obj.constructor, obj);
    }
}