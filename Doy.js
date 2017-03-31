/**
 * Author: Jeejen.Dong
 * Date  : 17/2/16
 **/

import $Scope, {$rootScope} from './src/core/$Scope';
import extend from './src/core/extend';
import atom from './src/core/atom';
import extensible from './src/core/extensible';
import why from './src/core/why';

export default class Doy {
    static $rootScope: $Scope = $rootScope;
    static extend(option: Object): ReactComponent {
        return extend(option);
    }

    static atom(obj: Object): Object {
        return atom(obj);
    }

    static extensible(obj: Object): Object {
        return extensible(obj);
    }

    static why(enabled: Boolean, printFn: Function) {
        return why(enabled, printFn);
    }
};
