const path = require('path');

module.exports = {
    entry: [
        './src/firebase.js',
        './src/auth.js',
        './src/profile.js',
        './src/account.js'
    ],
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'public/system'), // Output directory
        filename: 'bundle.js'
    }
};
