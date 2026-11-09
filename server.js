const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Witaj w aplikacji Express!');
});

app.get('/contact', (req, res) => {
  res.send('Strona kontaktowa');
});

app.get('/api/info', (req, res) => {
  res.json({
    application: 'Express LAB4',
    version: '1.0'
  });
});

// Zadanie 4.2 b) Parametry zapytania (req.query)
// Zdefiniowane przed /api/users/:id, aby zapobiec przechwytywaniu "search" jako :id
app.get('/api/users/search', (req, res) => {
  const { name, page = 1 } = req.query;
  res.status(200).json({ name, page });
});

// Zadanie 4.2 a) Parametry ścieżki (req.params)
app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const numId = Number(id);

  if (isNaN(numId)) {
    return res.status(400).json({ error: 'Identyfikator musi być liczbą' });
  }

  if (numId === 999) {
    return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
  }

  res.status(200).json({
    message: 'Pobrano użytkownika',
    id: id
  });
});

// Zadanie 4.2 c) Metody HTTP i kody statusu (POST, PUT, DELETE)
app.post('/api/users', (req, res) => {
  // Przykładowy status 201 Created
  res.status(201).json({
    message: 'Użytkownik utworzony'
  });
});

app.put('/api/users/:id', (req, res) => {
  const numId = Number(req.params.id);

  if (isNaN(numId)) {
    return res.status(400).json({ error: 'Identyfikator musi być liczbą' });
  }

  if (numId === 999) {
    return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
  }

  res.status(200).json({
    message: 'Użytkownik zaktualizowany',
    id: numId
  });
});

app.delete('/api/users/:id', (req, res) => {
  const numId = Number(req.params.id);

  if (isNaN(numId)) {
    return res.status(400).json({ error: 'Identyfikator musi być liczbą' });
  }

  if (numId === 999) {
    return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
  }

  // Status 204 No Content
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
