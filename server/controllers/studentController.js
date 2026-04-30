const Student = require('../models/Student');

const addCourses = async (req, res) => {
  try {
    const { courses } = req.body;
    
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ message: 'Missing or invalid courses array' });
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    courses.forEach(course => student.courses.push(course));
    
    await student.save();
    
    res.status(201).json({ message: 'Courses added successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modified to accept courseId from req.body instead of URL param
const uploadCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Missing courseId in form data' });
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const course = student.courses.id(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.status !== 'Pass') {
      return res.status(400).json({ message: 'Certificate upload only allowed for passed courses' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    
    course.certificateFile = `/uploads/${req.file.filename}`;
    await student.save();
    
    res.json({ message: 'Certificate uploaded successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
       return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ dashboard: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { addCourses, uploadCertificate, getDashboard };
