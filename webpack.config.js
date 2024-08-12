const path = require('path');

module.exports = {
    entry: [
        './src/firebase.js',
        './src/auth.js'
    ], // Your entry point
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'bundle.js'
    },
    mode: 'development'
};
