import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import './StudentDashboard.css';
import './StudentDashboardExt.css';
import './StudentDashboardExt2.css';
import { FaTrash, FaPlus } from 'react-icons/fa';

const StudentDashboard = () => {
  const [currentSemester, setCurrentSemester] = useState('');
  const [platform, setPlatform] = useState('');
  const [courses, setCourses] = useState([
    { courseName: '', duration: '', semesterOfClearance: '', examDate: '', status: '', certificateFile: null }
  ]);
  const [loggedCourses, setLoggedCourses] = useState([]);
  
  const userName = localStorage.getItem('userName') || 'Student';

  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboard = async () => {
    setIsFetching(true);
    try {
      const res = await api.get('/student/dashboard');
      setLoggedCourses(res.data.dashboard.courses || []);
    } catch (err) {
      console.error('Failed to fetch dashboard', err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAddCourse = () => {
    setCourses([...courses, { courseName: '', duration: '', semesterOfClearance: '', examDate: '', status: '', certificateFile: null }]);
  };

  const handleRemoveCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    
    // Reset file if status changes to Fail
    if (field === 'status' && value === 'Fail') {
      updatedCourses[index].certificateFile = null;
    }
    
    setCourses(updatedCourses);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF, JPG, or PNG file.');
        e.target.value = '';
        return;
      }
      const updatedCourses = [...courses];
      updatedCourses[index].certificateFile = file;
      setCourses(updatedCourses);
    }
  };

  const [formMsg, setFormMsg] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Basic Form Validation check
    if (!currentSemester) {
      setFormMsg({ text: 'Validation Error: Please explicitly select your current semester.', type: 'error' });
      setIsSubmitting(false);
      return;
    }
    if (!platform) {
      setFormMsg({ text: 'Validation Error: A certification platform is required before submitting.', type: 'error' });
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Prepare course payload
      const payloadCourses = courses.map(c => ({
        semester: Number(currentSemester),
        platform: platform,
        courseName: c.courseName,
        duration: c.duration,
        semesterOfClearance: Number(c.semesterOfClearance), // Mapped internally
        examDate: c.examDate,
        status: c.status
      }));

      // 2. Post courses
      const addRes = await api.post('/course/add', { courses: payloadCourses });
      
      // 3. Upload available certificates by matching return payload mapped array
      const addedCourses = addRes.data.student.courses;
      
      // The newly added courses are at the end of the array. Let's slice them.
      const newlyAddedStartIndex = addedCourses.length - courses.length;

      for (let i = 0; i < courses.length; i++) {
        if (courses[i].certificateFile && courses[i].status === 'Pass') {
          const internalId = addedCourses[newlyAddedStartIndex + i]._id;
          const formData = new FormData();
          formData.append('courseId', internalId);
          formData.append('certificate', courses[i].certificateFile);
          
          await api.post('/upload-certificate', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }

      setFormMsg({ text: 'All courses and certificates correctly saved to system!', type: 'success' });
      
      // Clear form and refetch courses
      setCourses([{ courseName: '', duration: '', semesterOfClearance: '', examDate: '', status: '', certificateFile: null }]);
      fetchDashboard();
      
      setTimeout(() => setFormMsg({ text: '', type: '' }), 4000);
      
    } catch (err) {
      const errorStr = err.response?.data?.message || 'Server encountered an issue saving courses.';
      setFormMsg({ text: `Critical Error: ${errorStr}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar userName={userName} role="Student" />
      <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Certification Dashboard</h1>
        <p>Log your academic certifications and track your progress securely.</p>
      </header>

      <div className="dashboard-card form-container">
        {formMsg.text && (
          <div className={`auth-error ${formMsg.type === 'success' ? 'success-msg' : ''}`} style={formMsg.type === 'success' ? { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' } : {}}>
            {formMsg.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Semester Selection */}
          <section className="form-section">
            <h2 className="section-title">1. Current Semester</h2>
            <div className="input-group">
              <label htmlFor="currentSemester">Select Semester</label>
              <select 
                id="currentSemester" 
                value={currentSemester} 
                onChange={(e) => setCurrentSemester(e.target.value)}
                required
              >
                <option value="" disabled>Choose...</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
              </select>
            </div>
          </section>

          {/* Section 2: Platform Selection */}
          <section className="form-section">
            <h2 className="section-title">2. Certification Platform</h2>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="platform" 
                  value="NPTEL" 
                  onChange={(e) => setPlatform(e.target.value)} 
                  required 
                />
                <span className="radio-custom"></span>
                NPTEL
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="platform" 
                  value="Udemy" 
                  onChange={(e) => setPlatform(e.target.value)} 
                  required 
                />
                <span className="radio-custom"></span>
                Udemy
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="platform" 
                  value="Coursera" 
                  onChange={(e) => setPlatform(e.target.value)} 
                  required 
                />
                <span className="radio-custom"></span>
                Coursera
              </label>
            </div>
          </section>

          {/* Section 3: Dynamic Courses */}
          <section className="form-section">
            <div className="section-header">
              <h2 className="section-title">3. Course Details</h2>
              <button type="button" className="btn-add" onClick={handleAddCourse}>
                <FaPlus /> Add Course
              </button>
            </div>

            <div className="courses-list">
              {courses.map((course, index) => (
                <div key={index} className="course-entry">
                  <div className="course-entry-header">
                    <h3>Entry #{index + 1}</h3>
                    {courses.length > 1 && (
                      <button 
                        type="button" 
                        className="btn-remove" 
                        onClick={() => handleRemoveCourse(index)}
                        title="Remove Course"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  
                  <div className="course-fields">
                    <div className="input-group">
                      <label>Course Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Machine Learning"
                        value={course.courseName}
                        onChange={(e) => handleCourseChange(index, 'courseName', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Duration (Weeks/Hours)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 12 Weeks"
                        value={course.duration}
                        onChange={(e) => handleCourseChange(index, 'duration', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Semester of Clearance</label>
                      <select 
                        value={course.semesterOfClearance}
                        onChange={(e) => handleCourseChange(index, 'semesterOfClearance', e.target.value)}
                        required
                      >
                        <option value="" disabled>Choose...</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                      </select>
                    </div>
                    
                    <div className="input-group">
                      <label>Exam Date</label>
                      <input 
                        type="date" 
                        value={course.examDate}
                        onChange={(e) => handleCourseChange(index, 'examDate', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Exam Status</label>
                      <select 
                        value={course.status}
                        onChange={(e) => handleCourseChange(index, 'status', e.target.value)}
                        required
                      >
                        <option value="" disabled>Choose Status...</option>
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                      </select>
                    </div>

                    {course.status === 'Pass' && (
                      <div className="input-group file-upload-group">
                        <label>Upload Certificate (PDF, JPG, PNG)</label>
                        <div className="file-upload-wrapper">
                          <input 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(index, e)}
                            required={course.status === 'Pass'}
                            id={`file-upload-${index}`}
                            className="file-input"
                          />
                          <label htmlFor={`file-upload-${index}`} className="file-upload-btn">
                            Choose File
                          </label>
                          <span className="file-name">
                            {course.certificateFile ? course.certificateFile.name : 'No file chosen'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button type="submit" className="btn-submit" disabled={isSubmitting} style={isSubmitting ? {opacity: 0.7, cursor: 'not-allowed'} : {}}>
            {isSubmitting ? 'Saving...' : 'Save Information'}
          </button>
        </form>
      </div>

      <div className="semester-tracking-section">
        <h2 className="section-title text-center margin-top">Your Semester Progress</h2>
        
        {isFetching ? (
          <div className="empty-text text-center">Syncing dashboard data...</div>
        ) : (
          <div className="semester-cards-grid">
            {[5, 6, 7].map((sem) => {
            const semCourses = loggedCourses.filter(c => Number(c.semester) === sem);

            return (
              <div key={sem} className="semester-card">
                <div className="semester-card-header">
                  <h3>Semester {sem}</h3>
                  <span className="badge-count">{semCourses.length} Courses</span>
                </div>
                
                <div className="semester-card-body">
                  {semCourses.length === 0 ? (
                    <p className="empty-text">No courses logged yet.</p>
                  ) : (
                    <ul className="course-metrics-list">
                      {semCourses.map((course, idx) => (
                        <li key={idx} className="course-metric-item">
                          <div className="metric-primary">
                            <h4>{course.courseName}</h4>
                            <span className="metric-platform">{course.platform}</span>
                          </div>
                          <div className="metric-secondary">
                            <span className={`status-pill ${course.status.toLowerCase()}`}>
                              {course.status}
                            </span>
                            {course.certificateFile && (
                              <a 
                                href={`http://localhost:5000${course.certificateFile}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="cert-link"
                              >
                                View Cert
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
    </>
  );
};

export default StudentDashboard;
