// import the babel plugins
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

// common plugins
const myPlugins =  [resolve(), babel({ babelHelpers: 'bundled' })];

// rollup.config.js
export default 
[
    {
        input: 'pages/home/main.js',
        output: {
            file: 'dist/home.bundle.js',
            format: 'iife',
            compact: true,
            sourcemap: true,
        },
        plugins: myPlugins,
    },
    {
        input: 'pages/login/main.js',
        output: {
            file: 'dist/login.bundle.js',
            format: 'iife',
            compact: true,
            sourcemap: true,
        },
        plugins: myPlugins,
    },
    {
        input: 'pages/tags/main.js',
        output: {
            file: 'dist/tags.bundle.js',
            format: 'iife',
            compact: true,
            sourcemap: true,
        },
        plugins: myPlugins,
    },
];