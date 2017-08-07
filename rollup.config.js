import babel from 'rollup-plugin-babel';

export default {
    entry: './src/index.js',
    format: 'cjs',
    sourceMap: true,
    dest: 'cjs/doy.development.js',
    plugins: [
        babel({
            presets: [['es2015', { modules: false }], 'stage-0', 'react'],
            plugins: ['external-helpers'],
            exclude: 'node_modules/**',
            babelrc: false
        })
    ],
    external: ['react']
};
