/* @flow */

import React from 'react';
import DoyView from '../view/DoyView';

export default function extend(options: ExtendOptions): React.Component<*, *, *> {
    class _DoyView extends DoyView {
        constructor(props, context) {
            super(props, context, options);

            if (options.inheritor) {
                options.inheritor(this.$scope, this.$scope.store, this);
            }
        }

        render() {
            return super.renderAction(options.template);
        }
    }

    _DoyView.displayName = options.name;

    //$FlowIgnore
    return _DoyView;
}
