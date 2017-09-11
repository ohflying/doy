module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": ["standard", "plugin:react/recommended", "plugin:flowtype/recommended"],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "globalReturn": false
        },
        "sourceType": "module"
    },
    "plugins": [
        "standard",
        "react",
        "flowtype"
    ],
    "settings": {
        "flowtype": {
            "onlyFilesWithFlowAnnotation": true
        }
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": 0,
        "space-before-function-paren": [0, "always"],
        "spaced-comment": [0, "always"]
    }
};
