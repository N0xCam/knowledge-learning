1. Présentation du projet Knowledge Learning

Knowledge Learning est une plateforme e-learning moderne permettant aux utilisateurs de :
- Créer un compte et activer leur profil par mail
- Acheter des cursus et des leçons en ligne
- Suivre et valider leurs apprentissages
- Accéder à leurs certifications

Le projet a été réalisé dans le cadre du Titre Professionnel Développeur Web et Web Mobile.

2. Fonctionnalités principales

Authentification sécurisée (inscription, activation par mail, connexion)
Gestion des rôles : admin, client, autre
E-commerce intégré : achat de cursus et leçons
Base de données MongoDB structurée autour des thèmes, cursus et leçons
Validation des cursus et affichage des certifications

3. Tests unitaires (Mocha, Chai) sur :

Création d’utilisateur
Connexion
Achat de cursus
Modèles Mongoose (User, Cursus, Lesson)

4. Technologies utilisées

Node.js / Express (backend, routes API & logique métier)
MongoDB + Mongoose (base de données NoSQL)
EJS (templates côté serveur)
CSS avec charte graphique dédiée
Mocha / Chai / Chai-HTTP (tests unitaires et fonctionnels)
JSDoc (documentation du code)

5. Installation

Cloner le repo :
git clone https://github.com/mon-profil/knowledge-learning.git
cd knowledge-learning

Installer les dépendances :
npm install

Configurer les variables d’environnement :
Créer un fichier .env à la racine :

MONGO_URI=mongodb://localhost:27017/knowledge-learning
PORT=3000

Importer les données de démonstration :
node importdata.js

6. Comptes inclus :

Sly (admin) → sly@demo.com / admin123
Caly (client) → caly@demo.com / client123

7. Lancement

Mode développement :
npm run dev

Mode production :
npm start

Par défaut : http://localhost:3000

8. Tests unitaires

Lancer tous les tests :
npm test

Tests couverts :
Inscription et activation d’un utilisateur
Connexion d’un utilisateur actif
Achat d’un cursus
Sécurité et validation des modèles (User, Cursus, Lesson)

9. Documentation

La documentation du code est générée avec JSDoc.

Générer la doc :
npm run docs

La doc se trouve ensuite dans /docs.

10. Structure du projet

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

