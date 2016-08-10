export default {
  demo: 'http://127.0.0.1:5984/uwazi_demo',
  development: process.env.COUCHDB_URL || 'http://127.0.0.1:5984/uwazi_development',
  testing: 'http://127.0.0.1:5984/uwazi_testing',
  production: 'http://127.0.0.1:5984/uwazi'
};
