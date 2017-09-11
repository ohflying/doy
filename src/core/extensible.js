/* @flow */
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

export default function extensible(obj: Object): Object {
    definedUnEnumerableProperty(obj, '$$extensible', true);
    return obj;
};
