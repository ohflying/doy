/**
 * Author: Jeejen.Dong
 * Date  : 17/3/13
 **/
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';

export default function extensible(obj: Object): Object {
    definedUnEnumerableProperty(obj, '$$extensible', true);
    return obj;
};
