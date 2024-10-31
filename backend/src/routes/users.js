const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// GET all users (Editor only)
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT id, firstname, lastname, type, status, username FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create a new user (Editor only)
router.post('/', authenticateToken, async (req, res) => {
  const { firstname, lastname, type, status, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (firstname, lastname, type, status, username, password) VALUES (?, ?, ?, ?, ?, ?)`,
    [firstname, lastname, type, status, username, hashedPassword],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Update a user (Editor only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { firstname, lastname, type, status, password } = req.body;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const query = `
    UPDATE users
    SET firstname = ?, lastname = ?, type = ?, status = ?${password ? ', password = ?' : ''}
    WHERE id = ?
  `;
  const params = [firstname, lastname, type, status];
  if (hashedPassword) params.push(hashedPassword);
  params.push(req.params.id);

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated' });
  });
});

module.exports = router;
