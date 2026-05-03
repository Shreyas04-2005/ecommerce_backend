# 🛒 NestJS Ecommerce Backend

A scalable backend system built with **NestJS, Prisma, and PostgreSQL** for a complete ecommerce workflow including authentication, product management, cart system, and order processing.

---

## 🚀 Features

- 🔐 JWT Authentication
- 👮 Role-Based Access Control (USER / ADMIN)
- 📦 Product Management (CRUD)
- 🛒 Cart System (add, update, remove items)
- 🧾 Order Management
- 🔄 Order Status Workflow (PENDING → DELIVERED)
- ⚡ Prisma ORM with PostgreSQL
- 🧠 Stock validation system
- 🧩 Clean modular architecture (NestJS)

---

## 🏗️ Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Class Validator
- JWT Auth

---

## 📁 Project Structure

src/
├── prisma/
├── guards/
├── dto/
├── modules/
│ ├── auth/
│ ├── user/
│ ├── product/
│ ├── cart/
│ └── order/
└── main.ts

## ⚙️ Setup Instructions

```bash

Clone repository

git clone https://github.com/Shreyas04-2005/ecommerce_backend.git

cd ecommerce-backend

Install dependencies:
npm install

Create .env file:
DATABASE_URL="your_postgres_url"
JWT_SECRET="your_secret_key"

Run Prisma migrations:
npx prisma generate
npx prisma migrate dev

Start development server:
npm run start:dev

Author

Shreyas Patil

Backend Developer | Java | SpringBoot | NestJS 
