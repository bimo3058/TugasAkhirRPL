// server.js
import express from 'express';
import mysql from 'mysql2/promise'; // Gunakan versi promise
import cors from 'cors';
import bcrypt from 'bcryptjs'; // 🔧 Tambahkan bcryptjs

const app = express();
const saltRounds = 10;

// Konfigurasi database
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Ganti jika kamu pakai password MySQL
  database: 'sehari',
};

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Koneksi pool ke database
const pool = mysql.createPool(dbConfig);

// Tes koneksi saat server start
try {
  const conn = await pool.getConnection();
  console.log('✅ Connected to MySQL database');
  conn.release();
} catch (err) {
  console.error('❌ Database connection failed:', err.message);
  process.exit(1);
}

// 📌 Endpoint signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('Received signup request:', req.body); // Log incoming request
    
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Cek user sudah ada
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully');

    // Simpan user baru
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    console.log('Insert result:', result);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack); // Add stack trace
    res.status(500).json({ 
      message: 'Server error',
      error: error.message // Include actual error message
    });
  }
});

// 📌 Endpoint login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Cari user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    
    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Jika berhasil, kembalikan data user (tanpa password)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    res.status(200).json({ 
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
});

// Server listen tanpa endpoint
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
