import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'htcstlvhd',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Test connection (non-blocking)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('⚠️  Database connection error:', err.message);
    console.error('⚠️  Server will continue but database features will not work');
    console.error('⚠️  Please check:');
    console.error('   - MySQL/XAMPP is running');
    console.error('   - Database "htcstlvhd" exists');
    console.error('   - DB_PASSWORD in .env is correct (empty for XAMPP)');
    return;
  }
  console.log('✅ Database connected successfully');
  connection.release();
});

export default pool.promise();
