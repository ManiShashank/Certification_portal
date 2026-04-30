const Student = require('../models/Student');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerStudent = async (req, res) => {
  try {
    const { name, usn, email, password } = req.body;
    
    if (!name || !usn || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (usn.length !== 10) {
      return res.status(400).json({ message: 'USN must be exactly 10 characters long' });
    }

    const studentExists = await Student.findOne({ $or: [{ usn }, { email }] });
    if (studentExists) {
      return res.status(400).json({ message: 'Student with this USN or Email already exists' });
    }

    const student = await Student.create({ name, usn, email, password });
    
    if (student) {
      res.status(201).json({
        _id: student._id,
        name: student.name,
        usn: student.usn,
        email: student.email,
        token: generateToken(student._id, 'student')
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { emailOrUsn, password } = req.body;
    const student = await Student.findOne({ $or: [{ email: emailOrUsn }, { usn: emailOrUsn }] });
    
    if (student && (await student.matchPassword(password))) {
      return res.json({
        _id: student._id,
        name: student.name,
        email: student.email,
        usn: student.usn,
        token: generateToken(student._id, 'student')
      });
    }
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id, 'admin')
      });
    }
    res.status(401).json({ message: 'Invalid Admin credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerStudent, loginStudent, loginAdmin, generateToken };
