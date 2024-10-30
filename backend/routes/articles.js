// routes/articles.js
const express = require('express');
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
  const { image, title, link, date, content, company } = req.body;
  const status = 'For Edit';
  const writer = req.user.id;

  db.run(
    `INSERT INTO articles (image, title, link, date, content, status, writer, company) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [image, title, link, date, content, status, writer, company],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.put('/:id', authenticateToken, (req, res) => {
  const { image, title, link, date, content, status } = req.body;

  if (req.user.type === 'Writer' && status === 'Published') {
    return res.sendStatus(403);
  }

  db.run(
    `UPDATE articles SET image = ?, title = ?, link = ?, date = ?, content = ?, status = ? WHERE id = ?`,
    [image, title, link, date, content, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Article updated' });
    }
  );
});

router.put('/:id/publish', authenticateToken, (req, res) => {
  db.run(
    `UPDATE articles SET status = 'Published', editor = ? WHERE id = ?`,
    [req.user.id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Article published' });
    }
  );
});

router.get('/', authenticateToken, (req, res) => {
  db.all(`
    SELECT articles.*, 
          writers.firstname AS writer_firstname, writers.lastname AS writer_lastname, 
          editors.firstname AS editor_firstname, editors.lastname AS editor_lastname,
          companies.name AS company_name 
    FROM articles 
    LEFT JOIN users AS writers ON articles.writer = writers.id 
    LEFT JOIN users AS editors ON articles.editor = editors.id 
    LEFT JOIN companies ON articles.company = companies.id
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:id', authenticateToken, (req, res) => {
  db.get(`
    SELECT articles.*, 
          writers.firstname AS writer_firstname, writers.lastname AS writer_lastname, 
          editors.firstname AS editor_firstname, editors.lastname AS editor_lastname,
          companies.name AS company_name 
    FROM articles 
    LEFT JOIN users AS writers ON articles.writer = writers.id 
    LEFT JOIN users AS editors ON articles.editor = editors.id 
    LEFT JOIN companies ON articles.company = companies.id
    WHERE articles.id = ?
  `, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Get articles by status
router.get('/status/:status', authenticateToken, (req, res) => {
  const { status } = req.params;

  db.all(`
    SELECT articles.*, 
          writers.firstname AS writer_firstname, writers.lastname AS writer_lastname, 
          editors.firstname AS editor_firstname, editors.lastname AS editor_lastname,
          companies.name AS company_name 
    FROM articles 
    LEFT JOIN users AS writers ON articles.writer = writers.id 
    LEFT JOIN users AS editors ON articles.editor = editors.id 
    LEFT JOIN companies ON articles.company = companies.id
    WHERE articles.status = ?
  `, [status], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


module.exports = router;
