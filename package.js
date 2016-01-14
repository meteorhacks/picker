Package.describe({
  name: 'meteorhacks:picker',
  summary: 'Server Side Router for Meteor',
  version: '1.0.3',
  git: 'https://github.com/meteorhacks/picker.git'
});

Npm.depends({
  'path-to-regexp': '1.0.1'
});

Package.onUse(function(api) {
  configurePackage(api);
  api.export(['Picker']);
});

Package.onTest(function(api) {
  configurePackage(api);
  api.use(['tinytest', 'http', 'random'], ['server']);
  api.addFiles([
    'test/instance.js'
  ], ['server']);
});

function configurePackage(api) {
  if(api.versionsFrom) {
    api.versionsFrom('METEOR@1.2');
  }

  api.use(['webapp', 'underscore'], ['server']);
  api.addFiles([
    'lib/implementation.js',
    'lib/instance.js',
  ], ['server']);
}
