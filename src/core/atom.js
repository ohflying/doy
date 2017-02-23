/**
 * Author: Jeejen.Dong
 * Date  : 17/2/21
 **/

export default function atom(obj: Object): Object {
    return Object.assign(obj, {"$$atom": true});
}