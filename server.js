const express = require('express');
const { body, param, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3000;

// Zadanie 4.3 a) Middleware rejestrujące metodę, URL i czas rozpoczęcia
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};
app.use(logger);

// Zadanie 4.3 b, c) Wbudowane middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Demonstracja routera z middleware (router.use())
const demoRouter = express.Router();
demoRouter.use((req, res, next) => {
  console.log(`[Router Middleware] Obsługa trasy wewnątrz routera: ${req.method} ${req.originalUrl}`);
  next();
});
demoRouter.get('/test', (req, res) => {
  res.json({ message: 'Odpowiedź z routera z middleware router.use()' });
});
app.use('/demo', demoRouter);

// Trasy podstawowe
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

// Zadanie 4.4 a) Model danych przechowywany w pamięci procesu
let users = [
  { id: 1, name: 'Jan Kowalski', email: 'jan@example.com' },
  { id: 2, name: 'Anna Nowak', email: 'anna@example.com' }
];

// Wyszukiwanie użytkowników (przed trasą :id)
app.get('/api/users/search', (req, res) => {
  const { name, page = 1 } = req.query;
  let results = users;
  if (name) {
    results = results.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
  }
  res.status(200).json({ results, page: Number(page) });
});

// Zadanie 4.4 a) GET /api/users - pobranie listy wszystkich użytkowników
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

// Zadanie 4.4 a, b) GET /api/users/:id - pobranie użytkownika po ID
app.get('/api/users/:id',
  param('id').isInt().withMessage('Identyfikator musi być liczbą całkowitą'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }

    res.status(200).json(user);
  }
);

// Zadanie 4.4 a, b) POST /api/users - dodawanie użytkownika z walidacją
app.post('/api/users',
  body('name').trim().notEmpty().withMessage('Pole name jest wymagane'),
  body('email').isEmail().withMessage('Pole email musi być poprawnym adresem email'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: nextId,
      name: req.body.name.trim(),
      email: req.body.email
    };

    users.push(newUser);
    res.status(201).json(newUser);
  }
);

// Zadanie 4.4 a, b) PUT /api/users/:id - aktualizacja użytkownika z walidacją
app.put('/api/users/:id',
  param('id').isInt().withMessage('Identyfikator musi być liczbą całkowitą'),
  body('name').trim().notEmpty().withMessage('Pole name jest wymagane'),
  body('email').isEmail().withMessage('Pole email musi być poprawnym adresem email'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }

    users[userIndex] = {
      id,
      name: req.body.name.trim(),
      email: req.body.email
    };

    res.status(200).json(users[userIndex]);
  }
);

// Zadanie 4.4 a, b) DELETE /api/users/:id - usunięcie użytkownika
app.delete('/api/users/:id',
  param('id').isInt().withMessage('Identyfikator musi być liczbą całkowitą'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }

    users.splice(userIndex, 1);
    res.status(204).send();
  }
);

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
