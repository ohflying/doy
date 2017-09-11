/* @flow */

import React from 'react';
import $Scope, {$rootScope} from './src/core/$Scope';
import DoyView from './src/view/DoyView';
import extend from './src/core/extend';
import atom from './src/core/atom';
import extensible from './src/core/extensible';
import why from './src/core/why';

export default class Doy {
    static $rootScope: $Scope = $rootScope;
    static DoyView = DoyView;
    static extend(option: ExtendOptions): React.Component<*, *, *> {
        return extend(option);
    }

    static atom(obj: Object): Object {
        return atom(obj);
    }

    static extensible(obj: Object): Object {
        return extensible(obj);
    }

    static why(enabled: boolean, printFn: Function) {
        return why(enabled, printFn);
    }
};
