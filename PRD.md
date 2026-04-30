# Product Requirements Document (PRD)

## 1. Project Title
Student Certification Management System

## 2. Objective
To build a centralized, secure, and user-friendly web application for managing student academic certifications. The system allows administrators to upload and manage student certificates while enabling students to view their earned certificates and track their total accumulated credits.

## 3. Target Audience
- **Administrators / Faculty:** Responsible for verifying and uploading student certificates and managing student records.
- **Students:** Users who want to track their academic progress, view their uploaded certificates, and see their total credit points.

## 4. User Roles & Permissions

### 4.1. Administrator Role
- **Authentication:** Secure login.
- **Dashboard Access:** Access to the Admin Dashboard.
- **Certificate Management:**
  - Upload certificate files (PDF, images) for specific students.
  - Assign credits to each uploaded certificate.
  - View a list of all uploaded certificates across all students.
  - (Optional) Edit or delete existing certificate records.
- **Student Management:** View and search for student profiles to assign certificates.

### 4.2. Student Role
- **Authentication:** Secure login and registration.
- **Dashboard Access:** Access to the Student Dashboard.
- **View Certificates:** View a list of their own uploaded certificates, including details like certificate name, date, and assigned credits.
- **Track Credits:** View the total sum of accumulated credits from all verified certificates.
- **View Files:** Ability to open or download the uploaded certificate files.

## 5. Functional Requirements
- **User Authentication:** System must support JWT-based authentication with encrypted passwords (bcrypt).
- **File Uploads:** System must allow administrators to upload files safely. Files should be stored securely (using Multer) and linked to the respective student's database record.
- **Real-time Credit Calculation:** The student's total credits must automatically recalculate when a new certificate is uploaded by an admin.
- **Responsive UI:** The application must be usable on both desktop and mobile devices.

## 6. Non-Functional Requirements
- **Security:**
  - Passwords must be hashed before saving to the database.
  - API endpoints must be protected; students cannot access admin routes, and students can only view their own data.
  - File uploads must be validated to prevent malicious files.
- **Performance:** Fast loading times for dashboards, optimized database queries for fetching certificates.
- **Tech Stack:**
  - Frontend: React (Vite), React Router, Axios
  - Backend: Node.js, Express.js
  - Database: MongoDB
- **Maintainability:** Code should be modular, following standard MVC (Model-View-Controller) architecture on the backend and component-based architecture on the frontend.

## 7. Future Enhancements (V2)
- **Email Notifications:** Notify students via email when a new certificate is uploaded or verified.
- **Certificate Verification System:** Implement QR codes on certificates for third-party verification.
- **Reporting & Analytics:** Allow admins to generate reports on student performance and certification trends.
- **Bulk Uploads:** Enable admins to upload certificates for multiple students via CSV.
