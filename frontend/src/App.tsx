import { Link, Navigate, Route, Routes } from 'react-router';

import { AddBookPage } from './books/AddBookPage';
import { BookListPage } from './books/BookListPage';

export function App() {
  return (
    <main className="container">
      <nav>
        <Link to="/">Book List</Link>
        <Link to="/add">Add Book</Link>
      </nav>

      <Routes>
        <Route path="/" element={<BookListPage />} />
        <Route path="/add" element={<AddBookPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}
