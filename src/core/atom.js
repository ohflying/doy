/* @flow */

export default function atom<T>(obj: Object): Object {
    return Object.assign(obj, {'$$atom': true});
}
