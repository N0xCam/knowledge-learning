// test/setup.js
const mongoose = require('mongoose');
const supertest = require('supertest');

// Load test env first (no .env here to avoid overriding test vars)
require('dotenv').config({ path: '.env.test', override: true });

// Import the app (this triggers mongoose.connect in server.js)
const app = require('../server');

// Wait until mongoose has actually connected before running tests
async function waitForMongoose() {
  if (mongoose.connection.readyState === 1) return; // already connected
  await new Promise((resolve, reject) => {
    const onOpen = () => { cleanup(); resolve(); };
    const onErr = (err) => { cleanup(); reject(err); };
    const cleanup = () => {
      mongoose.connection.off('open', onOpen);
      mongoose.connection.off('error', onErr);
    };
    mongoose.connection.once('open', onOpen);
    mongoose.connection.once('error', onErr);
  });
}

// Mocha root hooks
exports.mochaHooks = {
  async beforeAll() {
    await waitForMongoose();
    global.request = supertest.agent(app); // keep cookies (sessions) across requests
  },
  async afterAll() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};
