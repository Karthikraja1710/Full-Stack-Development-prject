# ShopSphere – Full-Stack E-Commerce Application

[![Thiranex Internship Task 3](https://img.shields.io/badge/Thiranex%20Internship-Task%203-blue)](https://github.com/Karthikraja1710/Full-Stack-Development-prject)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supported-4169E1?logo=postgresql)](https://www.postgresql.org)

**ShopSphere** is a complete, full-stack E-Commerce Web Application developed for the **Thiranex Full-Stack Development Internship Task 3**. It features product management, JWT user authentication, server-enforced role-based access control (RBAC), shopping cart management, stock tracking, demo checkout flow, order placement, and an executive Admin dashboard.

---

## 🚀 Features Overview

### 🛍 Customer Experience
- **Product Catalog & Details**: Browse products, search by keywords, filter by categories (`Electronics`, `Fashion`, `Home & Kitchen`, `Sports & Fitness`, etc.), and sort by price or arrival date.
- **Stock Indicators**: Real-time stock status badges (`In Stock`, `Low Stock`, `Out of Stock`).
- **Shopping Cart**: Add products, adjust quantities (validated against available stock), remove items, clear cart, and live cart item counter badge.
- **Demo Checkout & Instant Order Placement**: Safe checkout form (Shipping Name, Email, Phone, Address, City, State, Postal Code) with atomic stock deduction and instant order confirmation.
- **Order History & Details**: View past orders, status tracking, itemized receipt breakdown, and recipient details.

### 🛡 Admin Control Panel (Role-Based Access Control)
- **Executive Dashboard**: KPI metrics for Total Revenue, Total Orders, Pending Orders, Delivered Orders, Catalog Products, and Registered Users.
- **Product Management**: Create new products, update existing details/price, manage stock levels, and delete products.
- **Order Management**: Inspect all customer orders, filter by status (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), and update order status in real time.
- **Server-Side Security Isolation**: Admin APIs check for valid JWT tokens and verify `role == "admin"`. Non-admin users attempting to call Admin endpoints are strictly rejected with `HTTP 403 Forbidden`.

---

## ⚡ Demo Test Credentials

The database automatically seeds default user and admin accounts on initial startup:

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :---: |
| **Demo Customer** | `user@shopsphere.com` | `user123` | `user` |
| **Demo Admin** | `admin@shopsphere.com` | `admin123` | `admin` |

*Note: You can also register a new account on the `/register` page.*

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 (Vite) with TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT Bearer Token Interceptors
- **State & Context**: AuthContext, CartContext, ToastContext

### Backend
- **Framework**: Python FastAPI
- **Database ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Authentication & Security**: PyJWT + Passlib / Bcrypt

### Database
- **Primary Database**: PostgreSQL (Production)
- **Local Fallback**: SQLite (`shopsphere.db`) for instant zero-configuration local development

---

## 📂 Project Structure

```
ecommerce/
├── backend/
│   ├── app/
│   │   ├── dependencies/   # Auth & Admin role dependencies (get_current_user, get_current_admin)
│   │   ├── models/         # SQLAlchemy Models (User, Product, CartItem, Order, OrderItem)
│   │   ├── routers/        # API Routers (Auth, Products, Cart, Orders, Admin)
│   │   ├── schemas/        # Pydantic schemas (User, Product, Cart, Order, AdminStats)
│   │   ├── services/       # Core business logic, stock reduction, & cart calculation
│   │   ├── database.py     # Database engine & session setup
│   │   ├── seed.py         # Initial seeder for default Admin & sample products
│   │   └── main.py         # FastAPI application entry point & CORS
│   ├── tests/
│   │   └── test_api.py     # Pytest automated integration test suite
│   ├── .env.example
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, ProductCard, ProductGrid, SearchBar, CategoryFilter, CartItem, CartSummary, CheckoutForm, OrderCard, AdminSidebar, ProductFormModal, OrderTable, ProtectedRoute, AdminRoute, etc.)
│   │   ├── context/        # React Contexts (AuthContext, CartContext, ToastContext)
│   │   ├── pages/          # Customer & Admin pages (Home, ProductsPage, ProductDetailPage, CartPage, CheckoutPage, OrdersPage, OrderDetailPage, Login, Register, AdminDashboard, AdminProducts, AdminOrders, NotFoundPage)
│   │   ├── services/       # Axios API client
│   │   ├── types/          # TypeScript interfaces
│   │   ├── App.tsx         # Routing & Layout configuration
│   │   ├── index.css       # Tailwind CSS setup
│   │   └── main.tsx        # React entry point
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
├── README.md               # Documentation
└── .gitignore
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
# PostgreSQL Database Connection Example:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/shopsphere_db

# Local SQLite Fallback (default):
DATABASE_URL=sqlite:///./shopsphere.db

# JWT Secret Key
JWT_SECRET=shopsphere_jwt_secret_key_thiranex_internship_2026

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```

---

## ⚙️ Installation & Running Locally

### 1. Backend Setup
```bash
cd ecommerce/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run FastAPI backend server
python -m app.main
```
Backend will start at **`http://127.0.0.1:8000`**. Interactive Swagger API documentation is available at **`http://127.0.0.1:8000/docs`**.

### 2. Frontend Setup
```bash
cd ecommerce/frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend app will start at **`http://localhost:5173`**.

---

## 🧪 Testing Procedure

Run the automated Pytest integration test suite covering authentication, product catalog browsing, cart stock limits, order placement, stock reduction, and RBAC admin authorization security:

```bash
cd ecommerce/backend
python -m pytest tests/test_api.py -v
```

Expected output:
```
tests/test_api.py::test_health_check PASSED
tests/test_api.py::test_product_catalog_browsing PASSED
tests/test_api.py::test_user_flow_and_checkout PASSED
tests/test_api.py::test_role_based_access_control_security PASSED
tests/test_api.py::test_admin_dashboard_and_management_flow PASSED
======================== 5 passed in 5.58s ========================
```

Validate Frontend Production Build:
```bash
cd ecommerce/frontend
npm run build
```

---

## 📡 API Endpoints Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register customer user account | No |
| `POST` | `/api/auth/login` | Authenticate user/admin credentials and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile details | Yes |

### Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/products` | Browse catalog with search, category filter, and sorting | No |
| `GET` | `/api/products/{id}` | Retrieve individual product details | No |
| `POST` | `/api/products` | Create a new product | **Admin Only** |
| `PUT` | `/api/products/{id}` | Update product details/stock quantity | **Admin Only** |
| `DELETE` | `/api/products/{id}` | Remove product from store | **Admin Only** |

### Cart (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/cart` | View items in shopping cart & subtotal | Yes |
| `POST` | `/api/cart` | Add product to cart (validated against stock) | Yes |
| `PUT` | `/api/cart/{item_id}` | Update item quantity | Yes |
| `DELETE` | `/api/cart/{item_id}` | Remove item from cart | Yes |

### Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/orders` | Checkout & place order (deducts stock & clears cart) | Yes |
| `GET` | `/api/orders` | Fetch user's order history | Yes |
| `GET` | `/api/orders/{id}` | View individual order details | Yes |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/admin/stats` | Retrieve store KPIs (revenue, order counts, users) | **Admin Only** |
| `GET` | `/api/admin/orders` | View all customer orders | **Admin Only** |
| `PUT` | `/api/admin/orders/{id}/status` | Update order status | **Admin Only** |

---

## 🗄️ Database Schema

### `users`
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `name`: VARCHAR(100) NOT NULL
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `password_hash`: VARCHAR(255) NOT NULL
- `role`: VARCHAR(20) DEFAULT 'user' (`user` or `admin`)
- `created_at`: TIMESTAMP DEFAULT UTC NOW

### `products`
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `name`: VARCHAR(200) NOT NULL
- `description`: TEXT NULLABLE
- `price`: FLOAT NOT NULL
- `category`: VARCHAR(100) NOT NULL
- `image_url`: VARCHAR(500) NULLABLE
- `stock_quantity`: INTEGER DEFAULT 0
- `created_at`: TIMESTAMP DEFAULT UTC NOW
- `updated_at`: TIMESTAMP DEFAULT UTC NOW

### `cart_items`
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `user_id`: INTEGER FOREIGN KEY (`users.id` ON DELETE CASCADE)
- `product_id`: INTEGER FOREIGN KEY (`products.id` ON DELETE CASCADE)
- `quantity`: INTEGER DEFAULT 1
- `created_at`: TIMESTAMP DEFAULT UTC NOW

### `orders`
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `user_id`: INTEGER FOREIGN KEY (`users.id` ON DELETE CASCADE)
- `total_amount`: FLOAT NOT NULL
- `status`: VARCHAR(30) DEFAULT 'Pending'
- `shipping_name`: VARCHAR(100) NOT NULL
- `shipping_email`: VARCHAR(255) NOT NULL
- `shipping_phone`: VARCHAR(50) NOT NULL
- `shipping_address`: VARCHAR(500) NOT NULL
- `created_at`: TIMESTAMP DEFAULT UTC NOW
- `updated_at`: TIMESTAMP DEFAULT UTC NOW

### `order_items`
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `order_id`: INTEGER FOREIGN KEY (`orders.id` ON DELETE CASCADE)
- `product_id`: INTEGER FOREIGN KEY (`products.id` ON DELETE SET NULL)
- `quantity`: INTEGER NOT NULL
- `unit_price`: FLOAT NOT NULL

---

## 🐙 GitHub Push & Deployment Instructions

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Feat: Complete ShopSphere Full-Stack E-Commerce SaaS Application for Thiranex Task 3"
git push origin main
```

### 2. Deployment Guide (Render / Vercel / Railway)
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

- [x] Full-stack E-Commerce application created in workspace with React frontend and FastAPI backend
- [x] User authentication (Register, Login, Logout, Profile, Protected Routes)
- [x] Passwords securely hashed with bcrypt (never stored in plain text)
- [x] JWT token authentication implemented and verified on API routes
- [x] Server-enforced Role-Based Access Control (RBAC) ensuring normal users cannot call Admin APIs
- [x] Product catalog with category filtering, keyword search, price sorting, and stock status indicators
- [x] Shopping cart with quantity adjustment, stock limit checks, subtotal, and total calculation
- [x] Demo checkout flow creating orders, atomically reducing product stock, and clearing cart
- [x] Order history and detailed receipt views for customers
- [x] Executive Admin dashboard showing store KPIs (Total Revenue, Orders, Products, Users)
- [x] Admin product management (Create, Edit, Update Stock, Delete)
- [x] Admin order management (View All Orders, Update Order Statuses)
- [x] PostgreSQL & SQLite database support with `.env.example`
- [x] Automated Pytest integration test suite passing 100% (5/5 tests passed)
- [x] Frontend production bundle compiled without errors (`npm run build`)
- [x] Comprehensive [`README.md`](file:///g:/New%20folder/Thiranex/Theranex-project%202/Full-Stack-Development-prject/ecommerce/README.md) documentation created

---

Developed with ❤️ for **Thiranex Internship Task 3**.
