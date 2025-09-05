// Librairies
const express = require("express");
const cors = require("cors");
const jsonwebtoken = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const expressJSDocSwagger = require("express-jsdoc-swagger");
require("dotenv").config(); // Pour gérer les variables d'environnement
const bcrypt = require("bcrypt");

// Example of hashing a password before storing it
const hashedPassword1 = bcrypt.hashSync("monSuperPasswordSécurisé", 10);
const hashedPassword2 = bcrypt.hashSync("al6", 10);
const hashedPassword3 = bcrypt.hashSync("davy", 10);

module.exports = { hashedPassword1, hashedPassword2, hashedPassword3 };

// console.log(hashedPassword1); //! remove

// Données et configurations
const recipes = require("./list.json");
const db = require("./users");

const app = express();

const jwtSecret =
  process.env.JWT_SECRET ||
  "OurSuperLongRandomSecretToSignOurJWTgre5ezg4jyt5j4ui64gn56bd4sfs5qe4erg5t5yjh46yu6knsw4q";
const port = process.env.PORT || 3001;

// Configuration Swagger https://brikev.github.io/express-jsdoc-swagger-docs/#/
const options = {
  info: {
    version: "1.0.0",
    title: "Recipes API",
    description:
      "Documentation de l'API de Recettes. Pour tester l'accés aux routes protégées 🔒, en étant authentifié après avoir saisi les identifiants, récupérer (dans la console) le JWT généré. Cliquer sur le bouton 'Authorize' en haut à droite. Entrer le JWT dans le champ 'Value' sous 'BearerAuth'. Cliquer sur 'Authorize' puis sur 'Close'.",
    license: {
      name: "MIT",
    },
  },
  security: {
    BearerAuth: {
      type: "http",
      scheme: "bearer",
    },
  },
  baseDir: __dirname,
  filesPattern: "./**/*.js",
  swaggerUIPath: "/api/docs",
  exposeSwaggerUI: true,
  exposeApiDocs: false,
  apiDocsPath: "/v3/api-docs",
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
  multiple: true,
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      Recipe: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Spaghetti Carbonara" },
          slug: { type: "string", example: "spaghetti-carbonara" },
          thumbnail: {
            type: "string",
            example: "https://example.com/image.jpg",
          },
          author: { type: "string", example: "John Doe" },
          difficulty: { type: "string", example: "Facile" },
          description: {
            type: "string",
            example: "Délicieuse recette de spaghetti carbonara.",
          },
          ingredients: {
            type: "array",
            items: { $ref: "#/components/schemas/Ingredient" },
          },
          instructions: {
            type: "array",
            items: { type: "string" },
            example: [
              "Faire cuire les spaghetti.",
              "Mélanger les oeufs et le bacon.",
              "Combiner le tout.",
            ],
          },
        },
      },
    },
  },
};

expressJSDocSwagger(app)(options);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Extract & verif du JWT depuis l’en-tête Authorization
//* sans express-jwt
/*
app.use((req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    try {
      const jwtContent = jsonwebtoken.verify(token, jwtSecret, {
        algorithms: ["HS256"],
        issuer: "api.recipes",
        audience: "api.users",
      });
      req.user = jwtContent;
    } catch (err) {
      console.log("Invalid token", err);
    }
  }
  next();
});
*/

// Vérification du token JWT
//* avec express-jwt
app.use(
  expressJwt({
    secret: jwtSecret,
    algorithms: ["HS256"],
    audience: "api.users",
  }).unless({
    // unless =>  Exclure les routes de la vérification du JWT
    path: [
      { url: "/", methods: ["GET"] },
      { url: "/api/recipes", methods: ["GET"] },
      { url: "/api/recipes/:idOrSlug", methods: ["GET"] },
      { url: /^\/api\/recipes\/[^/]+$/, methods: ["GET"] },
      { url: "/api/login", methods: ["POST"] },
    ],
  })
);

