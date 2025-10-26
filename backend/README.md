# CrikApp Backend

Backend API for CrikApp social media platform built with Next.js, Prisma, and PostgreSQL.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database and update the `.env` file with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` and update `DATABASE_URL`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/crikapp?schema=public"
```

### 3. Run Migrations

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/forgot-password` - Request password reset code
- `POST /api/auth/verify-reset-code` - Verify reset code
- `POST /api/auth/reset-password` - Reset password with code

### User

- `GET /api/user/profile` - Get current user profile (requires auth)
- `PUT /api/user/profile` - Update user profile (requires auth)
- `GET /api/user/suggestions` - Get suggested users to follow (requires auth)
- `POST /api/user/follow` - Follow a user (requires auth)
- `DELETE /api/user/follow` - Unfollow a user (requires auth)

### Countries

- `GET /api/countries` - Get list of countries

## Database Schema

The database includes the following models:

- **User** - User accounts with profile information
- **PasswordReset** - Password reset codes
- **Post** - User posts/videos
- **Like** - Post likes
- **Comment** - Post comments
- **Follow** - User follow relationships

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   └── api/               # API routes
│   │       ├── auth/          # Authentication endpoints
│   │       ├── user/          # User endpoints
│   │       └── countries/     # Countries endpoint
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # Authentication utilities
│   │   └── email.ts           # Email utilities
│   └── middleware/
│       └── auth.ts            # Authentication middleware
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time
- `EMAIL_HOST` - SMTP host for sending emails
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASSWORD` - SMTP password
- `EMAIL_FROM` - From email address
- `FRONTEND_URL` - Frontend app URL
- `BACKEND_URL` - Backend API URL

## Prisma Commands

- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
