**1. Présentation du projet Knowledge Learning**

Knowledge Learning est une plateforme e-learning moderne permettant aux utilisateurs de :
- Créer un compte et activer leur profil par mail
- Acheter des cursus et des leçons en ligne
- Suivre et valider leurs apprentissages
- Accéder à leurs certifications

Le projet a été réalisé dans le cadre du Titre Professionnel Développeur Web et Web Mobile.

**2. Fonctionnalités principales**

Authentification sécurisée (inscription, activation par mail, connexion)
Gestion des rôles : admin, client, autre
E-commerce intégré : achat de cursus et leçons
Base de données MongoDB structurée autour des thèmes, cursus et leçons
Validation des cursus et affichage des certifications

**3. Tests unitaires (Mocha, Chai) sur :**

Création d’utilisateur
Connexion
Achat de cursus
Modèles Mongoose (User, Cursus, Lesson)

**4. Technologies utilisées**

Node.js / Express (backend, routes API & logique métier)
MongoDB + Mongoose (base de données NoSQL)
EJS (templates côté serveur)
CSS avec charte graphique dédiée
Mailtrap pour l'envoi des mails automatiques
Stripe pour le paiement
Mocha / Chai / Chai-HTTP (tests unitaires et fonctionnels)
JSDoc (documentation du code)

**5. Installation**

1) Cloner le repo :
git clone : https://github.com/N0xCam/knowledge-learning.git
cd knowledge-learning

2) Installer les dépendances :
npm install

3) Configurer les variables d’environnement :
Créer un fichier .env à la racine :

MONGO_URI=mongodb://localhost:27017/knowledge-learning
PORT=3000

**Intégration Mailtrap (envoi d’emails de validation)**

L’application utilise Mailtrap comme service SMTP pour capturer et visualiser les emails envoyés lors des tests :
Lorsqu’un utilisateur s’inscrit, un email d’activation est automatiquement généré et envoyé sur la sandbox Mailtrap.
Le lien contenu dans le mail permet d’activer le compte et d’accéder à la plateforme.
*Configuration :*
Les identifiants Mailtrap (hôte, port, user, pass) sont stockés dans le fichier .env :

MAIL_HOST=sandbox.smtp.mailtrap.io  
MAIL_PORT=2525  
MAIL_USER=e2631bebfee232
MAIL_PASS=bcfa09e3c5d0a4 
MAIL_FROM="Knowledge Learning <no-reply@knowledge.local>"  

💡 Ce compte Mailtrap a été créé uniquement pour la soutenance. En production, l’envoi d’emails serait réalisé via un service SMTP réel (ex. Gmail, SendGrid, Mailgun).

**Intégration Stripe (paiement sécurisé)**

La partie e-commerce repose sur Stripe, utilisé pour simuler les paiements des cursus et leçons.
Lorsqu’un utilisateur choisit un cursus, Stripe génère une session de paiement.
Une fois la transaction confirmée, la base de données met à jour les achats et débloque l’accès au contenu.
*Configuration :*
Dans .env :

STRIPE_SECRET_KEY=sk_test_51RywNsCc7vGdkuD2U4iRjV9Gl8XNkcBOJFMRCz1Ns63dRB0WQg6eEqeZXuIlBfR4xvobvek92BOiZsONqcfpps5j005yzk0PTc
STRIPE_PUBLIC_KEY=pk_test_51RywNsCc7vGdkuD2Xul2aativ3yPcLJa42YJBNTwGmTY2FewkM0TLgNc5fTjgnImlXdkVxYVwy0sMSTLHlM1FOUb00CO5YUzSK

Les clés Stripe utilisées ici sont de test.
Aucune donnée bancaire réelle n’est manipulée — les transactions sont simulées via l’environnement de test Stripe.

4) Importer les données de démonstration :
node importdata.js

**6. Comptes inclus :**

Sly (admin) → sly@demo.com / admin123
Caly (client) → caly@demo.com / client123

**7. Lancement**

Mode développement :
npm run dev

Mode production :
npm start

Par défaut : http://localhost:3000

**8. Tests unitaires**

Lancer tous les tests :
npm test

Tests couverts :
Inscription et activation d’un utilisateur
Connexion d’un utilisateur actif
Achat d’un cursus
Sécurité et validation des modèles (User, Cursus, Lesson)

**9. Documentation**

La documentation du code est générée avec JSDoc.

Générer la doc :
npm run docs

La doc se trouve ensuite dans /docs.

**10. Structure du projet**

knowledge-learning/
│── app/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── views/
│── public/
│── test/
│── importdata.js
│── server.js
│── README.md

Note : Les secrets (Mailtrap, Stripe, etc.) sont indiqués en clair car ce projet est un exercice d’étude. En conditions réelles, ils seraient stockés dans des variables d’environnement sécurisées et jamais publiés.


