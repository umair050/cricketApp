# 📁 CrikApp - Complete Project Structure

## Overview

This document provides a detailed breakdown of the entire project structure, explaining the purpose of each directory and file.

## Root Structure

```
CrikApp/
├── backend/                    # Next.js API Backend
├── frontend/                   # React Native Mobile App
├── README.md                   # Main project documentation
└── PROJECT_STRUCTURE.md        # This file
```

## Backend Structure (`/backend`)

```
backend/
├── prisma/
│   └── schema.prisma           # Database schema definition
│
├── src/
│   ├── app/
│   │   └── api/                # Next.js API routes
│   │       ├── auth/           # Authentication endpoints
│   │       │   ├── signup/route.ts          # User registration
│   │       │   ├── login/route.ts           # User login
│   │       │   ├── forgot-password/route.ts # Request reset code
│   │       │   ├── verify-reset-code/route.ts # Verify code
│   │       │   └── reset-password/route.ts  # Reset password
│   │       │
│   │       ├── user/           # User-related endpoints
│   │       │   ├── profile/route.ts         # Get/update profile
│   │       │   ├── suggestions/route.ts     # Get suggested users
│   │       │   └── follow/route.ts          # Follow/unfollow
│   │       │
│   │       └── countries/route.ts # Get countries list
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── prisma.ts           # Prisma client instance
│   │   ├── auth.ts             # Authentication utilities (JWT, bcrypt)
│   │   └── email.ts            # Email sending utilities
│   │
│   └── middleware/
│       └── auth.ts             # Authentication middleware
│
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Backend documentation
```

### Backend Key Files Explained

#### API Routes (`src/app/api/`)

Next.js 14 uses the App Router with route handlers:

- Each folder represents a route segment
- `route.ts` files handle HTTP methods (GET, POST, PUT, DELETE)
- Automatic API endpoint generation

#### Prisma (`prisma/schema.prisma`)

Defines the database schema:

- Models (User, Post, Like, Comment, Follow, PasswordReset)
- Relationships between models
- Indexes for performance
- Database migrations source

#### Libraries (`src/lib/`)

Reusable utility functions:

- **prisma.ts**: Singleton Prisma client with connection pooling
- **auth.ts**: JWT generation/verification, password hashing
- **email.ts**: Email sending for password resets

#### Middleware (`src/middleware/`)

Request/response interceptors:

- **auth.ts**: Validates JWT tokens, attaches user to request

## Frontend Structure (`/frontend`)

```
frontend/
├── app/                        # Expo Router (file-based routing)
│   ├── (auth)/                 # Authentication screens group
│   │   ├── _layout.tsx         # Auth layout wrapper
│   │   ├── login.tsx           # Login screen
│   │   ├── signup.tsx          # Signup screen
│   │   ├── forgot-password.tsx # Forgot password screen
│   │   └── reset-password.tsx  # Reset password screen
│   │
│   ├── (onboarding)/           # Onboarding screens group
│   │   ├── _layout.tsx         # Onboarding layout wrapper
│   │   ├── select-country.tsx  # Country selection
│   │   ├── fill-profile.tsx    # Profile setup
│   │   └── follow-users.tsx    # Follow suggestions
│   │
│   ├── (app)/                  # Main app screens group
│   │   ├── _layout.tsx         # App layout wrapper
│   │   └── home.tsx            # Home feed screen
│   │
│   ├── _layout.tsx             # Root layout (providers)
│   └── index.tsx               # Entry point (routing logic)
│
├── src/
│   ├── components/             # Reusable UI components
│   │   └── common/
│   │       ├── Button.tsx      # Custom button component
│   │       ├── Input.tsx       # Custom input component
│   │       └── SocialButton.tsx # Social auth button
│   │
│   ├── screens/                # Screen components
│   │   ├── auth/               # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   └── ResetPasswordScreen.tsx
│   │   │
│   │   ├── onboarding/         # Onboarding screens
│   │   │   ├── SelectCountryScreen.tsx
│   │   │   ├── FillProfileScreen.tsx
│   │   │   └── FollowUsersScreen.tsx
│   │   │
│   │   └── app/                # Main app screens
│   │       └── HomeScreen.tsx
│   │
│   ├── services/               # API service layer
│   │   ├── authService.ts      # Authentication API calls
│   │   └── userService.ts      # User API calls
│   │
│   ├── store/                  # Zustand state stores
│   │   ├── authStore.ts        # Authentication state
│   │   └── appStore.ts         # Application state
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hooks
│   │   └── useUser.ts          # User data hooks
│   │
│   ├── config/                 # Configuration files
│   │   └── api.ts              # Axios instance and interceptors
│   │
│   └── constants/              # Constants and theme
│       └── theme.ts            # App theme (colors, spacing, etc.)
│
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── app.json                    # Expo configuration
├── babel.config.js             # Babel configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Frontend documentation
```

