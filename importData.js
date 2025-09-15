const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Theme = require('./app/models/Theme');
const Cursus = require('./app/models/Cursus');
const Lesson = require('./app/models/Lesson');
const User = require('./app/models/User');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');

    await Theme.deleteMany();
    await Cursus.deleteMany();
    await Lesson.deleteMany();

    // === THEMES ===
    const themes = await Theme.insertMany([
      { title: 'Musique' },
      { title: 'Informatique' },
      { title: 'Jardinage' },
      { title: 'Cuisine' }
    ]);

    const [musique, info, jardin, cuisine] = themes;

    // === CURSUS ===
    const cursus = await Cursus.insertMany([
      { title: 'Cursus d’initiation à la guitare', price: 50, theme: musique._id },
      { title: 'Cursus d’initiation au piano', price: 50, theme: musique._id },
      { title: 'Cursus d’initiation au développement web', price: 60, theme: info._id },
      { title: 'Cursus d’initiation au jardinage', price: 30, theme: jardin._id },
      { title: 'Cursus d’initiation à la cuisine', price: 44, theme: cuisine._id },
      { title: 'Cursus d’initiation à l’art du dressage culinaire', price: 48, theme: cuisine._id }
    ]);

    // === LESSONS ===
    const lessons = [
      // Guitare
      { title: 'Leçon n°1 : Découverte de l’instrument', price: 26, cursus: cursus[0]._id },
      { title: 'Leçon n°2 : Les accords et les gammes', price: 26, cursus: cursus[0]._id },

      // Piano
      { title: 'Leçon n°1 : Découverte de l’instrument', price: 26, cursus: cursus[1]._id },
      { title: 'Leçon n°2 : Les accords et les gammes', price: 26, cursus: cursus[1]._id },

      // Web
      { title: 'Leçon n°1 : Les langages Html et CSS', price: 32, cursus: cursus[2]._id },
      { title: 'Leçon n°2 : Dynamiser votre site avec Javascript', price: 32, cursus: cursus[2]._id },

      // Gardenin
      { title: 'Leçon n°1 : Les outils du jardinier', price: 16, cursus: cursus[3]._id },
      { title: 'Leçon n°2 : Jardiner avec la lune', price: 16, cursus: cursus[3]._id },

      // Cooking
      { title: 'Leçon n°1 : Les modes de cuisson', price: 23, cursus: cursus[4]._id },
      { title: 'Leçon n°2 : Les saveurs', price: 23, cursus: cursus[4]._id },

      // Cooking with style
      { title: 'Leçon n°1 : Mettre en œuvre le style dans l’assiette', price: 26, cursus: cursus[5]._id },
      { title: 'Leçon n°2 : Harmoniser un repas à quatre plats', price: 26, cursus: cursus[5]._id },
    ];

    await Lesson.insertMany(lessons);

// === USERS ===
    const slyPassword = await bcrypt.hash('admin123', 10);
    const calyPassword = await bcrypt.hash('client123', 10);

    await User.insertMany([
      {
        name: 'Sly',
        email: 'sly@demo.com',
        password: slyPassword,
        role: 'admin',
        isActive: true
      },
      {
        name: 'Caly',
        email: 'caly@demo.com',
        password: calyPassword,
        role: 'client',
        isActive: true
      }
    ]);

    console.log('✅ Données importées avec succès (thèmes, cursus, leçons, users)');
    process.exit();
  } catch (err) {
    console.error('❌ Erreur lors de l’import :', err);
    process.exit(1);
  }
};

run();