# Cricket Player Platform - Quick Start Guide

## 🏏 Project Setup Complete!

Your cricket platform with **NestJS backend** and **React frontend** is ready! The project includes separate login and register folders as requested.

## 📁 Project Structure

```
CricketApp/
├── backend/          # NestJS API Server
│   ├── src/
│   │   ├── auth/     # Authentication with JWT
│   │   ├── users/    # User management
│   │   ├── players/  # Player profiles
│   │   ├── teams/    # Team management
│   │   └── tournaments/ # Tournament system
├── frontend/         # React Web Application
│   └── src/
│       └── pages/
│           └── Auth/
│               ├── Login/     # ✅ Separate Login folder
│               └── Register/  # ✅ Separate Register folder
```

## 🚀 Getting Started

### Step 1: Database Setup

1. Install MySQL Server
2. Create database: `CREATE DATABASE cricket_app;`
3. Update credentials in `backend/.env`

### Step 2: Start Backend (Port 3001)

```bash
cd backend
npm run start:dev
```

### Step 3: Start Frontend (Port 3000)

```bash
cd frontend
npm install  # if not done yet
npm start
```

## 🔧 Backend Features

- **Authentication**: JWT-based login/register system
- **Database**: TypeORM with MySQL
- **API Docs**: Swagger UI at `http://localhost:3001/api`
- **Entities**: Users, Players, Teams, Tournaments

## 🎨 Frontend Features

- **Separate Auth Folders**: `/pages/Auth/Login/` and `/pages/Auth/Register/`
- **Responsive Design**: Tailwind CSS cricket theme
- **State Management**: React Query + Context API
- **Routing**: React Router v6

## 📝 API Endpoints

- **POST** `/auth/register` - User registration
- **POST** `/auth/login` - User login
- **GET** `/users/profile` - Get user profile
- **CRUD** `/players` - Player management
- **CRUD** `/teams` - Team management
- **CRUD** `/tournaments` - Tournament management

## 🔑 Default Environment

The backend is configured to run on port 3001 with these defaults:

- Database: `cricket_app` on localhost:3306
- JWT Secret: Configure in `.env` file
- Development environment ready

## 🛠 Next Steps

1. **Database**: Set up MySQL and update `.env` credentials
2. **Test API**: Visit `http://localhost:3001/api` for Swagger docs
3. **Frontend**: The React app will connect to the API automatically
4. **Authentication**: Use the separate login/register pages as requested

Your cricket platform is ready to run! 🎉
