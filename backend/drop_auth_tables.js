import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function dropTables() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'Dream2Build',
  });

  try {
    console.log('Dropping old auth tables...');
    await pool.query('DROP TABLE IF EXISTS session;');
    await pool.query('DROP TABLE IF EXISTS account;');
    await pool.query('DROP TABLE IF EXISTS verification;');
    await pool.query('DROP TABLE IF EXISTS user;');
    console.log('✅ Old tables dropped successfully.');
    console.log('Now you can run: npm run auth:migrate');
  } catch (err) {
    console.error('❌ Error dropping tables:', err.message);
  } finally {
    await pool.end();
  }
}

dropTables();
