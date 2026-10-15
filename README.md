# 📦 InventoryHub — Product Inventory Management System

A production-ready, full-stack **MERN (MongoDB, Express, React, Node.js)** application for managing product inventory with role-based access control, real-time search & filtering, light/dark themes, and modern Tailwind CSS design.

---

## 🌟 Key Features

### 🎨 Frontend (React + Vite + Tailwind CSS v4)
- **Modern UI/UX**: Sleek glassmorphism navigation, responsive cards, micro-interactions, and Lucide icons.
- **🌗 Dark / Light Mode**: Seamless theme switcher persisted in local storage with smooth color transitions.
- **🛡️ Role-Based Access Control (RBAC)**:
  - **Admin**: Full CRUD capabilities (Create, Read, Update, Delete products).
  - **Member / User**: View catalog, inspect product details, search, filter, and sort in read-only mode.
- **🔍 Smart Filter Toolbar**: Integrated product search (matches by product name), category filtering, multi-field sorting (price, stock, newest), and pagination.
- **👁️ Password Visibility**: Show/hide password eye toggle on both Sign In and Sign Up pages.
- **🔔 Toast & Confirmation Modals**: Instant feedback for successful actions, warnings, and deletion confirmations.
- **📱 Fully Responsive**: Tailored for all screen sizes from mobile to wide desktop.

### ⚙️ Backend (Node.js + Express + MongoDB Atlas)
- **RESTful API**: Clean, decoupled MVC architecture with controllers, services, and routes.
- **☁️ Cloud Database**: Connected to MongoDB Atlas with optimized indexes on product name, category, and price.
- **🔐 JWT Authentication**: Secure authentication with bcryptjs password hashing and role-based route middleware (`authorize('admin')`).
- **🛡️ Security & Performance**:
  - `helmet` for secure HTTP headers.
  - `cors` configured for local and production origins.
  - `express-rate-limit` to protect authentication endpoints from brute-force attacks.
  - Centralized error handling with structured `ApiError` responses.
- **🌱 Data Seeding**: Ready-to-run seed scripts for instant admin account creation and catalog population.

---

## 🏗️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, Axios, React Router v7 |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose |
| **Database** | MongoDB Atlas (Cloud) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Tooling** | Git, npm, Postman |

---

## 📂 Project Structure

```text
project/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── api/                # Axios instance & request interceptors
│   │   ├── components/         # Reusable UI components (Navbar, FilterToolbar, ProductCard, etc.)
│   │   ├── context/            # React Context (AuthContext, ThemeContext, ToastContext)
│   │   ├── pages/              # Views (Login, Register, ProductList, ProductDetail, ProductForm)
│   │   ├── routes/             # Protected and Admin route guards
│   │   ├── index.css           # Tailwind CSS imports & theme definitions
│   │   └── App.jsx             # App layout & routing structure
│   ├── .env.example            # Client environment template
│   └── package.json
│
├── server/                     # Backend Express.js REST API
│   ├── src/
│   │   ├── config/             # MongoDB connection configuration
│   │   ├── controllers/        # Request handlers (authController, productController)
│   │   ├── middleware/         # Auth, role authorization, and error handling
│   │   ├── models/             # Mongoose schemas (User, Product)
│   │   ├── routes/             # Express routes (authRoutes, productRoutes)
│   │   ├── scripts/            # Database seed scripts (seedAdmin, seedProducts)
│   │   └── utils/              # ApiError, asyncHandler, generateToken helpers
│   ├── .env.example            # Server environment template
│   └── package.json
│
├── .gitignore                  # Root git exclusion rules
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file by copying `.env.example`:
   ```bash
   copy .env.example .env     # On Windows
   # or
   cp .env.example .env       # On macOS/Linux
   ```

4. Configure your `.env` with your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.v2fpf7d.mongodb.net/product_inventory
   JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173

   ADMIN_NAME=Super Admin
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=change_me_strong_password
   ```

5. Seed the database with the default Admin and sample products:
   ```bash
   npm run seed:admin
   npm run seed:products
   ```

6. Start the backend server:
   ```bash
   npm run start
   # or for auto-reload during development:
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` exists with the backend API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 🔑 Default Test Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `change_me_strong_password` | Full CRUD (Add, Edit, Delete, View all products) |
| **Member** | Register a new account on `/register` | (your password) | Read-only catalog view, Search, Filter, Sort |

---

## 📡 API Endpoints

### 🔐 Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`role: 'user'`) |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile |
| `POST` | `/api/auth/logout` | Authenticated | Logout user session |

### 📦 Product Routes (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Authenticated | Get paginated products with search & filters |
| `GET` | `/api/products/:id` | Authenticated | Get single product by ID |
| `POST` | `/api/products` | **Admin Only** | Create a new inventory product |
| `PUT` | `/api/products/:id` | **Admin Only** | Update an existing product |
| `DELETE` | `/api/products/:id` | **Admin Only** | Remove a product from inventory |

#### Query Parameters for `GET /api/products`:
- `search`: Case-insensitive search on product name.
- `category`: Filter by category (e.g., `Electronics`, `Footwear`, `Accessories`, `Furniture`).
- `sortBy`: Field to sort by (`createdAt`, `price`, `stock`, `name`).
- `sortOrder`: `asc` or `desc`.
- `page`: Page number (default: `1`).
- `limit`: Items per page (default: `8`).

---

## 🧪 Building for Production

To build the client bundle for production:
```bash
cd client
npm run build
```
The optimized static files will be generated in `client/dist/`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
