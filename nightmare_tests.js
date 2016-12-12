require('babel-core/register')({
  presets: ['es2015', 'react'],
  plugins: [
    ['babel-plugin-module-alias', [
      {src: './app/react', expose: 'app'},
      {src: './app/shared', expose: 'shared'},
      {src: './app/api', expose: 'api'}
    ]],
    'transform-class-properties',
    'add-module-exports'
  ]
});

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var reporters = require('jasmine-reporters');

var dbConfig = require('./app/api/config/database.js');
dbConfig.db_url = dbConfig.development;

jasmine.loadConfig({
  spec_dir: '/',
  spec_files: [
    'nightmare/helpers/extensions.js',
    'nightmare/**/*.spec.js'
  ]
});

jasmine.addReporter(new reporters.TerminalReporter({
  verbosity: 2,
  color: true,
  showStack: true
}));

jasmine.execute();
