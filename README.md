# ShopHub - Inventory Management System

A modern, full-stack inventory management application built with **Next.js**, **Express.js**, and **MySQL**. Track products in real-time with an intuitive dashboard and secure admin authentication.

![Node.js](https://img.shields.io/badge/Node.js-v20+-green) ![React](https://img.shields.io/badge/React-18.3-blue) ![Next.js](https://img.shields.io/badge/Next.js-14.2-black) ![Express](https://img.shields.io/badge/Express-5.2-gray) ![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Project Pages](#-project-pages)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 📦 **Real-time Inventory Tracking** - Monitor product stock levels instantly
- 🔐 **Secure Admin Authentication** - JWT-based authentication with password hashing
- 📊 **Interactive Dashboard** - Admin dashboard for managing products
- 🛍️ **Product Management** - Add, update, and delete products
- 💅 **Modern UI** - Beautiful Next.js frontend with Tailwind CSS
- 🚀 **RESTful API** - Comprehensive backend API for all operations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend (inventory-app/)
- **Next.js 14.2** - React framework with file-based routing
- **React 18.3** - UI library
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **ESLint** - Code quality and style

### Backend (backend/)
- **Express.js 5.2** - Node.js web framework
- **MySQL2** - MySQL database driver
- **JWT (jsonwebtoken)** - Token-based authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

### Database
- **MySQL 8.0+** - Relational database

## 📁 Project Structure

```
ShopHub/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   └── products.js          # Product management endpoints
│   ├── db.js                    # Database connection
│   ├── server.js                # Express server setup
│   ├── seed.js                  # Database seeding script
│   ├── prisma.config.ts         # Prisma configuration
│   ├── package.json             # Backend dependencies
│   └── .gitignore               # Git ignore file
│
├── inventory-app/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.js          # Admin dashboard page
│   │   ├── login/
│   │   │   └── page.js          # Login page
│   │   ├── products/
│   │   │   └── page.js          # Products listing page
│   │   ├── layout.js            # Root layout
│   │   ├── page.js              # Home page
│   │   └── globals.css          # Global styles
│   ├── lib/
│   │   └── api.js               # API client functions
│   ├── public/                  # Static assets
│   ├── package.json             # Frontend dependencies
│   ├── next.config.mjs          # Next.js configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── jsconfig.json            # JavaScript config
│
├── .gitignore                   # Root git ignore
└── README.md                    # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MySQL** (v8.0 or higher) - [Download](https://www.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/its-harsh-here/ShopHub.git
cd ShopHub
```

### 2. Backend Setup

Navigate to backend directory and install dependencies:

```bash
cd backend
npm install
```

### 3. Frontend Setup

Navigate to inventory-app directory and install dependencies:

```bash
cd ../inventory-app
npm install
```

## 🔑 Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shopHub

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
```

**Note:** Keep your `.env` file secure and never commit it to version control.

### Frontend Environment Variables (Optional)

Create a `.env.local` file in the `inventory-app/` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Starting the Backend

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

Expected output:
```
Server running on port 5000
```

### Starting the Frontend

In a new terminal, navigate to the frontend directory:

```bash
cd inventory-app
npm run dev
```

The frontend will start on `http://localhost:3000`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

Before running the application, ensure your MySQL database is set up:

```bash
# Using MySQL command line
mysql -u root -p

# Create database
CREATE DATABASE shopHub;
USE shopHub;

# Create tables (run the schema from seed.js or create manually)
# Refer to the schema in backend/seed.js for table structure
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Admin login | ❌ No |
| POST | `/api/auth/register` | Admin registration | ❌ No |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | ❌ No |
| POST | `/api/products` | Add new product | ✅ Yes |
| PUT | `/api/products/:id` | Update product | ✅ Yes |
| DELETE | `/api/products/:id` | Delete product | ✅ Yes |

### Request/Response Examples

**Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Get Products**
```bash
GET /api/products

Response: 200 OK
[
  {
    "id": 1,
    "name": "Product Name",
    "description": "Product description",
    "price": 29.99,
    "quantity": 50
  }
]
```

## 🌐 Project Pages

### Frontend Routes

- **Home** (`/`) - Landing page with ShopHub intro and navigation
- **Login** (`/login`) - Admin authentication page
- **Products** (`/products`) - Public product listing
- **Dashboard** (`/dashboard`) - Admin dashboard for product management

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/its-harsh-here/ShopHub/issues).

---

**Happy coding! 🚀**

Built with ❤️ using modern web technologies.
