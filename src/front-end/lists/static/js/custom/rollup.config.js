// rollup.config.js
export default [
    {
        input: 'pages/home/main.js',
        output: {
            file: 'dist/home.bundle.js',
            format: 'iife',
            compact: true,
        }
    },
    {
        input: 'pages/login/main.js',
        output: {
            file: 'dist/login.bundle.js',
            format: 'iife',
            compact: true,
        }
    },
    {
        input: 'pages/tags/main.js',
        output: {
            file: 'dist/tags.bundle.js',
            format: 'iife',
            compact: true,
        }
    },
  ];