const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = {
  resolver: {
    assetExts: ['dotlottie', 'png', 'jpg', 'gif'],
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'dotlottie'],
  },
};

module.exports = mergeConfig(
  wrapWithReanimatedMetroConfig(getDefaultConfig(__dirname)),
  config,
);
