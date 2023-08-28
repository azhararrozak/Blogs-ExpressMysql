const { connection } = require("../database/connection");

const checkingFormField = (req, res, next) => {
  console.log("Pemeriksaan nilai input kosong");
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const errors = [];

  if (username === "") {
    errors.push("Nama Pengguna kosong");
  }

  if (email === "") {
    errors.push("Email kosong");
  }

  if (password === "") {
    errors.push("Kata Sandi kosong");
  }

  if (errors.length > 0) {
    // Hapuslah 1 baris code di bawah
    console.log(errors);
    // Tampilkan halaman Pendaftaran menggunakan res.render
    res.render("signup.ejs", { errors: errors });
  } else {
    next();
  }
};

const checkingDuplicateEmail = (req, res, next) => {
  console.log("Pemeriksaan email duplikat");
  // Definisikan constant email
  const email = req.body.email;

  // Definisikan array `errors`
  const errors = [];

  // Tempelkan code yang diberikan untuk memeriksa email-email duplikat
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (error, results) => {
      if (results.length > 0) {
        // Tambahkan "Gagal mendaftarkan pengguna" pada array `errors`
        errors.push("Gagal mendaftarkan pengguna");

        // Gunakan res.render untuk menampilkan halaman Pendaftaran
        res.render("signup.ejs", { errors: errors });
      } else {
        // Panggil function `next`
        next();
      }
    }
  );
};

module.exports = { checkingFormField, checkingDuplicateEmail };
