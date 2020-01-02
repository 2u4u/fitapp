//This is used to proxy React app to Node based api
const proxy = require('http-proxy-middleware');

//IMPORTANT NOTE: secure false is to fix issue with UNABLE_TO_VERIFY_LEAF_SIGNATURE, need comment it or remove in dev

module.exports = function (app) {
  //API address
  app.use(proxy('/api', { target: 'https://[::1]:5000/', secure: false }));
  //Public address in case of storaing files locally
  app.use(proxy('/public', { target: 'https://[::1]:5000/', secure: false }));
};
