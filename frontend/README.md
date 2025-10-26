# CrikApp Mobile

React Native mobile app for CrikApp social media platform built with Expo.

## Features

- ✅ User Authentication (Login, Signup, Forgot Password, Reset Password)
- ✅ Account Onboarding (Country Selection, Profile Setup, Follow Users)
- ✅ Home Feed (TikTok-like interface)
- ✅ State Management with Zustand
- ✅ Server State with React Query
- ✅ Modern UI with custom theme

## Tech Stack

- **Framework**: React Native + Expo
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Server State**: React Query (TanStack Query)
- **API Client**: Axios
- **Language**: TypeScript

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the API URL:

```
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

For physical device testing, replace `localhost` with your computer's IP address.

### 3. Start Development Server

```bash
npm start
```

Then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Project Structure

```
frontend/
├── app/                        # Expo Router navigation
│   ├── (auth)/                # Authentication screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   ├── (onboarding)/          # Onboarding screens
│   │   ├── select-country.tsx
│   │   ├── fill-profile.tsx
│   │   └── follow-users.tsx
│   ├── (app)/                 # Main app screens
│   │   └── home.tsx
│   ├── _layout.tsx            # Root layout
│   └── index.tsx              # Entry point
├── src/
│   ├── components/            # Reusable components
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── SocialButton.tsx
│   ├── screens/               # Screen components
│   │   ├── auth/
│   │   ├── onboarding/
│   │   └── app/
│   ├── services/              # API services
│   │   ├── authService.ts
│   │   └── userService.ts
│   ├── store/                 # Zustand stores
│   │   ├── authStore.ts
│   │   └── appStore.ts
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useUser.ts
│   ├── config/                # Configuration
│   │   └── api.ts
│   └── constants/             # Constants
│       └── theme.ts
├── package.json
├── app.json                   # Expo configuration
└── tsconfig.json
```

## State Management

### Zustand (Local State)

Used for:

- Authentication state (user, token)
- Onboarding state
- UI state

### React Query (Server State)

Used for:

- API data fetching
- Cache management
- Automatic refetching
- Optimistic updates

## Key Features

### Authentication Flow

1. Login/Signup with email and password
2. Social authentication (Facebook, Google, Apple) - Coming soon
3. Forgot password with email code verification
4. Reset password

### Onboarding Flow

1. Select country from list
2. Fill profile information (name, username, DOB, phone, occupation)
3. Follow suggested users

### Home Screen

- TikTok-like video feed interface
- User stories at the top
- Action buttons (like, comment, save, share)
- Bottom navigation

## API Integration

The app communicates with the Next.js backend via REST API:

- **Base URL**: Configured in `.env`
- **Authentication**: JWT token stored in AsyncStorage
- **Auto-retry**: Failed requests retry 2 times
- **Interceptors**: Automatic token injection and error handling

## Development Tips

### Testing on Physical Device

1. Make sure your phone and computer are on the same network
2. Update `EXPO_PUBLIC_API_URL` with your computer's IP:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.1.100:3001/api
   ```
3. Make sure backend is running and accessible

### Debugging

- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) for dev menu
- Use React Native Debugger or Flipper
- Check console logs with `npx react-native log-android` or `npx react-native log-ios`

## Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

## Additional Dependencies

You may need to install additional packages:

```bash
npm install babel-plugin-module-resolver
```

## Troubleshooting

### Metro Bundler Issues

```bash
npx expo start -c
```

### Clear Cache

```bash
npm start -- --reset-cache
```

### Pod Install (iOS)

```bash
cd ios && pod install && cd ..
```
