const express = require('express');
const { body, param } = require('express-validator');
const usersController = require('../controllers/users.controller');

const router = express.Router();

// Wyszukiwanie (musi być przed :id)
router.get('/search', usersController.search);

// Pobranie wszystkich użytkowników
router.get('/', usersController.getAll);

// Pobranie pojedynczego użytkownika
router.get('/:id', [
  param('id').isInt().withMessage('Identyfikator musi być liczbą całkowitą')
], usersController.getById);

// Dodanie nowego użytkownika
router.post('/', [
  body('name').trim().notEmpty().withMessage('Pole name jest wymagane'),
  body('email').isEmail().withMessage('Pole email musi być poprawnym adresem email')
], usersController.create);

// Aktualizacja użytkownika
router.put('/:id', [
  param('id').isInt().withMessage('Identyfikator musi być liczbą całkowitą'),
  body('name').trim().notEmpty().withMessage('Pole name jest wymagane'),
  body('email').isEmail().withMessage('Pole email musi być poprawnym adresem email')
], usersController.update);

// Usunięcie użytkownika
router.delete('/:id', [
  param('id').isInt().withMessage('Identyfikator musi być liczbą całkowitą')
], usersController.deleteUser);

module.exports = router;
