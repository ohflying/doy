/* @flow */

export default function lazyLoad(thunk: Function): () => any {
    const _ = () => {
        let module = thunk();
        if (module && module.__esModule) {
            return module.default;
        }

        return module;
    };

    _._isLazy = true;
    return _;
}
