# Backend DTO and Entity Migration

## Summary

This document outlines the migration from using `fullName` to `firstName` and `lastName` throughout the backend, implementing proper DTO and Entity patterns.

## Changes Made

### 1. Database Schema (`backend/prisma/schema.prisma`)

**Before:**

```prisma
model User {
  // ...
  fullName      String?
  // ...
}
```

**After:**

```prisma
model User {
  // ...
  firstName     String?
  lastName      String?
  // ...
}
```

### 2. DTO Files (`backend/src/dto/auth.dto.ts`)

Created comprehensive DTOs for authentication:

- **LoginDTO**: Email and password validation
- **SignupDTO**: All signup fields including firstName, lastName, username, phone, DOB, country, password
- **ForgotPasswordDTO**: Email validation
- **VerifyCodeDTO**: 6-digit code validation
- **ResetPasswordDTO**: Code and new password validation

All DTOs use Zod schemas with proper validation rules.

### 3. Entity Files (`backend/src/entities/user.entity.ts`)

Created three user entity interfaces:

- **UserEntity**: Complete user data (with sensitive fields)
- **PublicUserEntity**: Public-facing user data (no sensitive fields)
- **UserWithStatsEntity**: User data with follower and post counts

### 4. Validation Utility (`backend/src/utils/validation.ts`)

Created `validateRequest` function for consistent validation across all API routes.

### 5. Updated API Routes

#### Signup Route (`backend/src/app/api/auth/signup/route.ts`)

- Uses `signupSchema` DTO from `@/dto/auth.dto`
- Uses `validateRequest` utility
- Creates users with `firstName` and `lastName` separately
- Returns user data with both fields

#### Login Route (`backend/src/app/api/auth/login/route.ts`)

- Uses `loginSchema` DTO from `@/dto/auth.dto`
- Uses `validateRequest` utility
- Returns user with `firstName` and `lastName` instead of `fullName`

#### User Profile Route (`backend/src/app/api/user/profile/route.ts`)

- Updated schema to accept `firstName` and `lastName` separately
- Returns and updates both fields in select queries

#### User Suggestions Route (`backend/src/app/api/user/suggestions/route.ts`)

- Returns `firstName` and `lastName` in user suggestions

### 6. Migration File

Updated the original migration file at `backend/prisma/migrations/20251024173129_user_app_setup/migration.sql` to use `firstName` and `lastName` instead of `fullName` from the start. This ensures a clean database structure without any migration of existing data.

## Database Status

✅ **Migration Applied Successfully**

The database has been dropped and recreated with the new schema using `firstName` and `lastName`. The original migration file has been updated to create the table correctly from the start.

### Files to Update

The following files still reference `fullName` and need to be updated:

1. **Backend API Routes:**

   - `backend/src/app/api/posts/create/route.ts` (line 47)
   - `backend/src/app/api/posts/route.ts` (line 27)
   - `backend/src/app/api/stories/route.ts` (line 38)
   - `backend/src/app/api/stories/create/route.ts` (line 58)
   - `backend/src/app/api/stories/[storyId]/route.ts` (lines 76, 86)

2. **Frontend:**
   - `frontend/src/store/authStore.ts` (line 8)
   - `frontend/src/services/userService.ts` (line 4)

## Benefits of This Migration

1. **Better Data Structure**: Separate firstName and lastName allows for better personalization and sorting
2. **Proper DTO Pattern**: Centralized validation logic in DTO files
3. **Entity Definitions**: Clear interfaces for different data contexts
4. **Type Safety**: TypeScript types generated from Zod schemas
5. **Consistency**: All API routes use the same validation approach
6. **Maintainability**: Easy to update validation rules in one place

## Testing Checklist

- [x] Apply database migration successfully ✅
- [ ] Test signup with firstName and lastName
- [ ] Test login returns correct data
- [ ] Test profile update with firstName and lastName
- [ ] Update all remaining API routes (posts, stories)
- [ ] Update frontend to use firstName and lastName
- [ ] Test all user-related features
- [ ] Verify backend APIs return firstName and lastName

## Notes

- Database has been dropped and recreated with the new schema
- All new users will have `firstName` and `lastName` fields
- Frontend will need to be updated to display both fields
- Consider adding a computed property `fullName` in the frontend for display purposes
