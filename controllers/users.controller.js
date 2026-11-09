const { validationResult } = require('express-validator');
const usersService = require('../services/users.service');

async function getAll(req, res, next) {
  try {
    const users = await usersService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

async function search(req, res, next) {
  try {
    const { name, page = 1 } = req.query;
    let users = await usersService.getUsers();
    if (name) {
      users = users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
    }
    res.status(200).json({ results: users, page: Number(page) });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params.id);
    const user = await usersService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newUser = await usersService.createUser({
      name: req.body.name.trim(),
      email: req.body.email
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params.id);
    const updated = await usersService.updateUser(id, {
      name: req.body.name.trim(),
      email: req.body.email
    });

    if (!updated) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params.id);
    const deleted = await usersService.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  search,
  getById,
  create,
  update,
  deleteUser
};
