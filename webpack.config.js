const path = require('path');

module.exports = {
    entry: {
        main: [
            './src/firebase.js',
            './src/auth.js',
            './src/main.js',
            './src/profile.js',
            './src/account.js'
        ],
        serviceWorker: './src/service-worker.js'
    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'public/system'), // Output directory
        filename: '[name].bundle.js'
    }
};
