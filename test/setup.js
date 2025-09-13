// test/setup.js
const chai = require('chai');
let chaiHttp = require('chai-http');

// Some versions of chai-http export the plugin under `default`
chaiHttp = chaiHttp.default || chaiHttp;

// Enable chai-http plugin
chai.use(chaiHttp);

const app = require('../server');

// Make globals available to all tests
global.expect = chai.expect;
global.chai = chai;

// Important: wrap chai.request so it works across versions
global.request = (server) => chai.request(server);

// Expose the app for tests
global.app = app;
