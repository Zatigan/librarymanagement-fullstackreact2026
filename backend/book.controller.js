import express from "express";
import bookService from "./book.service.js";

const router = express.Router();

// GET /books - Récupérer tous les livres
router.get("", (req, res) => {
  bookService.getAllBooks((err, books) => {
    if (err) return res.status(500).send(err.message);
    res.json(books);
  });
});

// GET /books/:id - Récupérer un livre par ID
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  bookService.getBookById(id, (err, book) => {
    if (err) return res.status(500).send(err.message);
    if (!book) return res.status(404).send("Book not found");
    res.json(book);
  });
});

// POST /books - Créer un nouveau livre
router.post("", (req, res) => {
  const book = req.body;
  bookService.createBook(book, (err, bookId) => {
    if (err) return res.status(400).send(err.message);
    res.status(201).json({ id: bookId, ...book });
  });
});

// PUT /books/:id/borrow - Emprunter un livre
router.put("/:id/borrow", (req, res) => {
  const id = parseInt(req.params.id, 10);
  bookService.borrowBook(id, (err, changes) => {
    if (err) return res.status(400).send(err.message);
    if (changes === 0) return res
      .status(404)
      .send("Book not found or no copies available");
    res.json({ borrowed: true });
  });
});

// PUT /books/:id/return - Retourner un livre
router.put("/:id/return", (req, res) => {
  const id = parseInt(req.params.id, 10);
  bookService.returnBook(id, (err, changes) => {
    if (err) return res.status(400).send(err.message);
    if (changes === 0) return res
      .status(404)
      .send("Book not found or all copies are already returned");
    res.json({ returned: true });
  });
});

// DELETE /books/:id - Supprimer un livre
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  bookService.deleteBook(id, (err, changes) => {
    if (err) return res.status(500).send(err.message);
    if (changes === 0) return res.status(404).send("Book not found");
    res.json({ deleted: true });
  });
});

export default router;
