# Team Task Manager 🚀

A modern full-stack team collaboration and task management platform built with React, Express, and MongoDB. It features secure authentication, role-based access control,sleek and responsive task management, and real-time project tracking with a sleek responsive design.

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
| Update task status | ✅ | ✅ |
| View project tasks | ✅ | ✅ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Auth** | JWT, bcryptjs |
| **UI** | react-icons |
