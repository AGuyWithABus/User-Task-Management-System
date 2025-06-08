# User & Task Management System

A clean, modern fullstack application built with React (TypeScript) frontend and Node.js/Express backend, featuring user management, task management, and secure direct messaging capabilities.

## 🚀 Features

### User Management
- Create and manage users with email validation
- Paginated user listing with search and sorting
- User selection for task and messaging operations

### Task Management
- Create tasks for specific users
- Task status management (completed/pending)
- Paginated task listing with filtering and search

### Secure Messaging
- Direct messaging between users
- Message encryption via RapidAPI Secure Messaging API
- Real-time message threads with unread indicators
- Glassmorphism UI design for modern chat experience

### UI/UX Features
- **Glassmorphism Design**: Beautiful glass-like interface with blur effects
- **Compact Layout**: Space-efficient design with narrow forms
- **Rounded Corners**: Modern form styling throughout
- **Responsive Design**: Works seamlessly on all devices
- **Interactive Elements**: Hover effects and smooth animations

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Create React App** for development setup
- **Custom CSS** with glassmorphism effects
- **Responsive Grid Layout**

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **SQLite** database with SQL queries
- **CORS** enabled for cross-origin requests
- **RapidAPI Integration** for secure messaging

### Database
- **SQLite** with relational schema
- **Users, Tasks, and Messages** tables
- **Foreign key relationships** and constraints

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm

### Backend Setup
```bash
cd backend
npm install
npm run build
npm start
```

The backend will run on `http://localhost:3001`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=3001
RAPIDAPI_KEY=your_rapidapi_key_here
```

### RapidAPI Setup
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to the Secure Messaging API
3. Add your API key to the `.env` file

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  recipient_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  encrypted_content TEXT,
  message_type TEXT NOT NULL CHECK (message_type IN ('direct')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users (id),
  FOREIGN KEY (recipient_id) REFERENCES users (id)
);
```

## 🎨 Design Features

### Glassmorphism UI
- **Translucent backgrounds** with backdrop blur effects
- **Subtle borders** and shadows for depth
- **Interactive hover states** with smooth transitions
- **Consistent glass theme** throughout the application

### Compact Layout
- **Narrow forms** for better space utilization
- **Efficient grid system** for responsive design
- **Optimized spacing** for clean appearance
- **Mobile-friendly** responsive breakpoints

### Modern Styling
- **Rounded corners** on all form elements
- **Gradient backgrounds** for visual appeal
- **Smooth animations** for better UX
- **Professional color scheme** with accessibility in mind

## 🔒 Security Features

### Message Encryption
- **RapidAPI Secure Messaging** integration
- **End-to-end encryption** for sensitive communications
- **Secure message validation** and integrity checks

### Data Protection
- **SQL injection prevention** with parameterized queries
- **Input validation** on both frontend and backend
- **CORS configuration** for secure cross-origin requests

## 📱 Usage

1. **Create Users**: Add users with name and email
2. **Select User**: Click on a user to manage their tasks
3. **Create Tasks**: Add tasks for the selected user
4. **Manage Tasks**: Toggle task completion status
5. **Send Messages**: Use the messaging system for direct communication

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Serve the build folder with your preferred static server
```

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [RapidAPI Secure Messaging](https://rapidapi.com/secure-messaging)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [SQLite Documentation](https://sqlite.org/docs.html)
