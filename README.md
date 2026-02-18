# 🔥 Krusha Fire - Security Management System (LocalStorage Version)

A complete React + Vite + Tailwind CSS application with **NO backend** - all data stored in localStorage.

## ✨ Features

- ✅ **No Backend Required** - 100% frontend, works offline
- ✅ **LocalStorage CRUD** - All operations save to localStorage
- ✅ **Role-Based Access** - Admin, Staff, Maintenance Team
- ✅ **Authentication** - Login & Signup with localStorage
- ✅ **8 Modules** - Dashboard, Clients, Guards, Equipment, Attendance, Salary, Invoices, Chat
- ✅ **Live Chat** - Real-time messaging (localStorage-based)
- ✅ **Responsive** - Mobile, Tablet, Desktop
- ✅ **Zero Dependencies** - No Axios, no backend APIs

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔐 Default Credentials

**Admin:**
- Email: admin@krushafire.com
- Password: admin123

**Staff:**
- Email: staff@krushafire.com
- Password: staff123

**Maintenance:**
- Email: maintenance@krushafire.com
- Password: maintenance123

## 📁 Project Structure

```
src/
├── components/
│   └── common/          # Reusable components
├── pages/               # All page components
├── context/             # AuthContext
├── services/            # localStorage services
└── utils/               # Helper functions
```

## 🎯 Role Permissions

| Feature | Admin | Staff | Maintenance |
|---------|-------|-------|-------------|
| Dashboard | ✅ | ✅ | ✅ |
| Clients | ✅ | ✅ | ❌ |
| Guards | ✅ | ✅ | ❌ |
| Equipment | ✅ | ✅ | ✅ |
| Attendance | ✅ | ✅ | ✅ |
| Salary | ✅ | ✅ | ❌ |
| Chat | ✅ | ✅ | ✅ |
| Delete | ✅ | ❌ | ❌ |

## 💾 Data Storage

All data is stored in localStorage with these keys:
- `users` - User accounts
- `currentUser` - Logged-in user
- `clients` - Client records
- `guards` - Guard records
- `equipment` - Equipment records
- `attendance` - Attendance records
- `salaries` - Salary records
- `invoices` - Invoice records
- `messages` - Chat messages

## 🛠️ Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router v6
- Lucide React (icons)

## 📝 License

© 2025 Krusha Fire Security Management
