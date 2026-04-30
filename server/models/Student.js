const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const courseSchema = new mongoose.Schema({
  semester: {
    type: Number,
    required: true,
    enum: [5, 6, 7]
  },
  platform: {
    type: String,
    required: true,
    enum: ['NPTEL', 'Udemy', 'Coursera']
  },
  courseName: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pass', 'Fail']
  },
  certificateFile: {
    type: String,
    default: null // Path to the uploaded document
  }
});

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  usn: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 10,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  courses: [courseSchema]
}, { timestamps: true });

// Hash password before saving
studentSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
studentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
