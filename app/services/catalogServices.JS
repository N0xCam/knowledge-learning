const themes = require('../data/themes');
const cursus = require('../data/cursus');
const lessons = require('../data/lessons');

function afficherCatalogue() {
  themes.forEach(theme => {
    console.log(`🎓 Thème : ${theme.name}`);

    const cursusDuTheme = cursus.filter(c => c.themeId === theme.id);
    cursusDuTheme.forEach(c => {
      console.log(`   📚 Cursus : ${c.name} - ${c.price}€`);

      const lecons = lessons.filter(l => l.cursusId === c.id);
      lecons.forEach((l, i) => {
        console.log(`      🎬 Leçon ${i + 1} : ${l.title} - ${l.price}€`);
      });
    });

    console.log(); 
  });
}

module.exports = { afficherCatalogue };
