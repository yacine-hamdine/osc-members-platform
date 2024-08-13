const path = require('path');

module.exports = {
    entry: [
        './src/firebase.js',
        './src/auth.js'
    ],
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'public/system'), // Output directory
        filename: 'bundle.js'
    }
};
