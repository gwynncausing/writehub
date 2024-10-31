// db.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Connect to SQLite database (or create it if it doesn't exist)
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

// Function to create tables and default users if they don’t exist
async function initializeDatabase() {
  db.serialize(() => {
    // Create Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        type TEXT CHECK(type IN ('writer', 'editor')) NOT NULL,
        status TEXT CHECK(status IN ('active', 'inactive')) NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

    // Create Companies table
    db.run(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        logo TEXT,
        name TEXT UNIQUE NOT NULL,
        status TEXT CHECK(status IN ('Active', 'Inactive')) NOT NULL
      )
    `);

    // Create Articles table
    db.run(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT,
        title TEXT,
        link TEXT,
        date DATE DEFAULT CURRENT_DATE,
        content TEXT,
        status TEXT CHECK(status IN ('For Edit', 'Published')),
        writer INTEGER,
        editor INTEGER,
        company INTEGER,
        FOREIGN KEY (writer) REFERENCES users(id),
        FOREIGN KEY (editor) REFERENCES users(id),
        FOREIGN KEY (company) REFERENCES companies(id)
      )
    `);

    console.log('Database tables created (if they did not already exist).');
    createDefaultUsers();
    createDefaultCompanies();
    createDefaultArticles();
  });
}

// Function to create default users
async function createDefaultUsers() {
  const defaultUsers = [
    {
      firstname: 'Default',
      lastname: 'Writer',
      type: 'writer',
      status: 'active',
      username: 'writer1',
      password: await bcrypt.hash('password123', 10), // Hash the password
    },
    {
      firstname: 'Default',
      lastname: 'Editor',
      type: 'editor',
      status: 'active',
      username: 'editor1',
      password: await bcrypt.hash('password123', 10), // Hash the password
    },
  ];

  defaultUsers.forEach((user) => {
    db.get(`SELECT * FROM users WHERE username = ?`, [user.username], (err, row) => {
      if (err) return console.error(err.message);
      
      if (!row) {
        db.run(
          `INSERT INTO users (firstname, lastname, type, status, username, password) VALUES (?, ?, ?, ?, ?, ?)`,
          [user.firstname, user.lastname, user.type, user.status, user.username, user.password],
          (err) => {
            if (err) return console.error(err.message);
            console.log(`Default user ${user.username} created.`);
          }
        );
      } else {
        console.log(`User ${user.username} already exists.`);
      }
    });
  });
}

// Function to create default companies
async function createDefaultCompanies() {
  const defaultCompanies = [
    { logo: 'uploads/image1.jpg', name: 'Company One', status: 'Active' },
    { logo: 'uploads/image2.jpg', name: 'Company Two', status: 'Inactive' },
  ];

  defaultCompanies.forEach((company) => {
    db.get(`SELECT * FROM companies WHERE name = ?`, [company.name], (err, row) => {
      if (err) return console.error(err.message);

      if (!row) {
        db.run(
          `INSERT INTO companies (logo, name, status) VALUES (?, ?, ?)`,
          [company.logo, company.name, company.status],
          (err) => {
            if (err) return console.error(err.message);
            console.log(`Default company ${company.name} created.`);
          }
        );
      } else {
        console.log(`Company ${company.name} already exists.`);
      }
    });
  });
}

async function createDefaultArticles() {
  const defaultArticles = [
    {
      image: 'uploads/image1.jpg',
      title: 'Default Article 1',
      link: 'http://example.com/article1',
      content: 'This is the default content for article 1.',
      status: 'For Edit',
      writer: 1,
      editor: null,
      company: 1
    },
    {
      image: 'uploads/image1.jpg',
      title: 'Default Article 2',
      link: 'http://example.com/article2',
      content: 'This is the default content for article 2.',
      status: 'Published',
      writer: 1,
      editor: null,
      company: 1
    },
    {
      image: 'uploads/image1.jpg',
      title: 'Default Article 3',
      link: 'http://example.com/article3',
      content: 'This is the default content for article 3.',
      status: 'For Edit',
      writer: 1,
      editor: null,
      company: 1
    },
    {
      image: 'uploads/image1.jpg',
      title: 'Default Article 4',
      link: 'http://example.com/article4',
      content: 'This is the default content for article 4.',
      status: 'Published',
      writer: 1,
      editor: null,
      company: 1
    },
    {
      image: 'uploads/image1.jpg',
      title: 'Default Article 5',
      link: 'http://example.com/article5',
      content: 'This is the default content for article 5.',
      status: 'For Edit',
      writer: 1,
      editor: null,
      company: 2
    },
    {
      image: 'uploads/image1.jpg',
      title: 'Default Article 6',
      link: 'http://example.com/article6',
      content: 'This is the default content for article 6.',
      status: 'Published',
      writer: 1,
      editor: null,
      company: 2
    },
    {
      image: 'uploads/image1.jpg',
      title: 'Default Article 7',
      link: 'http://example.com/article7',
      content: 'This is the default content for article 7.',
      status: 'For Edit',
      writer: 1,
      editor: null,
      company: 2
    },
    {
      image: 'uploads/image1.jpg',
      title: 'Default Article 8',
      link: 'http://example.com/article8',
      content: 'This is the default content for article 8.',
      status: 'Published',
      writer: 1,
      editor: null,
      company: 2
    },
    {
      image: 'uploads/image1.jpg',
      title: 'Default Article 9',
      link: 'http://example.com/article9',
      content: 'This is the default content for article 9.',
      status: 'For Edit',
      writer: 1,
      editor: null,
      company: 1
    },
    {
      image: 'uploads/image1.jpg',
      title: 'Default Article 10',
      link: 'http://example.com/article10',
      content: 'This is the default content for article 10.',
      status: 'Published',
      writer: 1,
      editor: null,
      company: 1
    }
  ]

  defaultArticles.forEach(article => {
    db.run(
      `INSERT INTO articles (image, title, link, date, content, status, writer, editor, company) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [article.image, article.title, article.link, new Date(), article.content, article.status, article.writer, article.editor, article.company]
    );
  });

  console.log('Default articles created.');
}

module.exports = db;