### Frontend Key Concepts

#### Expo Router (`app/`)

File-based routing system:

- Folders in parentheses `(name)` create route groups without path segments
- `_layout.tsx` files wrap child routes with common layouts
- Navigation is automatic based on file structure

#### Screens vs App Routes

- **`app/`**: Route definitions (thin wrappers)
- **`src/screens/`**: Actual screen implementations (logic and UI)
- Separation allows better organization and reusability

#### State Management Architecture

**Zustand (Client State)**

- `authStore.ts`: User authentication state, token, login/logout
- `appStore.ts`: Onboarding state, UI preferences
- Simple, lightweight, no boilerplate

**React Query (Server State)**

- Handles all API data fetching
- Automatic caching, refetching, background updates
- Used via custom hooks (`useAuth`, `useUser`)

#### Service Layer (`src/services/`)

Abstraction over API calls:

- Clean separation between UI and API logic
- Easy to mock for testing
- Single source of truth for endpoints

#### Custom Hooks (`src/hooks/`)

Business logic layer:

- Combines services with React Query
- Integrates with Zustand stores
- Provides clean interface to components

## Data Flow

### Authentication Flow

```
LoginScreen
  → useAuth hook
    → authService (API call)
      → Backend /api/auth/login
        → Prisma database query
      ← JWT token + user data
    ← Update authStore (Zustand)
  ← Navigate to home
```

### Data Fetching Flow

```
Component
  → useUser hook
    → React Query
      → userService (API call)
        → Backend /api/user/*
          → Prisma database query
        ← Data
      ← Cache data
    ← Return data + loading state
  ← Render UI
```

## Key Design Decisions

### 1. Database-First Approach

- Prisma schema as single source of truth
- Migrations track schema changes
- Type-safe database queries

### 2. API Route Structure

- RESTful endpoint design
- Consistent response format
- Centralized error handling

### 3. State Management Split

- **Zustand**: Authentication, UI state (persisted)
- **React Query**: API data (cached, auto-refetched)
- Clear separation of concerns

### 4. Component Organization

- **Common components**: Reusable across app
- **Screen components**: Feature-specific UI
- **Separation of routing and screens**

### 5. Type Safety

- TypeScript throughout
- Prisma generates types from schema
- API types shared via interfaces

## File Naming Conventions

- **PascalCase**: Components, screens (`LoginScreen.tsx`)
- **camelCase**: Utilities, services (`authService.ts`)
- **kebab-case**: Routes in URL (`forgot-password`)
- **lowercase**: Config files (`tsconfig.json`)

## Environment Management

### Backend

- `.env`: Local development (not committed)
- `.env.example`: Template for required variables
- Loaded by Next.js automatically

### Frontend

- `.env`: Local development (not committed)
- `.env.example`: Template for required variables
- `EXPO_PUBLIC_*` prefix for client-side variables

## Build Output (Not in Git)

### Backend

- `node_modules/`: Dependencies
- `.next/`: Next.js build output
- `prisma/migrations/`: Database migrations

### Frontend

- `node_modules/`: Dependencies
- `.expo/`: Expo cache
- `dist/`: Build output

## Future Structure Extensions

### Planned Additions

```
backend/src/
├── app/api/
│   ├── posts/              # Video posts endpoints
│   ├── comments/           # Comments endpoints
│   ├── messages/           # Direct messaging
│   └── notifications/      # Push notifications
│
└── lib/
    ├── storage.ts          # File upload handling
    ├── video.ts            # Video processing
    └── push.ts             # Push notification service

frontend/src/
├── screens/
│   ├── app/
│   │   ├── ProfileScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── MessagesScreen.tsx
│   │   └── NotificationsScreen.tsx
│   │
│   └── video/
│       ├── RecordScreen.tsx
│       └── EditScreen.tsx
│
└── components/
    ├── video/
    │   ├── VideoPlayer.tsx
    │   └── VideoControls.tsx
    │
    └── feed/
        └── VideoCard.tsx
```

## Notes

- All TypeScript files use strict mode
- ESLint and Prettier configs will be added
- Tests will be organized parallel to source files
- Documentation is maintained alongside code

---

This structure follows industry best practices for scalable, maintainable applications.
