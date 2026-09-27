# TaskFlow – Task Management Application

[![Thiranex Internship Task 2](https://img.shields.io/badge/Thiranex%20Internship-Task%202-blue)](https://github.com/Karthikraja1710/Full-Stack-Development-prject)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supported-4169E1?logo=postgresql)](https://www.postgresql.org)

**TaskFlow** is a professional, full-stack Task Management SaaS application built for the **Thiranex Full-Stack Development Internship Task 2**. It empowers authenticated users to create, organize, filter, track, and manage their tasks seamlessly using an intuitive dashboard, Kanban-style board, interactive table list, and real-time WebSocket updates.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization
- **User Registration & Login**: JWT-based session token authentication with 24-hour expiration.
- **Secure Password Hashing**: Passwords stored using `bcrypt` salted hashes. Plain text passwords are **never** stored.
- **Protected Routes & Multi-Tenant User Isolation**: Strict server-side ownership enforcement ensuring User A can **never** access, view, edit, or delete User B's tasks.

### 📋 Task Management (CRUD)
- **Create Task**: Set title, description, priority (`Low`, `Medium`, `High`, `Critical`), status (`Todo`, `In Progress`, `Completed`), and due date.
- **Read Tasks**:
  - View all user's tasks.
  - Search by keyword in title or description.
  - Filter by status (`Todo`, `In Progress`, `Completed`).
  - Filter by priority (`Low`, `Medium`, `High`, `Critical`).
  - Sort by due date, creation date, priority, or title.
- **Update Task**: Inline status change, modal form editing, priority & due date updates.
- **Delete Task**: Safe modal confirmation dialog before permanent deletion.

### 📊 Dashboard & UI Views
- **Visual KPI Statistics**: Live metrics showing Total Tasks, Pending (Todo), In Progress, Completed, and Overdue tasks with progress percentage indicators.
- **Dual View Modes**:
  - **Kanban Board**: Drag-and-drop / column layout organized by `TODO`, `IN PROGRESS`, and `COMPLETED`.
  - **List Table View**: Structured table view for quick overview and batch inspection.
- **Real-Time WebSockets**: Instant live synchronization across browser tabs when tasks are created, updated, or deleted.
- **Toast Notifications**: Interactive status alerts for creation, updates, deletion, login, and error states.
- **Mobile Responsive Design**: Collapsible sidebar navigation drawer for mobile and tablet screens.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 (Vite) with TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT Bearer Interceptors
- **Real-Time Sync**: WebSockets (`useWebSocket` custom hook)

### Backend
- **Framework**: Python FastAPI
- **Database ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Authentication**: PyJWT + Passlib / Bcrypt
- **Real-Time Server**: FastAPI WebSockets Connection Manager

### Database
- **Primary Database**: PostgreSQL (Production)
- **Local Fallback**: SQLite (`taskflow.db`) for zero-setup local development

---

## 📂 Project Structure

```
task-management/
├── backend/
│   ├── app/
│   │   ├── dependencies/   # Auth dependency injection (get_current_user)
│   │   ├── models/         # SQLAlchemy DB Models (User, Task)
│   │   ├── routers/        # API Endpoints (Auth, Tasks, WebSockets)
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # Business logic & WebSockets manager
│   │   ├── database.py     # Database engine & session setup
│   │   └── main.py         # FastAPI application entry point
│   ├── tests/
│   │   └── test_api.py     # Pytest automated integration test suite
│   ├── .env.example        # Environment variables template
│   ├── .env                # Local environment configuration
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Sidebar, TaskBoard, TaskCard, TaskModal, etc.)
│   │   ├── context/        # React Contexts (AuthContext, ToastContext)
│   │   ├── hooks/          # Custom hooks (useWebSocket)
│   │   ├── pages/          # Pages (Login, Register, DashboardPage, TasksPage, NotFoundPage)
│   │   ├── services/       # Axios API client
│   │   ├── types/          # TypeScript interfaces
│   │   ├── App.tsx         # Routing & Main Layout
│   │   ├── index.css       # Tailwind CSS & animations
│   │   └── main.tsx        # React DOM entry point
│   ├── .env.example        # Frontend environment variables template
│   ├── .env                # Local frontend environment configuration
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind configuration
├── README.md               # Project documentation
└── .gitignore
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
# Database Connection (PostgreSQL example):
# DATABASE_URL=postgresql://postgres:password@localhost:5432/taskflow_db

# SQLite local fallback (default):
DATABASE_URL=sqlite:///./taskflow.db

# JWT Secret Key
JWT_SECRET=taskflow_jwt_secret_key_thiranex_internship_2026

# CORS Allowed Origins
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```

---

## ⚡ Installation & Local Setup

### 1. Prerequisites
- **Node.js**: v18+ & `npm`
- **Python**: v3.10+
- **PostgreSQL**: Optional for local dev (SQLite is enabled out-of-the-box).

### 2. Backend Setup
```bash
cd task-management/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI backend server
python -m app.main
```
The FastAPI backend will start at `http://127.0.0.1:8000` with interactive OpenAPI Swagger documentation at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
cd task-management/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend application will start at `http://localhost:5173`.

---

## 🧪 Testing Procedure

Run the automated Pytest integration test suite covering registration, authentication, task CRUD operations, filters, statistics, and user isolation security:

```bash
cd task-management/backend
python -m pytest tests/test_api.py -v
```

Expected output:
```
tests/test_api.py::test_health_check PASSED
tests/test_api.py::test_auth_and_task_crud_flow PASSED
======================== 2 passed in 1.50s ========================
```

To test frontend build correctness:
```bash
cd task-management/frontend
npm run build
```

---

## 📡 API Endpoints Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user and receive JWT token | No |
| `POST` | `/api/auth/login` | Authenticate user credentials and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch current authenticated user profile | Yes |

### Task Management (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks` | Fetch user's tasks with filters (`status`, `priority`, `q`, `sort_by`, `order`) | Yes |
| `POST` | `/api/tasks` | Create a new task for the current user | Yes |
| `GET` | `/api/tasks/stats` | Retrieve total, pending, in-progress, completed, overdue metrics | Yes |
| `GET` | `/api/tasks/{id}` | Retrieve individual task details (ownership verified) | Yes |
| `PUT` | `/api/tasks/{id}` | Update existing task details or status (ownership verified) | Yes |
| `DELETE` | `/api/tasks/{id}` | Delete task permanently (ownership verified) | Yes |

### WebSockets (`/api/ws`)
| Protocol | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `WS` | `/api/ws?token={jwt}` | Connect to live updates feed for authenticated user | Yes |

---

## 🗄️ Database Schema

### `users` Table
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| `name` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(255) | UNIQUE, INDEX, NOT NULL |
| `password_hash` | VARCHAR(255) | NOT NULL |
| `created_at` | TIMESTAMP | DEFAULT UTC NOW |

### `tasks` Table
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| `user_id` | INTEGER | FOREIGN KEY (`users.id` ON DELETE CASCADE), INDEX |
| `title` | VARCHAR(200) | NOT NULL |
| `description` | TEXT | NULLABLE |
| `priority` | VARCHAR(20) | NOT NULL DEFAULT 'Medium' (`Low`, `Medium`, `High`, `Critical`) |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'Todo' (`Todo`, `In Progress`, `Completed`) |
| `due_date` | TIMESTAMP | NULLABLE |
| `created_at` | TIMESTAMP | DEFAULT UTC NOW |
| `updated_at` | TIMESTAMP | DEFAULT UTC NOW |

---

## 🐙 GitHub Push & Deployment Instructions

### 1. Push Code to GitHub Repository
```bash
git add .
git commit -m "Feat: Complete TaskFlow Full-Stack Task Management SaaS App for Thiranex Task 2"
git push origin main
```

### 2. Deployment (Render / Vercel / Railway)
- **Backend (Render / Railway / Fly.io)**:
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - Environment Variables: Set `DATABASE_URL` (PostgreSQL), `JWT_SECRET`, and `CORS_ORIGINS`.
- **Frontend (Vercel / Netlify)**:
  - Framework Preset: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment Variable: Set `VITE_API_URL` to your live deployed backend API URL.

---

## ✅ Thiranex Submission Checklist

- [x] Full-stack architecture created in workspace with React frontend and FastAPI backend
- [x] User authentication (Register, Login, Logout, Protected Routes)
- [x] Passwords securely hashed using bcrypt (never stored in plain text)
- [x] JWT token authentication implemented and verified on all protected API routes
- [x] Strict user isolation: User A cannot access or mutate User B's tasks
- [x] Complete Task CRUD operations (Create, Read, Update, Delete)
- [x] Search, Filter (Status, Priority), and Sorting (Due Date, Created Date)
- [x] Executive Dashboard with visual statistics cards & overdue calculation
- [x] Kanban Board view (TODO, IN PROGRESS, COMPLETED) & Table List view
- [x] Real-Time WebSocket updates for instant multi-tab sync
- [x] Toast notifications & Delete confirmation dialogs
- [x] Mobile responsive drawer navigation and touch-friendly controls
- [x] PostgreSQL & SQLite dual database support with `.env.example`
- [x] Automated Pytest integration test suite passing 100%
- [x] Clean frontend production bundle (`npm run build` verified)

---

Developed with ❤️ for **Thiranex Internship Task 2**.
