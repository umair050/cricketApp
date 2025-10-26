# 🎬 CrikApp - Social Media Platform

A modern TikTok-like social media application with a Next.js backend and React Native frontend.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)

## 📋 Overview

CrikApp is a full-stack social media application featuring:

- 🔐 **Complete Authentication System** - Signup, Login, Forgot Password, Reset Password
- 👤 **User Onboarding** - Country selection, profile setup, follow suggestions
- 📱 **TikTok-like Interface** - Vertical video feed with engagement features
- 🎯 **Modern Tech Stack** - Next.js, React Native, Prisma, Zustand, React Query
- 🗄️ **Database First Approach** - Prisma migrations for schema management

## 🏗️ Project Structure

```
CrikApp/
├── backend/               # Next.js API Backend
│   ├── src/
│   │   ├── app/api/      # API Routes
│   │   ├── lib/          # Utilities (prisma, auth, email)
│   │   └── middleware/   # Authentication middleware
│   ├── prisma/           # Database schema and migrations
│   └── package.json
│
├── frontend/             # React Native Mobile App
│   ├── app/             # Expo Router navigation
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── screens/     # Screen components
│   │   ├── services/    # API services
│   │   ├── store/       # Zustand state management
│   │   ├── hooks/       # Custom React hooks
│   │   ├── config/      # Configuration files
│   │   └── constants/   # Theme and constants
│   └── package.json
│
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Expo CLI (for mobile development)
- iOS Simulator or Android Emulator (optional)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and settings

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Backend will be available at `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your backend API URL

# Start Expo development server
npm start
```

Then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app

## 📚 Tech Stack

### Backend

- **Framework**: Next.js 14
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Email**: Nodemailer
- **Validation**: Zod
- **Language**: TypeScript

### Frontend

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: Zustand (local state)
- **Server State**: TanStack React Query
- **HTTP Client**: Axios
- **Language**: TypeScript
- **Storage**: AsyncStorage

## 🎨 Features

### ✅ Authentication

- [x] Email/Password signup
- [x] Email/Password login
- [x] Forgot password with email code
- [x] Reset password
- [ ] Social authentication (Facebook, Google, Apple) - Coming soon

### ✅ User Onboarding

- [x] Country selection
- [x] Profile setup (name, username, photo, bio, occupation)
- [x] Follow suggested users

### ✅ Home Feed

- [x] TikTok-like interface
- [x] User stories
- [x] Action buttons (like, comment, save, share)
- [x] Bottom navigation
- [ ] Video playback - Coming soon
- [ ] Infinite scroll - Coming soon

### 🔮 Coming Soon

- [ ] Video upload and recording
- [ ] Comments system
- [ ] Direct messaging
- [ ] User profiles
- [ ] Notifications
- [ ] Search functionality
- [ ] Hashtags and trends

## 🔑 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/crikapp"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="noreply@crikapp.com"
FRONTEND_URL="http://localhost:8081"
BACKEND_URL="http://localhost:3001"
```

### Frontend (.env)

```env
EXPO_PUBLIC_API_URL="http://localhost:3001/api"
```

## 📱 API Endpoints

### Authentication

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-reset-code` - Verify reset code
- `POST /api/auth/reset-password` - Reset password

### User

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/suggestions` - Get suggested users
- `POST /api/user/follow` - Follow user
- `DELETE /api/user/follow` - Unfollow user

### Countries

- `GET /api/countries` - Get countries list

## 🗄️ Database Schema

Key models:

- **User** - User accounts and profiles
- **PasswordReset** - Password reset codes
- **Post** - User posts/videos
- **Like** - Post likes
- **Comment** - Post comments
- **Follow** - User follow relationships

## 🎯 State Management

### Zustand Stores

- **authStore** - Authentication state (user, token, login/logout)
- **appStore** - Application state (onboarding, UI state)

### React Query

- Automatic caching and refetching
- Optimistic updates
- Error handling
- 5-minute stale time
- 2 retry attempts

## 🛠️ Development

### Run Backend

```bash
cd backend
npm run dev        # Start dev server
npm run prisma:studio  # Open Prisma Studio
```

### Run Frontend

```bash
cd frontend
npm start          # Start Expo
npm run android    # Run on Android
npm run ios        # Run on iOS
```

### Database Migrations

```bash
cd backend
npm run prisma:migrate      # Create and apply migration
npm run prisma:generate     # Generate Prisma client
```

## 📦 Deployment

### Backend (Vercel/Railway/Render)

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations
4. Deploy Next.js app

### Frontend (EAS Build)

1. Install EAS CLI: `npm install -g eas-cli`
2. Configure: `eas build:configure`
3. Build: `eas build --platform ios/android`
4. Submit: `eas submit`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for modern social media experiences

## 🙏 Acknowledgments

- Design inspired by TikTok
- Built with modern best practices
- Optimized for performance and scalability

## 📞 Support

For support, email support@crikapp.com or open an issue.

---

**Note**: This is a learning/demo project. For production use, additional security measures, optimizations, and features should be implemented.
