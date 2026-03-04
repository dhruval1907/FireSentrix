# 🔥 Fire & Security Management System

### Role-Based Security Operations Dashboard Built with React and LocalStorage

The **Fire & Security Management System** is a frontend-only web application designed to manage security operations efficiently.
It allows administrators and staff to manage guards, clients, equipment, attendance, and salaries while providing role-based access control and a local chat system.

This project is built entirely with **React + Vite + Tailwind CSS** and runs **without any backend or API**. All application data is stored and managed using **LocalStorage**, making the system fast and easy to deploy.

---

# 🚀 What This Project Can Do

* Secure user authentication system
* Role-based access control (Admin, Staff, Maintenance)
* Manage security guards and clients
* Track equipment and maintenance schedules
* Record guard attendance
* Generate and manage salary records
* Local chat system between users
* Fully functional CRUD operations
* Fast performance with no backend dependency

---

# ✨ Key Features

## Authentication System

* Signup and Login functionality
* User data stored in LocalStorage
* Logged-in user stored as `currentUser`
* Protected routes for secure access

User structure stored in LocalStorage:

```
{
  id,
  name,
  email,
  password,
  role
}
```

---

# 👥 Role-Based Access Control

| Role             | Permissions                             |
| ---------------- | --------------------------------------- |
| Admin            | Full access to all modules              |
| Staff            | Cannot delete users                     |
| Maintenance Team | Access only to equipment and attendance |

---

# 📦 System Modules

## Clients Management

* Add new clients
* Edit client information
* Delete clients

Stored under LocalStorage key:

```
clients
```

---

## Guards Management

* Add guards
* Edit guard information
* Delete guards

Stored under:

```
guards
```

---

## Equipment Management

* Add equipment
* Update equipment details
* Delete equipment
* Detect overdue maintenance automatically

Stored under:

```
equipment
```

---

## Attendance System

* Mark guards as present or absent
* Attendance tracked by date

Stored under:

```
attendance
```

---

## Salary Management

* Generate salary records
* Mark salaries as paid

Stored under:

```
salaries
```

---

# 💬 Local Chat System

The application includes a simulated real-time chat system where users can communicate with each other.

Message structure:

```
{
  id,
  senderId,
  receiverId,
  message,
  timestamp
}
```

Stored under:

```
messages
```

---

# 🛠 Tech Stack

Frontend

* React.js
* Vite

Styling

* Tailwind CSS

Routing

* React Router

State Management

* React Context API

Data Storage

* LocalStorage

---

# 📂 Project Structure

```
src
│
├── components
├── pages
├── context
├── utils
└── services
```

The project follows a **clean modular structure** for scalability and maintainability.

---

# ⚡ Performance Optimizations

* No backend API calls
* No Axios usage
* Optimized React hooks
* Avoided unnecessary re-renders
* Correct dependency arrays
* Efficient LocalStorage data handling

---

# ▶️ Running the Project

Clone the repository

```
git clone https://github.com/yourusername/fire-security-management-system.git
```

Install dependencies

```
npm install
```

Start development server

```
npm run dev
```

---

# 🎯 Purpose of the Project

This project demonstrates how to build a **complete role-based management dashboard using only frontend technologies**. It focuses on:

* Local data persistence
* Clean React architecture
* Role-based UI control
* Efficient CRUD operations
* Fast application performance

---

# 👨‍💻 Author

Your Name

GitHub:
LinkedIn:

---

# 📌 Project Tagline

**A Role-Based Security Operations Dashboard Built with React and LocalStorage**
