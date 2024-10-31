const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const router = express.Router();

// Ensure uploads directory exists
const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  }
});
const upload = multer({ storage: storage });

router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  const { title, link, date, content, company } = req.body;
  const imagePath = req.file ? req.file.path : null;
  const status = 'For Edit';
  const writer = req.user.id;

  db.run(
    `INSERT INTO articles (image, title, link, date, content, status, writer, company) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [imagePath, title, link, date, content, status, writer, company],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});


router.put('/:id', authenticateToken, upload.single('image'), (req, res) => {
  const { title, link, date, content, status } = req.body;
  const imagePath = req.file ? req.file.path : null;
  console.log("🚀 ~ router.put ~ req.body:", req.body)
  if (req.user.type === 'Writer' && status === 'Published') {
    return res.sendStatus(403);
  }

  const queryParams = [title, link, date, content, status, req.params.id];
  let sqlQuery = `
    UPDATE articles SET 
      title = ?, 
      link = ?, 
      date = ?, 
      content = ?, 
      status = ? 
    WHERE id = ?
  `;

  if (imagePath) {
    sqlQuery = `
      UPDATE articles SET 
        image = ?, 
        title = ?, 
        link = ?, 
        date = ?, 
        content = ?, 
        status = ? 
      WHERE id = ?
    `;
    queryParams.unshift(imagePath); // Add image to the front of the params array
  }

  db.run(sqlQuery, queryParams, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Article updated' });
  });
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
