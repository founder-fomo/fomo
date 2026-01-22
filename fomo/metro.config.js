const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to watch all files in the project directory
config.watchFolders = [__dirname];

module.exports = config;
