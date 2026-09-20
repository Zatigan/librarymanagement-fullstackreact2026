import express from "express";
import cors from "cors";

import bookController from "./book.controller.js";
import bookService from "./book.service.js";

// Créer une application Express
const app = express();
app.use(
  cors({
    origin: "http://localhost:4200",
  }),
);

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Donnée d'exemple
const sampleBook = {
  title: "La vie de Michel",
  author: "Michel",
  available_copies: 5,
  total_copies: 5,
};

// Initialisation d’un livre au démarrage
bookService.createBook(sampleBook, (err) => {
  if (err) {
    console.error(err);
  }
});

// Définir les routes pour l'API des livres
app.use("/books", bookController);

// Définir le port sur lequel le serveur écoute
const PORT = 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Exporter l'application pour les tests d'intégration
export default app;
