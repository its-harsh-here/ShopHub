# 🚀 Inventory Management System — Full Copy-Paste Plan

---

## 🧠 Core Idea

* Public users → can view products (no login required)
* Admin → can login and manage inventory (add/edit/delete)
* Clean, simple, scalable system

---

## 🏗️ Tech Stack

### Frontend

* Next.js (React)
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MySQL

### ORM

* Prisma

### Authentication

* JWT (JSON Web Tokens)

---

## 🧱 Architecture

Frontend (Next.js)
↓
Backend (Express API)
↓
MySQL (via Prisma)

---

## 📄 Pages

### Public Pages

1. Home Page

   * App intro
   * Button → View Products

2. Products Page

   * List all products
   * Show:

     * Name
     * Price
     * Quantity
     * Description

3. Login Page

   * Admin login form

---

### Admin Pages (after login)

4. Dashboard

   * View all products (table)
   * Add product
   * Edit product
   * Delete product

---

## 🗃️ Database Schema (MySQL)

### Products Table

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  quantity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Admin Table

```sql
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255) -- hashed
);
```

---

## 🔌 Backend API

### Public Routes

```
GET /api/products
```

### Auth Route

```
POST /api/auth/login
```

### Admin Routes (Protected)

```
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

---

## 🔐 Auth Flow

1. Admin logs in
2. Backend verifies credentials
3. JWT token returned
4. Frontend stores token (localStorage)
5. Token sent in headers for protected routes

---

## 🧩 Backend Setup (Node + Express)

### Install Dependencies

```bash
npm init -y
npm install express cors dotenv jsonwebtoken bcrypt prisma @prisma/client
npx prisma init
```

---

### Prisma Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  price       Float
  quantity    Int
  createdAt   DateTime @default(now())
}

model Admin {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
}
```

---

### Run Migration

```bash
npx prisma migrate dev --name init
```

---

### Basic Server (`server.js`)

```javascript
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", require("./routes/products"));
app.use("/api/auth", require("./routes/auth"));

app.listen(5000, () => console.log("Server running on port 5000"));
```

---

### Auth Middleware (`middleware/auth.js`)

```javascript
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};
```

---

### Auth Route (`routes/auth.js`)

```javascript
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return res.status(400).json({ msg: "User not found" });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
```

---

### Product Routes (`routes/products.js`)

```javascript
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();

// GET all products (public)
router.get("/", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// ADD product (admin)
router.post("/", auth, async (req, res) => {
  const product = await prisma.product.create({ data: req.body });
  res.json(product);
});

// UPDATE product
router.put("/:id", auth, async (req, res) => {
  const product = await prisma.product.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(product);
});

// DELETE product
router.delete("/:id", auth, async (req, res) => {
  await prisma.product.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.json({ msg: "Deleted" });
});

module.exports = router;
```

---

## 🎨 Frontend Setup (Next.js)

### Install

```bash
npx create-next-app@latest inventory-app
cd inventory-app
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### API Helper (`lib/api.js`)

```javascript
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default API;
```

---

### Products Page (`app/products/page.js`)

```javascript
"use client";
import { useEffect, useState } from "react";
import API from "../../lib/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map(p => (
        <div key={p.id}>
          <h2>{p.name}</h2>
          <p>{p.description}</p>
          <p>₹{p.price}</p>
          <p>Stock: {p.quantity}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### Login Page (`app/login/page.js`)

```javascript
"use client";
import { useState } from "react";
import API from "../../lib/api";

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });

  const handleLogin = async () => {
    const res = await API.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    alert("Logged in!");
  };

  return (
    <div>
      <input placeholder="Username" onChange={e => setData({...data, username: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setData({...data, password: e.target.value})} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

---

### Dashboard (Basic Idea)

* Fetch products
* Show table
* Add/Edit/Delete buttons
* Send JWT in headers

Example header:

```javascript
headers: {
  Authorization: localStorage.getItem("token")
}
```

---

## 🚀 Deployment

Frontend:

* Vercel

Backend:

* Render / Railway

Database:

* Railway MySQL / PlanetScale

---

## 🔥 Upgrade Ideas

* Search & filter
* Pagination
* Image upload
* Low stock alerts
* Export CSV
* Role-based access

---

## ⚠️ Important Notes

* Always hash passwords using bcrypt
* Never expose JWT secret
* Validate inputs (use Zod or Joi later)
* Keep frontend/backend separate

---

## 🎯 Build Order

1. Setup backend + DB
2. Test APIs in Postman
3. Build frontend pages
4. Connect APIs
5. Add auth protection
6. Build dashboard

---

## 💡 Vibe Coding Workflow

* Ask AI for:

  * components
  * API routes
  * UI improvements
* Copy → tweak → test → repeat

---

END 🚀
