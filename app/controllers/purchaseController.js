// Purchase controller: handles Stripe checkout flows and post-payment UX.
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Cursus = require('../models/Cursus');
const Lesson = require('../models/Lesson');
const Purchase = require('../models/Purchase');

// Test flag + configurable visual delay for the success screen
const isTest = process.env.NODE_ENV === 'test';
const REDIRECT_DELAY_MS = Number(process.env.PURCHASE_REDIRECT_DELAY_MS || 10000);

/**
 * Send a lightweight "processing" page that auto-redirects after a delay.
 * - In test mode, skip the wait and perform a normal redirect (keeps tests fast).
 * - In non-test mode, returns an HTML page with:
 *   - meta refresh (fallback)
 *   - JS redirect (primary)
 *   - a spinner + link in case auto-redirect fails
 */
function delayedRedirect(res, url, ms, { title = 'Traitement en cours…', msg = '' } = {}) {
  if (isTest) return res.redirect(url);

  const sec = Math.ceil(ms / 1000);
  const html = `<!DOCTYPE html>
<html lang="fr"><head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta http-equiv="refresh" content="${sec};url=${url}">
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#f0f7fb;color:#0f3358;margin:0;padding:0;display:flex;align-items:center;justify-content:center;min-height:100vh}
    .card{background:#fff;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.08);padding:24px;max-width:520px;text-align:center}
    .spinner{width:36px;height:36px;border:4px solid #e6eef5;border-top-color:#0d6efd;border-radius:50%;margin:12px auto 8px;animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .small{opacity:.7;font-size:.9rem}
    a{color:#0d6efd;text-decoration:none}
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h1>${title}</h1>
    <p>${msg || `Tu vas être redirigé(e) dans <strong>${sec}s</strong>…`}</p>
    <p class="small">Si rien ne se passe, <a href="${url}">clique ici</a>.</p>
  </div>
  <script>setTimeout(function(){ location.href=${JSON.stringify(url)}; }, ${ms});</script>
</body></html>`;
  return res.status(200).send(html);
}

// ---------------- LESSON ----------------

/**
 * Create a Stripe Checkout session to purchase a lesson.
 * Redirects user to Stripe's hosted payment page.
 */
exports.purchaseLesson = async (req, res) => {
  const userId = req.session.user?._id;
  const { lessonId } = req.params;
  if (!userId) return res.status(401).send('Non autorisé');

  try {
    // Ensure lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).send('Leçon non trouvée');

    // Create one-time checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `Leçon : ${lesson.title}` },
          unit_amount: Math.round(lesson.price * 100), // cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/purchase/success/lesson/${lesson._id}`,
      cancel_url: `${req.protocol}://${req.get('host')}/client/cursus/${lesson.cursus}`,
    });

    // Off to Stripe
    res.redirect(session.url);
  } catch (error) {
    console.error('❌ Erreur Stripe lesson:', error);
    res.status(500).send('Erreur paiement');
  }
};

/**
 * Confirm lesson purchase after Stripe success.
 * Idempotent: will not duplicate a Purchase if it already exists.
 * Shows a short "processing" page, then redirects back to the lesson.
 */
exports.confirmLessonPurchase = async (req, res) => {
  const userId = req.session.user?._id;
  const { lessonId } = req.params;
  if (!userId) return res.status(401).send('Non autorisé');

  try {
    // Upsert-like behavior: create only if missing
    const existing = await Purchase.findOne({ user: userId, lesson: lessonId });
    if (!existing) {
      await Purchase.create({ user: userId, lesson: lessonId, type: 'lesson' });
    }

    // Visual delay (skipped in tests), then go back to lesson page
    const backUrl = `/client/lessons/${lessonId}`;
    return delayedRedirect(res, backUrl, REDIRECT_DELAY_MS, {
      title: 'Achat confirmé ✅',
      msg: 'Tu vas être redirigé(e) vers la leçon.'
    });
  } catch (error) {
    console.error('❌ Erreur confirmation lesson :', error);
    res.status(500).send('Erreur serveur');
  }
};

// ---------------- CURSUS ----------------

/**
 * Create a Stripe Checkout session to purchase a cursus.
 * Redirects user to Stripe's hosted payment page.
 */
exports.purchaseCursus = async (req, res) => {
  const userId = req.session.user?._id;
  const { cursusId } = req.params;
  if (!userId) return res.status(401).send('Non autorisé');

  try {
    // Ensure cursus exists
    const cursus = await Cursus.findById(cursusId);
    if (!cursus) return res.status(404).send('Cursus non trouvé');

    // Create one-time checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `Cursus : ${cursus.title}` },
          unit_amount: Math.round(cursus.price * 100), // cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/purchase/success/cursus/${cursus._id}`,
      cancel_url: `${req.protocol}://${req.get('host')}/client/cursus/${cursus._id}`,
    });

    // Off to Stripe
    res.redirect(session.url);
  } catch (error) {
    console.error('❌ Erreur Stripe cursus:', error);
    res.status(500).send('Erreur paiement');
  }
};

/**
 * Confirm cursus purchase after Stripe success.
 * Idempotent: will not duplicate a Purchase if it already exists.
 * Shows a short "processing" page, then redirects back to the cursus page.
 */
exports.confirmCursusPurchase = async (req, res) => {
  const userId = req.session.user?._id;
  const { cursusId } = req.params;
  if (!userId) return res.status(401).send('Non autorisé');

  try {
    // Upsert-like behavior: create only if missing
    const existing = await Purchase.findOne({ user: userId, cursus: cursusId });
    if (!existing) {
      await Purchase.create({ user: userId, cursus: cursusId, type: 'cursus' });
    }

    // Visual delay (skipped in tests), then go back to cursus page
    const backUrl = `/client/cursus/${cursusId}`;
    return delayedRedirect(res, backUrl, REDIRECT_DELAY_MS, {
      title: 'Achat du cursus confirmé ✅',
      msg: 'Tu vas être redirigé(e) vers le cursus.'
    });
  } catch (error) {
    console.error('❌ Erreur confirmation cursus :', error);
    res.status(500).send('Erreur serveur');
  }
};
