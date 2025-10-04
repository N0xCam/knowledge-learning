// importData.js (seed script for development/staging DBs)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env' }); // Load ONLY .env when seeding (never .env.test)

const Theme = require('./app/models/Theme');
const Cursus = require('./app/models/Cursus');
const Lesson = require('./app/models/Lesson');
const User = require('./app/models/User');

const run = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) throw new Error('Missing MONGO_URI/MONGODB_URI in .env');

    // Safety guard: never seed the test database
    const dbName = (() => {
      try { return new URL(uri).pathname.replace(/^\//,'').split('?')[0]; }
      catch { return uri.split('/').pop()?.split('?')[0]; }
    })();
    if (/test/i.test(dbName) || process.env.NODE_ENV === 'test') {
      throw new Error(`Refusing to seed test database: "${dbName}"`);
    }

    // Connect once, fail fast if unreachable
    await mongoose.connect(uri);
    console.log('✅ MongoDB connecté sur', dbName);

    // ⚠️ Destructive: wipe these collections before re-import
    await Theme.deleteMany({});
    await Cursus.deleteMany({});
    await Lesson.deleteMany({});
    // Do NOT touch other collections here (users handled explicitly below)

    // === THEMES ===
    const themes = await Theme.insertMany([
      { title: 'Musique' },
      { title: 'Informatique' },
      { title: 'Jardinage' },
      { title: 'Cuisine' }
    ]);
    const [musique, info, jardin, cuisine] = themes;

    // === CURSUS === (reference themes by _id)
    const cursus = await Cursus.insertMany([
      { title: 'Cursus d’initiation à la guitare', price: 50, theme: musique._id },
      { title: 'Cursus d’initiation au piano',    price: 50, theme: musique._id },
      { title: 'Cursus d’initiation au développement web', price: 60, theme: info._id },
      { title: 'Cursus d’initiation au jardinage', price: 30, theme: jardin._id },
      { title: 'Cursus d’initiation à la cuisine', price: 44, theme: cuisine._id },
      { title: 'Cursus d’initiation à l’art du dressage culinaire', price: 48, theme: cuisine._id }
    ]);

    // === LESSONS === (reference cursus by _id)
    const lessons = [
      { title: 'Leçon n°1 : Découverte de l’instrument',            price: 26, cursus: cursus[0]._id },
      { title: 'Leçon n°2 : Les accords et les gammes',             price: 26, cursus: cursus[0]._id },

      { title: 'Leçon n°1 : Découverte de l’instrument',            price: 26, cursus: cursus[1]._id },
      { title: 'Leçon n°2 : Les accords et les gammes',             price: 26, cursus: cursus[1]._id },

      { title: 'Leçon n°1 : Les langages Html et CSS',              price: 32, cursus: cursus[2]._id },
      { title: 'Leçon n°2 : Dynamiser votre site avec Javascript',  price: 32, cursus: cursus[2]._id },

      { title: 'Leçon n°1 : Les outils du jardinier',               price: 16, cursus: cursus[3]._id },
      { title: 'Leçon n°2 : Jardiner avec la lune',                 price: 16, cursus: cursus[3]._id },

      { title: 'Leçon n°1 : Les modes de cuisson',                  price: 23, cursus: cursus[4]._id },
      { title: 'Leçon n°2 : Les saveurs',                           price: 23, cursus: cursus[4]._id },

      { title: 'Leçon n°1 : Mettre en œuvre le style dans l’assiette',     price: 26, cursus: cursus[5]._id },
      { title: 'Leçon n°2 : Harmoniser un repas à quatre plats',           price: 26, cursus: cursus[5]._id },
    ];
    await Lesson.insertMany(lessons);

    // USERS 
    const slyPassword  = await bcrypt.hash('admin123', 10);
    const calyPassword = await bcrypt.hash('client123', 10);

    await User.updateOne(
      { email: 'sly@demo.com' },
      { $set: { name: 'Sly',  password: slyPassword,  role: 'admin',  isActive: true } },
      { upsert: true }
    );
    await User.updateOne(
      { email: 'caly@demo.com' },
      { $set: { name: 'Caly', password: calyPassword, role: 'client', isActive: true } },
      { upsert: true }
    );

    // Clean shutdown
    console.log('✅ Données importées avec succès (thèmes, cursus, leçons, users)');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    // Show concise message (stack is noisy for seed scripts)
    console.error('❌ Erreur lors de l’import :', err.message);
    process.exit(1);
  }
};

run();
