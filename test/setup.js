// test/setup.js
const chai = require('chai');
let chaiHttp = require('chai-http');

// Certaines versions exportent le plugin sous default
chaiHttp = chaiHttp.default || chaiHttp;

chai.use(chaiHttp);

const app = require('../server');

// Globals
global.expect = chai.expect;
global.chai = chai;

// ⚠️ Ici on ne met pas chai.request direct (ça casse dans certaines versions)
global.request = (server) => chai.request(server);

global.app = app;
