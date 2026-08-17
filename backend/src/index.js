import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth } from './auth.js';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../frontend/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Default vite port
app.use(express.json());

// Better Auth Middleware
app.all("/api/auth/*", (req, res) => {
  return auth.handler(req, res);
});

// Razorpay Initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'mock',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock',
});

// Payment endpoint for upgrades
app.post('/api/payments/create-order', async (req, res) => {
  try {
    // Basic verification - should use auth context in a real scenario
    const { plan } = req.body;
    let amount = 0;
    
    if (plan === 'pro') amount = 1000 * 100; // 1000 INR
    if (plan === 'enterprise') amount = 5000 * 100; // 5000 INR
    
    if (amount === 0) return res.status(400).json({ error: 'Invalid plan' });
    
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Autumn Mock Service for Entitlements
const PLAN_LIMITS = {
  free: {
    projects: 3,
    ai_generations: 5,
    features: ['basic_2d', 'basic_3d']
  },
  pro: {
    projects: Infinity,
    ai_generations: 100,
    features: ['basic_2d', 'basic_3d', 'ai_2d_to_3d', 'climate_analysis', 'furniture_placement', 'cost_estimation', 'advanced_rendering']
  },
  enterprise: {
    projects: Infinity,
    ai_generations: Infinity,
    features: ['basic_2d', 'basic_3d', 'ai_2d_to_3d', 'climate_analysis', 'furniture_placement', 'cost_estimation', 'advanced_rendering', 'team_collab', 'analytics']
  }
};

app.get('/api/subscription/status', async (req, res) => {
  // Normally extract user ID from auth session
  const userId = req.query.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const [rows] = await pool.query('SELECT * FROM subscriptions WHERE user_id = ?', [userId]);
    const sub = rows[0] || { plan: 'free', status: 'active', ai_generations_used: 0, projects_used: 0 };
    
    const limits = PLAN_LIMITS[sub.plan];
    
    res.json({
      plan: sub.plan,
      status: sub.status,
      usage: {
        ai_generations: sub.ai_generations_used,
        projects: sub.projects_used
      },
      entitlements: limits
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
