const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        main: [
            './src/firebase.js',
            './src/auth.js',
            './src/main.js',
            './src/profile.js',
            './src/account.js',
            './src/sudo.js'
        ],
        serviceWorker: './src/service-worker.js'
    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'public/system'), // Output directory
        filename: '[name].bundle.js'
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'public/system/serviceWorker.bundle.js'), to: '../service-worker.js' }
            ]
        })
    ]
};
