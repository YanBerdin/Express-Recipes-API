# **Recipes API** 🍴

Recipes API est une API RESTful permettant de gérer des recettes culinaires. Elle offre des endpoints pour consulter des recettes, gérer les favoris, et authentifier les utilisateurs. L'API est sécurisée avec des JWT (JSON Web Tokens) et documentée avec Swagger.

---

## **Table des matières**

- [**Recipes API** 🍴](#recipes-api-)
  - [**Table des matières**](#table-des-matières)
  - [**Aperçu**](#aperçu)
  - [**Fonctionnalités**](#fonctionnalités)
  - [**Prérequis**](#prérequis)
  - [**Installation et démarrage**](#installation-et-démarrage)
    - [**1. Cloner le dépôt**](#1-cloner-le-dépôt)
    - [**2. Installer les dépendances**](#2-installer-les-dépendances)
    - [**3. Démarrer le serveur**](#3-démarrer-le-serveur)
    - [**4. Accéder à la documentation Swagger**](#4-accéder-à-la-documentation-swagger)
  - [**Endpoints principaux**](#endpoints-principaux)
    - [**Recettes**](#recettes)
    - [**Authentification routes**](#authentification-routes)
    - [**Favoris**](#favoris)
  - [**Authentification**](#authentification)
  - [**Structure du projet**](#structure-du-projet)
  - [**Améliorations possibles**](#améliorations-possibles)
  - [**Auteur**](#auteur)
  - [**Support**](#support)

---

## **Aperçu**

Recipes API est développée avec **Express.js**, un framework minimaliste pour Node.js. Elle utilise des middlewares modernes, comme **express-jwt** pour la gestion des tokens JWT, et **express-jsdoc-swagger** pour la documentation interactive des endpoints.  
L'API prend en charge :

- La gestion des recettes.
- L'authentification avec des identifiants et des mots de passe sécurisés via bcrypt.  
- Des fonctionnalités pour gérer les recettes favorites par utilisateur.  

---

## **Fonctionnalités**

- **Consultation des recettes** :  
  - Liste complète des recettes disponibles.  
  - Recherche d'une recette par ID ou par slug.  

- **Authentification sécurisée** :  
  - Authentification avec un email et un mot de passe (hashés avec bcrypt).  
  - Génération de tokens JWT pour un accès protégé.  

- **Gestion des favoris** :  
  - Récupération des recettes favorites de l'utilisateur connecté.  

- **Documentation interactive** :  
  - Swagger disponible sur `/api/docs` pour tester les endpoints.  

---

## **Prérequis**

1. **Node.js** (v16 ou supérieur recommandé).  
2. **npm** ou **yarn** (gestionnaire de paquets).  
3. **Un fichier `.env`** avec les variables suivantes :

   ```env
   PORT=3001
   JWT_SECRET=OurSuperLongRandomSecretToSignOurJWTgre5ezg4jyt5j4ui64gn56bd4sfs5qe4erg5t5yjh46yu6knsw4q
   ```

---

## **Installation et démarrage**

### **1. Cloner le dépôt**

```bash
git clone https://github.com/username/recipes-api.git
cd recipes-api
```

### **2. Installer les dépendances**

```bash
npm install
# ou avec yarn
yarn install
```

### **3. Démarrer le serveur**

```bash
npm start
# ou avec yarn
yarn start
```

### **4. Accéder à la documentation Swagger**

Ouvrez un navigateur et accédez à `http://localhost:3001/api/docs`.

---

## **Endpoints principaux**

### **Recettes**

1. **GET `/api/recipes`**  
   Retourne la liste de toutes les recettes.  
   **Exemple de réponse :**

   ```json
   [
     {
       "id": 1,
       "title": "Spaghetti Carbonara",
       "slug": "spaghetti-carbonara",
       "thumbnail": "https://example.com/image.jpg",
       "author": "John Doe",
       "difficulty": "Facile",
       "description": "Délicieuse recette de spaghetti carbonara.",
       "ingredients": ["Spaghetti", "Œufs", "Bacon", "Parmesan"],
       "instructions": ["Faire cuire les spaghetti.", "Mélanger le tout."]
     }
   ]
   ```

2. **GET `/api/recipes/:idOrSlug`**  
   Retourne une recette spécifique selon son ID ou son slug.  
   **Exemple de réponse :**

   ```json
   {
     "id": 1,
     "title": "Spaghetti Carbonara",
     "slug": "spaghetti-carbonara",
     "author": "John Doe",
     "difficulty": "Facile",
     "description": "Délicieuse recette de spaghetti carbonara."
   }
   ```

---

### **Authentification routes**

1. **POST `/api/login`**  
   Authentifie un utilisateur avec son email et son mot de passe.

   **Exemple de requête :**

   ```json
   {
     "email": "user@example.com",
     "password": "monSuperPasswordSécurisé"
   }
   ```

   **Exemple de réponse :**

   ```json
   {
     "logged": true,
     "pseudo": "username",
     "token": "eyJhbGciOiJIUzI1NiIsInR..."
   }
   ```

---

### **Favoris**

1. **GET `/api/favorites`**  
   Retourne les recettes favorites de l'utilisateur connecté.  
   **Exemple de réponse :**

   ```json
   {
     "favorites": [
       {
         "id": 2,
         "title": "Poulet Basquaise",
         "slug": "poulet-basquaise",
         "author": "Jane Smith",
         "difficulty": "Moyen"
       }
     ]
   }
   ```

---

## **Authentification**

- **JWT** :  
  L'API utilise des tokens JWT pour sécuriser les endpoints protégés.  
  Pour accéder aux routes sécurisées :  
  1. Authentifiez-vous avec `/api/login` pour obtenir un token.  
  2. Dans la documentation Swagger (`/api/docs`), cliquez sur **Authorize** et entrez le token JWT dans le champ `BearerAuth`.  

---

## **Structure du projet**

```bash
src/
├── list.json              # Liste des recettes
├── users.js               # Liste des utilisateurs et gestion des favoris
├── index.html             # Page d'accueil
└── server.js              # Point d'entrée principal de l'API
```

---

## **Améliorations possibles**

1. **Gestion des utilisateurs** :  
   Ajouter des fonctionnalités de création de compte et de mise à jour des informations utilisateur.  

2. **Pagination** :  
   Implémenter une pagination pour la liste des recettes.  

3. **Tests** :  
   Ajouter des tests unitaires avec **Jest** ou **Mocha**.  

4. **Meilleure gestion des erreurs** :  
   Fournir des messages d'erreur plus clairs et détaillés pour les utilisateurs.  

---

## **Auteur**

👤 **Votre Nom**

- GitHub : [@username](https://github.com/username)  
- LinkedIn : [Votre Profil LinkedIn](https://linkedin.com/in/username)  

---

## **Support**

⭐ Si ce projet vous a aidé ou inspiré, laissez une étoile sur GitHub !  

---
