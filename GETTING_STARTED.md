# 🚀 Getting Started with CrikApp

This guide will help you set up and run the CrikApp project from scratch.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] PostgreSQL installed and running ([Download](https://www.postgresql.org/download/))
- [ ] npm or yarn package manager
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] For mobile development:
  - [ ] Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
  - OR Xcode (for iOS simulator) / Android Studio (for Android emulator)

## Step-by-Step Setup

### 1️⃣ Database Setup

First, create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE crikapp;

# Exit psql
\q
```

Note your database credentials:

- Host: `localhost`
- Port: `5432` (default)
- User: `postgres` (or your user)
- Password: your password
- Database: `crikapp`

### 2️⃣ Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env` with your settings:

```env
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/crikapp?schema=public"

# JWT
JWT_SECRET="change-this-to-a-random-secret-key"
JWT_EXPIRES_IN="7d"

# Email (Gmail example)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-gmail-app-password"
EMAIL_FROM="noreply@crikapp.com"

# URLs
FRONTEND_URL="http://localhost:8081"
BACKEND_URL="http://localhost:3001"

# Environment
NODE_ENV="development"
```

**Gmail App Password Setup** (if using Gmail):

1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Generate App Password
4. Use that password in `EMAIL_PASSWORD`

**Generate Prisma Client and Run Migrations:**

```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

**Start Backend Server:**

```bash
npm run dev
```

Backend should now be running at `http://localhost:3001`

Test it: Open `http://localhost:3001/api/countries` in your browser

### 3️⃣ Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `frontend/.env`:

```env
# For local development
EXPO_PUBLIC_API_URL=http://localhost:3001/api

# For testing on physical device (use your computer's IP)
# EXPO_PUBLIC_API_URL=http://192.168.1.100:3001/api
```

**Find your computer's IP** (for physical device testing):

- **Windows**: `ipconfig` → Look for IPv4 Address
- **Mac/Linux**: `ifconfig` → Look for inet address

**Start Frontend:**

```bash
npm start
```

This will:

1. Start Metro bundler
2. Open Expo DevTools in your browser
3. Show a QR code

**Run on Device/Simulator:**

- **iOS Simulator**: Press `i` (requires Xcode on Mac)
- **Android Emulator**: Press `a` (requires Android Studio)
- **Physical Device**:
  1. Install Expo Go app
  2. Scan QR code with Expo Go (Android) or Camera (iOS)
  3. Make sure your device is on the same WiFi as your computer

## 🧪 Testing the App

### Test Authentication Flow

1. **Signup**:

   - Open the app
   - Click "Sign up"
   - Enter email and password
   - Click "Sign up"

2. **Onboarding**:

   - Select your country
   - Fill in your profile (name, username, etc.)
   - Follow some suggested users (optional)
   - Continue to home screen

3. **Logout and Login**:

   - Close and reopen the app
   - You should see the login screen
   - Login with your credentials

4. **Forgot Password**:
   - Click "Forgot Password"
   - Enter your email
   - Check your email for the code
   - Enter the code
   - Set a new password

## 📱 Development Workflow

### Running Both Servers

You'll need two terminal windows:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

### Making Changes

**Backend Changes:**

- API routes: `backend/src/app/api/`
- Database schema: `backend/prisma/schema.prisma`
- After schema changes: `npm run prisma:migrate`

**Frontend Changes:**

- Screens: `frontend/src/screens/`
- Components: `frontend/src/components/`
- State: `frontend/src/store/`
- Changes auto-reload via hot module replacement

### Debugging

**Backend:**

- Check terminal for errors
- Use `console.log()` for debugging
- Access Prisma Studio: `npm run prisma:studio`

**Frontend:**

- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- Select "Debug JS Remotely"
- Open Chrome DevTools

## 🔧 Common Issues & Solutions

### Issue: Database connection failed

**Solution:**

- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Test connection: `psql -U postgres -d crikapp`

### Issue: Prisma migrations fail

**Solution:**

```bash
cd backend
rm -rf prisma/migrations  # Careful: removes migration history
npm run prisma:migrate
```

### Issue: Frontend can't connect to backend

**Solution:**

- Ensure backend is running on port 3001
- Check `EXPO_PUBLIC_API_URL` in `frontend/.env`
- For physical device, use your computer's IP, not localhost
- Disable firewall/antivirus temporarily

### Issue: Expo Go app shows error

**Solution:**

- Clear cache: `npm start -- -c`
- Restart Metro: Close terminal and run `npm start` again
- Reinstall Expo Go app

### Issue: Email not sending

**Solution:**

- Check email credentials in `.env`
- For Gmail, ensure App Password is used (not regular password)
- Check spam folder
- Try a different email service (like Mailtrap for testing)

## 📚 Next Steps

Now that you have the app running, explore:

1. **Code Structure**: Read `PROJECT_STRUCTURE.md`
2. **API Documentation**: Check backend routes in `backend/src/app/api/`
3. **Add Features**: Start with the TODO list in the code
4. **Customize**: Modify colors in `frontend/src/constants/theme.ts`

## 🎨 Customization Quick Start

### Change App Colors

Edit `frontend/src/constants/theme.ts`:

```typescript
export const theme = {
  colors: {
    primary: "#FF6B9D", // Change this!
    background: "#1A1A2E", // And this!
    // ... more colors
  },
};
```

### Add a New API Endpoint

1. Create route file: `backend/src/app/api/your-endpoint/route.ts`
2. Define handler:

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello!" });
}
```

### Add a New Screen

1. Create screen: `frontend/src/screens/app/NewScreen.tsx`
2. Add route: `frontend/app/(app)/new-screen.tsx`
3. Import and export: `import { NewScreen } from '@/screens/app/NewScreen';`
4. Navigate: `router.push('/(app)/new-screen')`

## 🆘 Getting Help

- **Check Issues**: Look for similar issues in the project
- **Documentation**: Read `README.md` and `PROJECT_STRUCTURE.md`
- **Logs**: Always check terminal output for errors
- **Stack Overflow**: Search for specific error messages

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend server running on http://localhost:3001
- [ ] Database connected (check Prisma Studio)
- [ ] Frontend Expo running
- [ ] Can open app on device/simulator
- [ ] Can signup with new account
- [ ] Can receive password reset email
- [ ] Can navigate through onboarding
- [ ] Can see home screen

## 🎉 Success!

If all checks pass, you're ready to develop! Start by:

1. Creating a test account
2. Exploring the UI
3. Checking the API in Prisma Studio
4. Making small changes to understand the flow

Happy coding! 🚀
