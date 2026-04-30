const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

dotenv.config();

connectDB();

const app = express();

// Seed Admin Account
const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: 'admin@admin.com' });
    if (!adminExists) {
      await Admin.create({ email: 'admin@admin.com', password: 'password123' });
      console.log('Admin account seeded: admin@admin.com | password123');
    }
  } catch (error) {
    console.error('Error seeding admin', error);
  }
};
seedAdmin();

const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Routes perfectly mapped to requested paths
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make uploads folder publicly accessible statically
app.use('/uploads', express.static('uploads'));

app.use('/student', studentRoutes);
app.use('/course', courseRoutes);
app.use('/admin', adminRoutes);
app.use('/upload-certificate', uploadRoutes);
app.use('/course', courseRoutes);
app.use('/admin', adminRoutes);
app.use('/upload-certificate', uploadRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
