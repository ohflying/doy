/* @flow */

export default function unwrapModule(module: any): any {
    if (module && module.__esModule) {
        return module.default;
    }

    return module;
}
