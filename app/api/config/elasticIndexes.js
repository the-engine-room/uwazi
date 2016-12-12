const INDEX_NAME = process.env.INDEX_NAME;

export default {
  production: INDEX_NAME ? INDEX_NAME  :'uwazi',
  development: INDEX_NAME ? INDEX_NAME  :'uwazi_development',
  demo: INDEX_NAME ? INDEX_NAME  :'uwazi_demo'
};
