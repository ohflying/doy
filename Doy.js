/**
 * Author: Jeejen.Dong
 * Date  : 17/2/16
 **/

import $Scope, {$rootScope} from './core/$Scope';
import extend from './core/extend';
import atom from './core/atom';

export default class Doy {
    static $rootScope: $Scope = $rootScope;
    static extend(option: Object): ReactComponent {
        return extend(option);
    }

    static atom(obj: Object): Object {
        return atom(obj);
    }
}