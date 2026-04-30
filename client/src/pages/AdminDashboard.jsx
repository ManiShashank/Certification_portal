import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [passedRecords, setPassedRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/certificates');
      setPassedRecords(res.data.records);
    } catch (err) {
      console.error('Failed fetching certificates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // First filter, then sort
  const filteredAndSortedRecords = passedRecords
    .filter(record => 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.platform.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.semester - a.semester;
      }
      return a.semester - b.semester;
    });

  return (
    <>
      <Navbar userName="Site Admin" role="Admin" />
      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="admin-header-content">
            <h1>Admin Portal</h1>
            <p>Review passed certifications from students</p>
          </div>
        </header>

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search by Student, USN, Course, or Platform..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1rem' }}
          />
          <button 
            onClick={handleSortToggle}
            title="Sort by Semester"
            style={{ padding: '0.8rem 1.2rem', whiteSpace: 'nowrap', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}
          >
            Sem Sort ({sortOrder.toUpperCase()})
          </button>
        </div>

        <div className="admin-card table-container">
          {isLoading ? (
             <div className="empty-state">Loading student records...</div>
          ) : filteredAndSortedRecords.length === 0 ? (
          <div className="empty-state">No passed records found matching your search.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>USN</th>
                <th>Sem</th>
                <th>Platform</th>
                <th>Course</th>
                <th>Proof</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedRecords.map((record, idx) => (
                <tr key={idx}>
                  <td className="fw-600">{record.studentName}</td>
                  <td>{record.usn}</td>
                  <td>{record.semester}</td>
                  <td><span className={`platform-badge ${record.platform.toLowerCase()}`}>{record.platform}</span></td>
                  <td>{record.courseName}</td>
                  <td>
                    <a 
                      href={`http://localhost:5000${record.certificateFile}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="link-proof"
                    >
                      View Cert
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
