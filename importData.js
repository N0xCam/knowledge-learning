const mongoose = require('mongoose');
require('dotenv').config();

const Theme = require('./app/models/Theme');
const Cursus = require('./app/models/Cursus');
const Lesson = require('./app/models/Lesson');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');

    await Theme.deleteMany();
    await Cursus.deleteMany();
    await Lesson.deleteMany();

    // Themes
    const themes = await Theme.insertMany([
      { title: 'Musique' },
      { title: 'Informatique' },
      { title: 'Jardinage' },
      { title: 'Cuisine' }
    ]);

    // IDS
    const [musique, info, jardin, cuisine] = themes;

    // Cursus
    const cursus = await Cursus.insertMany([
      {
        title: 'Cursus d’initiation à la guitare',
        price: 50,
        theme: musique._id
      },
      {
        title: 'Cursus d’initiation au piano',
        price: 50,
        theme: musique._id
      },
      {
        title: 'Cursus d’initiation au développement web',
        price: 60,
        theme: info._id
      },
      {
        title: 'Cursus d’initiation au jardinage',
        price: 30,
        theme: jardin._id
      },
      {
        title: 'Cursus d’initiation à la cuisine',
        price: 44,
        theme: cuisine._id
      },
      {
        title: 'Cursus d’initiation à l’art du dressage culinaire',
        price: 48,
        theme: cuisine._id
      }
    ]);

    // Lessons
    const lessons = [
      // Music
      { title: 'Découverte de l’instrument', price: 26, cursus: cursus[0]._id },
      { title: 'Les accords et les gammes', price: 26, cursus: cursus[0]._id },
      { title: 'Découverte de l’instrument', price: 26, cursus: cursus[1]._id },
      { title: 'Les accords et les gammes', price: 26, cursus: cursus[1]._id },

      // Computing
      { title: 'Les langages Html et CSS', price: 32, cursus: cursus[2]._id },
      { title: 'Dynamiser votre site avec Javascript', price: 32, cursus: cursus[2]._id },

      // Gardening
      { title: 'Les outils du jardinier', price: 16, cursus: cursus[3]._id },
      { title: 'Jardiner avec la lune', price: 16, cursus: cursus[3]._id },

      // Cooking
      { title: 'Les modes de cuisson', price: 23, cursus: cursus[4]._id },
      { title: 'Les saveurs', price: 23, cursus: cursus[4]._id },
      { title: 'Mettre en œuvre le style dans l’assiette', price: 26, cursus: cursus[5]._id },
      { title: 'Harmoniser un repas à quatre plats', price: 26, cursus: cursus[5]._id },
    ];

    await Lesson.insertMany(lessons);

    process.exit();
  } catch (err) {
    console.error('❌ Erreur lors de l’import :', err);
    process.exit(1);
  }
};

run();
