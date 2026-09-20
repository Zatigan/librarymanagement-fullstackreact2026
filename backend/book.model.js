import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(":memory:");

db.exec(`
  CREATE TABLE book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    available_copies INTEGER NOT NULL CHECK (available_copies >= 0),
    total_copies INTEGER NOT NULL CHECK (total_copies > 0)
  )
`);

const getAllBooks = (callback) => {
  const request = db.prepare(`SELECT * FROM book`);
  const rows = request.all();
  callback(null, rows);
};

const getBookById = (id, callback) => {
  const request = db.prepare(`SELECT * FROM book WHERE id = ?`);
  const row = request.get(id);
  callback(null, row);
};

const createBook = (book, callback) => {
  const request = db.prepare(
    `INSERT INTO book (title, author, available_copies, total_copies) VALUES (?, ?, ?, ?)`,
  );

  const { title, author, available_copies, total_copies } = book;
  const { lastInsertRowid } = request.run(
    title,
    author,
    available_copies,
    total_copies,
  );
  callback(null, lastInsertRowid);
};

const borrowBook = (id, callback) => {
  getBookById(id, (err, book) => {
    if (err || !book) return callback(err || new Error("Book not found"));
    if (book.available_copies > 0) {
      const availableCopies = book.available_copies - 1;
      const request = db.prepare(
        `UPDATE book SET available_copies = ? WHERE id = ?`,
      );

      const { changes } = request.run(availableCopies, id);
      callback(null, changes);
    } else {
      callback(new Error("No copies available"));
    }
  });
};

const returnBook = (id, callback) => {
  getBookById(id, (err, book) => {
    if (err || !book) return callback(err || new Error("Book not found"));
    if (book.available_copies < book.total_copies) {
      const availableCopies = book.available_copies + 1;
      const request = db.prepare(
        `UPDATE book SET available_copies = ? WHERE id = ?`,
      );

      const { changes } = request.run(availableCopies, id);
      callback(null, changes);
    } else {
      callback(new Error("All copies are already returned"));
    }
  });
};

const deleteBook = (id, callback) => {
  const request = db.prepare(`DELETE FROM book WHERE id = ?`);
  const { changes } = request.run(id);
  callback(null, changes);
};

export default {
  getAllBooks,
  getBookById,
  createBook,
  borrowBook,
  returnBook,
  deleteBook,
};
