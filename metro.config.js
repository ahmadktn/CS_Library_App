const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { resolver } = config;

// Ensure consistent asset handling
config.resolver.assetExts = [
    ...resolver.assetExts,
    'txt',
    'pdf',
    'docx',
    'pptx',
];

module.exports = config;
