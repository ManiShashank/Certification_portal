const Student = require('../models/Student');

// Get all students but filter their courses to only include 'Pass' entries
const getValidCertificates = async (req, res) => {
  try {
    const students = await Student.find({}, 'name usn courses email');
    
    let validRecords = [];
    
    students.forEach(student => {
      const passedCourses = student.courses.filter(course => course.status === 'Pass');
      
      passedCourses.forEach(course => {
        validRecords.push({
          studentName: student.name,
          usn: student.usn,
          studentEmail: student.email,
          semester: course.semester,
          courseName: course.courseName,
          platform: course.platform,
          duration: course.duration,
          examDate: course.examDate,
          certificateFile: course.certificateFile,
          courseId: course._id
        });
      });
    });

    res.json({ count: validRecords.length, records: validRecords });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getValidCertificates };
