
  ## ++ Frontend  ++ 
  # Installation de Bootstrap
  npm install bootstrap@5.3.7

  # Démarrer le Frontend
  npm run dev
  Local:  http://localhost:5173/


  ## Tester avec Jest de Front  ( tests/product.test.js )
  # Installer Jest
  npm install --save-dev jest

  # Ajouter le script dans package.json

  "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "test": "jest". <--- ajouter
    },

  # Lancer les tests
  npm test

  ---  Exemple de résultat ---------------
  PASS  tests/product.test.js
    createProductCard
      ✓ crée une carte produit avec le bon libellé (14 ms)
    formatPrice
      ✓ formate le prix avec deux décimales et le symbole euro

  Test Suites: 1 passed, 1 total
  Tests:       2 passed, 2 total
  Snapshots:   0 total
  Time:        0.94 s

  -----------------------------------------

  ## ++ Backend ++
  # Démarrer le Backend
  npm install
  npm start
  Server is running on port 3000

  # Installer des modules supplémentaires
  npm install sequelize
  npm install csurf

  ## MySQL
  1. brew services start mysql <--- Pour Mac
  1. mysql -u admin -p
  password : XXXXX

  2. USE spe_dev
  3. Connected to MYSQL. dans le back

  -----------------------------------------

## Fonctionnalités techniques

- Images stockées dans `back/assets`
- Protection CSRF
- Authentification par JWT (`jsonwebtoken`)
- Mots de passe hashés avec `bcrypt`
- Panier hors connexion via `localStorage`
- Création automatique des tables avec Sequelize
- CSP dans `vite.config.js` : scripts locaux uniquement
- Route des stats dispo sur `http://localhost:3000/statistiques`

## Fichier de sécurité

Un fichier `.well-known/security.txt` est présent pour déclarer les contacts de sécurité.
localhost:VITE_PORT/.well-known/security.txt

## SCRIPT

- Un fichier script.sql est à disposition afin de créer les premiers produits.
