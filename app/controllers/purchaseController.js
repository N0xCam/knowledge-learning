const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Cursus = require('../models/Cursus');
const Lesson = require('../models/Lesson');
const Purchase = require('../models/Purchase');

// Achat d'une leçon via Stripe
exports.purchaseLesson = async (req, res) => {
  const userId = req.session.user?._id;
  const { lessonId } = req.params;

  if (!userId) return res.status(401).send('Non autorisé');

  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).send('Leçon non trouvée');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `Leçon : ${lesson.title}` },
          unit_amount: Math.round(lesson.price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/purchase/success/lesson/${lesson._id}`,
      cancel_url: `${req.protocol}://${req.get('host')}/client/cursus/${lesson.cursus}`,
    });

    res.redirect(session.url);
  } catch (error) {
    console.error('❌ Erreur Stripe lesson:', error);
    res.status(500).send('Erreur paiement');
  }
};

// Confirmer achat leçon
exports.confirmLessonPurchase = async (req, res) => {
  const userId = req.session.user?._id;
  const { lessonId } = req.params;

  if (!userId) return res.status(401).send('Non autorisé');

  try {
    const existing = await Purchase.findOne({ user: userId, lesson: lessonId });
    if (!existing) {
      await Purchase.create({ user: userId, lesson: lessonId, type: 'lesson' });
    }

    res.send('✅ Achat confirmé ! Tu peux accéder à la leçon.');
  } catch (error) {
    console.error('❌ Erreur confirmation lesson :', error);
    res.status(500).send('Erreur serveur');
  }
};

// Achat cursus complet
exports.purchaseCursus = async (req, res) => {
  const userId = req.session.user?._id;
  const { cursusId } = req.params;

  if (!userId) return res.status(401).send('Non autorisé');

  try {
    const cursus = await Cursus.findById(cursusId);
    if (!cursus) return res.status(404).send('Cursus non trouvé');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `Cursus : ${cursus.title}` },
          unit_amount: Math.round(cursus.price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/purchase/success/cursus/${cursus._id}`,
      cancel_url: `${req.protocol}://${req.get('host')}/client/cursus/${cursus._id}`,
    });

    res.redirect(session.url);
  } catch (error) {
    console.error('❌ Erreur Stripe cursus:', error);
    res.status(500).send('Erreur paiement');
  }
};

// Confirmer achat cursus
exports.confirmCursusPurchase = async (req, res) => {
  const userId = req.session.user?._id;
  const { cursusId } = req.params;

  if (!userId) return res.status(401).send('Non autorisé');

  try {
    const existing = await Purchase.findOne({ user: userId, cursus: cursusId });
    if (!existing) {
      await Purchase.create({ user: userId, cursus: cursusId, type: 'cursus' });
    }

    res.send('✅ Achat du cursus confirmé !');
  } catch (error) {
    console.error('❌ Erreur confirmation cursus :', error);
    res.status(500).send('Erreur serveur');
  }
};
