const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for dotenv
config.resolver.sourceExts.push('cjs');

module.exports = config;
