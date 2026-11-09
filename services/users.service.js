const fs = require('node:fs/promises');
const path = require('node:path');

const file = path.join(__dirname, '..', 'data', 'users.json');

async function getUsers() {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveUsers(users) {
  await fs.writeFile(file, JSON.stringify(users, null, 2), 'utf8');
}

async function getUserById(id) {
  const users = await getUsers();
  return users.find(u => u.id === id) || null;
}

async function createUser(userData) {
  const users = await getUsers();
  const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = {
    id: nextId,
    name: userData.name,
    email: userData.email
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

async function updateUser(id, userData) {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return null;
  }
  users[index] = {
    id,
    name: userData.name,
    email: userData.email
  };
  await saveUsers(users);
  return users[index];
}

async function deleteUser(id) {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return false;
  }
  users.splice(index, 1);
  await saveUsers(users);
  return true;
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
