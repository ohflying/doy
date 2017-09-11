/* @flow */

export default function atom(obj: Object): Object {
    return Object.assign(obj, {'$$atom': true});
}
