# Amore Cakes Boutique - Admin Dashboard

Professional Admin Panel for managing products, orders, and customers.

## 🛠 Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB, JWT Auth
- **Database**: MongoDB

---

## 🚀 Steps to Run the Project

### 1. Prerequisites
Ensure you have **Node.js** and **MongoDB** installed and running on your system.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Seed initial data:
   This will create a default admin and sample products/orders.
   ```bash
   node seed.js
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   *The backend will run on `http://localhost:5000`*

### 3. Frontend Setup
1. Open a **new** terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev -- -p 3001
   ```
   *The frontend will run on `http://localhost:3001`*

---

## 🔐 Admin Access
Once both servers are running, open your browser and go to:
**[http://localhost:3001](http://localhost:3001)**

**Default Credentials:**
- **Email:** `admin@amore.com`
- **Password:** `admin123`

---

## 📂 Project Structure
- `/backend`: Express API, Mongoose models, and Auth middleware.
- `/frontend`: Next.js App Router, Tailwind components, and Dashboard pages.
