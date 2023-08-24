require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const session = require('express-session');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE,
    port: process.env.PORTDB
  });

  connection.connect((err) => {
    if(err) throw err;
    console.log("Connect to Database!")
  })

  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use((req, res, next) => {
    if (req.session.userId === undefined) {
      res.locals.username = 'Tamu'
      res.locals.isLoggedIn = false
    } else {
      res.locals.username = req.session.username;
      res.locals.isLoggedIn = true
    }
    next();
  })

// Ini adalah path route untuk halaman Teratas
// Pastikan URL dan code untuk menampilkan halaman-nya
app.get('/', (req, res) => {
  res.render('top.ejs');
});

// Ini adalah path route untuk halaman Artikel
// Pastikan URL dan code untuk menampilkan halaman-nya
app.get('/list', (req, res) => {
  connection.query(
    'SELECT * FROM articles',
    (error, results) => {
      // Pastikan data dan nama property diberikan pada file EJS
      res.render('list.ejs', { articles: results });
    }
  );
});

// Ini adalah path route untuk halaman Detail Artikel
// Pastikan URL dan code untuk menampilkan halaman-nya
app.get('/article/:id', (req, res) => {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM articles WHERE id = ?',
    [id],
    (error, results) => {
      // Pastikan data dan nama property diberikan pada file EJS
      res.render('article.ejs', { article: results[0] });
    }
  );
});

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', (req, res) => {
  const email = req.body.email;
  
  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (error, results) => {
      // Pisahkan proses berdasarkan banyaknya element-element dalam array `results`
      if (results.length > 0){
        if(req.body.password === results[0].password){
          req.session.userId = results[0].id
          req.session.username = results[0].username;
          res.redirect('/list')
        }else{
          res.redirect('/login')
        }
      } else {
        res.redirect('/login')
      }
    }
   )
})

app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    res.redirect('/list');
  })
})

app.listen(3000, () => console.log('Server Running'));
