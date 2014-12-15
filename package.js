Package.describe({
  "summary": "Server Side Router for Meteor",
  "version": "1.0.0",
  "git": "https://github.com/meteorhacks/picker.git",
  "name": "meteorhacks:picker"
});

Npm.depends({
  "path-to-regexp": "1.0.1"
});

Package.on_use(function(api) {
  configurePackage(api);
  api.export(['Picker']);
});

Package.on_test(function(api) {
  configurePackage(api);

  api.use(['tinytest', 'http'], ['server']);
  api.add_files([
    'test/instance.js'
  ], ['server']);
});

function configurePackage(api) {
  if(api.versionsFrom) {
    api.versionsFrom('METEOR@0.9.0');
  }
  
  api.use(['webapp', 'underscore'], ['server']);
  api.add_files([
    'lib/implementation.js',
    'lib/instance.js',
  ], ['server']);
}