import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../frontend/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'busmate',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection immediately
pool.getConnection()
  .then((conn) => {
    console.log('✅ Successfully connected to MySQL database:', process.env.MYSQL_DATABASE || 'busmate');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MySQL database:', err.message);
  });
