import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './app/routes/auth.routes.js';
import taiLieuRoutes from './app/routes/tailieu.routes.js';
import cauHoiRoutes from './app/routes/cauhoi.routes.js';
import baoCaoRoutes from './app/routes/baocao.routes.js';
import adminRoutes from './app/routes/admin.routes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/data/documents', express.static(path.join(__dirname, 'data/documents')));
app.use('/data/pictures', express.static(path.join(__dirname, 'data/pictures')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tailieu', taiLieuRoutes);
app.use('/api/cauhoi', cauHoiRoutes);
app.use('/api/baocao', baoCaoRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const db = (await import('./app/config/database.js')).default;
    
    const [docCount] = await db.execute('SELECT COUNT(*) as total FROM tailieu WHERE trangThaiTL = "show"');
    // Count only visible questions for public stats
    const [questionCount] = await db.execute('SELECT COUNT(*) as total FROM cauhoi WHERE trangThaiCH = "show"');
    const [studentCount] = await db.execute('SELECT COUNT(*) as total FROM sinhvien WHERE trangThaiTK = "active"');
    
    res.json({
      success: true,
      data: {
        documents: docCount[0].total,
        questions: questionCount[0].total,
        students: studentCount[0].total
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
