const express = require('express');
const { engine } = require('express-handlebars');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const usersRouter = require('./routes/users.routes');
const usersService = require('./services/users.service');

const app = express();
const port = process.env.PORT || 3000;

// Zadanie 4.6 a) Konfiguracja silnika szablonów Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Zadanie 4.3 a) Middleware logujący
app.use(logger);

// Zadanie 4.3 b, c) Middleware do obsługi JSON, formularzy i plików statycznych
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Demonstracja router-level middleware
const demoRouter = express.Router();
demoRouter.use((req, res, next) => {
  console.log(`[Router Middleware] ${req.method} ${req.originalUrl}`);
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

// Zadanie 4.6 b) Widok listy użytkowników (SSR)
app.get('/users', async (req, res, next) => {
  try {
    const users = await usersService.getUsers();
    res.render('users/list', {
      title: 'Lista użytkowników',
      users
    });
  } catch (err) {
    next(err);
  }
});

// Zadanie 4.6 c) Widok szczegółów użytkownika (SSR)
app.get('/users/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).send('Nieprawidłowy identyfikator');
    }

    const user = await usersService.getUserById(id);
    if (!user) {
      return res.status(404).send('Użytkownik nie został znaleziony');
    }

    res.render('users/details', {
      title: `Szczegóły: ${user.name}`,
      user
    });
  } catch (err) {
    next(err);
  }
});

// Zadanie 4.5: Trasy REST API (rozdzielone od widoków SSR)
app.use('/api/users', usersRouter);

// Zadanie 4.5 d) Test asynchronicznej propagacji błędów do errorHandler w Express 5
app.get('/api/test-error', async (req, res) => {
  throw new Error('Testowy błąd asynchroniczny');
});

// Zadanie 4.5 d) Middleware obsługujące 404 po wszystkich trasach
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint nie istnieje' });
});

// Zadanie 4.5 d) Centralna obsługa błędów jako ostatni middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
