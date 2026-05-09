# Team Task Manager 🚀

A professional, production-ready **full-stack team task management platform** built with React.js, Express.js, and MongoDB. Features glassmorphic UI design, role-based access control, Kanban-style task boards, and real-time progress tracking.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/Express.js-4-000000?style=flat-square&logo=express)
![Tech Stack](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb)
![Tech Stack](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### 🔐 Authentication
- JWT-based signup & login
- Secure password hashing (bcrypt, 12 rounds)
- Persistent sessions with token storage
- Protected routes with auto-redirect

### 📁 Project Management
- Create, edit, and delete projects
- Project status tracking (Active, Completed, Archived)
- Task progress bars per project
- Member count and overview

### 👥 Team Management
- Add team members by email
- Role-based access: **Admin** & **Member**
- Remove members (admin only)
- Role assignment during invitation

### ✅ Task Management
- Full CRUD for tasks
- **Kanban-style board** with 4 columns: To Do → In Progress → Review → Completed
- Task assignment to team members
- Priority levels: Low, Medium, High, Urgent
- Due date tracking with overdue indicators
- Inline status change dropdowns
- Filter by status and priority

### 📊 Dashboard
- Overview statistics cards (Projects, Tasks, Completed, Overdue)
- Task status breakdown with animated progress bars
- Priority distribution chart
- Recent activity feed
- Personalized greeting

### 🎨 Design
- **Glassmorphic UI** with dark theme
- Indigo-Violet gradient accents
- **Framer Motion** animations throughout
- Responsive design (mobile, tablet, desktop)
- Custom scrollbars and glass input fields
- Inter font family

### 🛡️ Role-Based Access Control (RBAC)

| Action | Admin | Member |
|--------|-------|--------|
| Create project | ✅ | ✅ |
| Edit/Delete project | ✅ | ❌ |
| Add/Remove members | ✅ | ❌ |
| Create/Delete tasks | ✅ | ❌ |
| Edit tasks fully | ✅ | ❌ |
| Update task status | ✅ | ✅ (own tasks) |
| View project tasks | ✅ | ✅ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS v4, Framer Motion |
| **Backend** | Node.js, Express.js 4 |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Validation** | express-validator |
| **UI** | react-icons, react-hot-toast |

---

## 📂 Project Structure

```
Team-Task-Manager/
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout/         # Sidebar, Navbar, Layout
│   │   ├── contexts/           # AuthContext
│   │   ├── pages/              # Dashboard, Projects, ProjectDetail, MyTasks, Login, Register
│   │   ├── services/           # API service (axios)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Global styles + design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    # Express.js API
│   ├── config/                 # MongoDB connection
│   ├── controllers/            # Auth, Project, Task, Dashboard
│   ├── middleware/              # JWT auth, RBAC middleware
│   ├── models/                 # User, Project, Task schemas
│   ├── routes/                 # API route definitions
│   ├── utils/                  # JWT token generation
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas cloud)
- **npm** v9+

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Team-Task-Manager.git
cd Team-Task-Manager
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app
Navigate to `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create account |
| POST | `/login` | Login |
| GET | `/me` | Get current user |
| GET | `/users` | Search users |

### Projects (`/api/projects`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List user's projects |
| POST | `/` | Create project |
| GET | `/:id` | Get project details |
| PUT | `/:id` | Update project |
| DELETE | `/:id` | Delete project |
| POST | `/:id/members` | Add member |
| DELETE | `/:id/members/:userId` | Remove member |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create task |
| GET | `/project/:projectId` | Get project tasks |
| GET | `/my-tasks` | Get assigned tasks |
| GET | `/:id` | Get task |
| PUT | `/:id` | Update task |
| PATCH | `/:id/status` | Update status |
| DELETE | `/:id` | Delete task |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Dashboard statistics |
| GET | `/overdue` | Overdue tasks |

---

## 🗄️ Database Schema

### User
- `name`, `email` (unique), `password` (hashed), `avatar` (color), `role`

### Project
- `name`, `description`, `owner` → User, `members[]` (user + role), `status`

### Task
- `title`, `description`, `project` → Project, `assignee` → User, `createdBy` → User
- `status`, `priority`, `dueDate`, `tags[]`

---

## 🌐 Deployment

### Backend (Render / Railway)
1. Push backend code to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel / Netlify)
1. Push frontend code to GitHub
2. Connect to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add API URL environment variable

---

## 📄 License

MIT License — feel free to use this project for learning or production.