// Vérification du token JWT
const checkLoggedIn = (req, res, next) => {
  if (!req.user) {
    console.log("<< 401 UNAUTHORIZED");
    res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
};

/* Routes */

// Page d'accueil du serveur
app.get("/", (req, res) => {
  console.log(">> GET /");
  res.sendFile(__dirname + "/index.html");
});

/**
 * @typedef {object} Recipe
 * @property {number} id - The ID of the recipe
 * @property {string} title - The title of the recipe
 * @property {string} slug - The slug (URL-friendly name) of the recipe
 * @property {string} thumbnail - The URL to the thumbnail image of the recipe
 * @property {string} author - The author of the recipe
 * @property {string} difficulty - The difficulty level of the recipe
 * @property {string} description - A short description of the recipe
 * @property {array<string>} ingredients - The list of ingredients for the recipe
 * @property {array<string>} instructions - The instructions for preparing the recipe
 */

/**
 * GET /api/recipes
 * @summary Returns a list of recipes
 * @tags recipes
 * @return {array<Recipe>} 200 - Success response with an array of recipes - application/json
 * @example response - 200 - Example success response
 * [
 *   {
 *     "id": 1,
 *     "name": "Spaghetti Carbonara",
 *     "description": "Delicious spaghetti carbonara recipe.",
 *     "thumbnail": "https://example.com/image.jpg",
 *     "author": "John Doe",
 *     "difficulty": "Facile",
 *     "ingredients": ["Spaghetti", "Eggs", "Pancetta", "Parmesan cheese"],
 *     "instructions": ["Cook the spaghetti.", "Fry the pancetta.", "Mix eggs and cheese.", "Combine everything."]
 *   }
 * ]
 */
app.get("/api/recipes", (req, res) => {
  console.log(">> GET /recipes");
  res.json(recipes);
});

/**
 * GET /api/recipes/{idOrSlug}
 * @summary Returns a recipe
 * @tags recipes
 * @param {string} idOrSlug.path.required - slug param
 * @return {Recipe} 200 - success response - application/json
 */
app.get("/api/recipes/:idOrSlug", (req, res) => {
  console.log(">> GET /recipes/:idOrSlug", req.params.idOrSlug);
  const recipe = recipes.find(
    (recipe) =>
      recipe.id === parseInt(req.params.idOrSlug) ||
      recipe.slug === req.params.idOrSlug
  );
  if (!recipe)
    return res
      .status(404)
      .send("The recipe with the given ID or Slug was not found.");
  res.json(recipe);
});

/**
 * @typedef {object} Credentials
 * @property {string} email - The email address of the user
 * @property {string} password - The password of the user
 */

/**
 * @typedef {object} AuthUser
 * @property {boolean} logged - The login status of the user
 * @property {string} pseudo - The username of the authenticated user
 * @property {string} token - The JWT token for the user
 */

/**
 * POST /api/login
 * @summary Authenticates a user
 * @tags auth
 * @param {Credentials} request.body.required - user credentials
 * @return {AuthUser} 200 - Success response with user informations - application/json
 * @example request - Example usage:
 * {
 *   "email": "bouclierman@herocorp.io",
 *   "password": "monSuperPasswordSécurisé"
 * }
 * @example response - 200 - Example success response
 * {
 *   "logged": true,
 *   "pseudo": "jennifer(exemple)",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyfQ.3h"
 * }
 * @return {object} 401 - unauthorized response - application/json
 * @example response - 401 - Example unauthorized response
 * {
 *   "message": "Unauthorized"
 * }
 * @security BasicAuth
 * @security BearerAuth
 */
app.post("/api/login", (req, res) => {
  console.log(">> POST /login", req.body);
  const { email, password } = req.body;

  // authentication
  const user = db.users.find((user) => user.email === email);
  console.log("User found:", user);

  // http response
  if (user && bcrypt.compareSync(password, user.password)) {
    console.log(
      "Password comparison:",
      bcrypt.compareSync(password, user.password)
    );
    // Génération du mot de passe haché
    const jwtContent = { userId: user.id };
    const jwtOptions = {
      algorithm: "HS256",
      expiresIn: "3h",
      audience: "api.users",
    };
    const token = jsonwebtoken.sign(jwtContent, jwtSecret, jwtOptions);
    console.log("Generated token:", token); //TODO: remove

    res.status(200).json({
      logged: true,
      pseudo: user.username,
      token: token,
    });
  } else {
    console.log("<< 401 UNAUTHORIZED"); //TODO: remove
    res.status(401).json({ message: "Unauthorized" });
  }
});

/**
 * @typedef {object} Favorites
 * @property {array<Recipe>} favorites - The list of favorite recipes
 */

/**
 * GET /api/favorites
 * @summary Returns a list of favorite recipes
 * @tags recipes
 * @security BearerAuth
 * @return {array<Recipe>} 200 - success response - application/json
 */
app.get("/api/favorites", checkLoggedIn, (req, res) => {
  const user = db.users.find((user) => user.id === req.user.userId);
  res.json({
    favorites: recipes.filter((recipe) => user.favorites.includes(recipe.id)),
  });
});

// Middleware => Gestion des erreurs si aucune route ne répond à la requête
app.use((req, res, next) => {
  next(new Error("Not found"));
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.log("<< 401 UNAUTHORIZED - Invalid Token"); //TODO: remove
    res.status(401).json({ message: "Invalid token" });
  } else if (err.message === "Not found") {
    console.log("<< 404 NOT FOUND"); //TODO: remove
    res.status(404).json({ message: "Not found" });
  } else {
    console.error(err); //TODO: remove
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); //TODO: remove
});
