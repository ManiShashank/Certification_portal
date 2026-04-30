# Student Certification Management System

A full-stack web application designed to manage student certifications. It provides an academic dashboard for administrators to upload and manage student certificates and a student dashboard to view accumulated credits and certificates.

## 🚀 Technologies Used

### Frontend
- **React 19** - UI Library (Bootstrapped with Vite)
- **React Router DOM** - For client-side routing
- **Axios** - For making HTTP requests to the backend
- **React Icons** - For UI iconography

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database and Object Data Modeling (ODM)
- **JSON Web Tokens (JWT)** - For secure user authentication
- **Bcrypt** - For password hashing
- **Multer** - For handling file uploads (certificates)
- **CORS** - Cross-Origin Resource Sharing middleware
- **Dotenv** - Environment variable management

## ✨ Features

- **User Authentication:** Secure login and registration system with roles (Admin/Student).
- **Admin Dashboard:**
  - Upload student certificates and manage records.
  - View all uploaded certificates for students.
- **Student Dashboard:**
  - View individual certificates.
  - Track total accumulated credits.
- **Secure File Handling:** Certificates are securely uploaded and stored using Multer.

## 📂 Project Structure

```
.
├── client/                 # React Frontend (Vite)
│   ├── src/                # React components, pages, and API services
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js/Express Backend
│   ├── config/             # Database connection configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middlewares (auth, upload)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express API routes
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

## 🛠️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed and running locally, or a MongoDB Atlas connection string.

### 1. Clone the repository
```bash
git clone <repository-url>
cd stack
```

### 2. Setup the Backend
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
node server.js
# Or if you have nodemon installed:
# npm run dev 
```

### 3. Setup the Frontend
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application
The frontend will typically be running at `http://localhost:5173` and the backend at `http://localhost:5000`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is open-source and available under the ISC License.
