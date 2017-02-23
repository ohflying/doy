/**
 * Author: Jeejen.Dong
 * Date  : 17/2/16
 **/

import $Scope, {$rootScope} from './src/core/$Scope';
import extend from './src/core/extend';
import atom from './src/core/atom';

export default class Doy {
    static $rootScope: $Scope = $rootScope;
    static extend(option: Object): ReactComponent {
        return extend(option);
    }

    static atom(obj: Object): Object {
        return atom(obj);
    }
}