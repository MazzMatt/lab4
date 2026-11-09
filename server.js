const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Zadanie 4.3 a) Własny middleware logger z czasem rozpoczęcia
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// Zadanie 4.3 b) Odczyt danych JSON
app.use(express.json());

// Zadanie 4.3 c) Formularze i pliki statyczne
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Zadanie 4.3 c) Router z middleware na poziomie routera (router.use())
const demoRouter = express.Router();
demoRouter.use((req, res, next) => {
  console.log(`[Router Middleware] Obsługa trasy wewnątrz routera: ${req.method} ${req.originalUrl}`);
  next();
});
demoRouter.get('/test', (req, res) => {
  res.json({
    message: 'Odpowiedź z routera z middleware router.use()'
  });
});
app.use('/demo', demoRouter);

// Trasy z poprzednich zadań
app.get('/', (req, res) => {
  res.send('Witaj w aplikacji Express!');
});

app.get('/contact', (req, res) => {
  res.send('Strona kontaktowa');
});

app.post('/contact-form', (req, res) => {
  res.status(200).json({
    message: 'Odebrano formularz urlencoded',
    data: req.body
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    application: 'Express LAB4',
    version: '1.0'
  });
});

// Zadanie 4.2 b) Parametry zapytania (req.query)
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

// Zadanie 4.3 b) POST z odczytem req.body po włączeniu express.json()
app.post('/api/users', (req, res) => {
  const user = req.body;
  res.status(201).json(user);
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
    id: numId,
    data: req.body
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

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
