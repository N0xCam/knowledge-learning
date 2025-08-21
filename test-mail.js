require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

transporter.sendMail({
  from: process.env.MAIL_FROM,
  to: 'test@example.com',
  subject: '🔔 Test de Mailtrap',
  html: '<h1>Ça fonctionne ! 🎉</h1><p>Mail envoyé depuis test-mail.js</p>'
})
.then(() => console.log('📨 Email envoyé avec succès !'))
.catch(err => console.error('💥 Erreur Mailtrap :', err));
