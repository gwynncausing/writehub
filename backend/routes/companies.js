const express = require('express');
const multer = require('multer');
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const path = require('path');
const router = express.Router();

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

// GET all companies (Editor only)
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM companies', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET one company by ID 
router.get('/:id', authenticateToken, (req, res) => {
  const companyId = req.params.id;
  db.get('SELECT * FROM companies WHERE id = ?', [companyId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Company not found' });
    res.json(row);
  });
});

// Create a new company (Editor only)
router.post('/', authenticateToken, upload.single('logo'), (req, res) => {
  const { name, status } = req.body;
  const logoPath = req.file ? req.file.path : null;
  console.log("🚀 ~ router.post ~ req.file:", req.file)

  db.run(
    `INSERT INTO companies (logo, name, status) VALUES (?, ?, ?)`,
    [logoPath, name, status],
    function (err) {
      console.log("🚀 ~ router.post ~ err:", err)
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Update a company (Editor only)
router.put('/:id', authenticateToken, upload.single('logo'), (req, res) => {
  const { name, status } = req.body;
  
  if (!['Active', 'Inactive'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  let sql = 'UPDATE companies SET name = ?, status = ?';
  let params = [name, status, req.params.id];

  if (req.file && req.file.path) {
    sql += ', logo = ?';
    params = [req.file.path, ...params];
  }

  sql += ' WHERE id = ?';

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Company updated' });
  });
});



module.exports = router;
