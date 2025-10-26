# Reusable Components Documentation

## Overview

This document describes the reusable components created for the CrikApp project, including TopBar and BottomNavigation components.

## Components Created

### 1. TopBar Component

**Location:** `frontend/src/components/common/TopBar.tsx`

A reusable header component for consistent navigation across screens.

#### Features:

- Customizable title
- Search and notification icons
- Consistent styling across the app
- Uses Ionicons for modern iconography

#### Props:

```typescript
interface TopBarProps {
  title?: string; // Default: "CrikApp"
  showSearch?: boolean; // Default: true
  showNotifications?: boolean; // Default: true
  onSearchPress?: () => void; // Custom search handler
  onNotificationPress?: () => void; // Custom notification handler
}
```

#### Usage:

```tsx
import { TopBar } from "@/components/common/TopBar";

// Basic usage
<TopBar />

// Custom title
<TopBar title="Discover People" />

// Hide specific icons
<TopBar showNotifications={false} />

// Custom handlers
<TopBar onSearchPress={() => router.push('/search')} />
```

#### Implementation:

- Used in: `HomeScreen`, `DiscoverUsersScreen`
- Styled with theme colors and spacing
- Responsive to screen sizes

---

### 2. BottomNavigation Component

**Location:** `frontend/src/components/navigation/BottomNavigation.tsx`

A reusable bottom navigation bar for consistent app navigation.

#### Features:

- Active route highlighting
- Central create button
- Ionicon icons for all navigation items
- Safe area handling for iOS/Android
- Smooth transitions between screens

#### Navigation Items:

1. **Home** - Main feed
2. **Discover** - User search/discovery
3. **Create** (Center button) - Create post
4. **Messages** - Chat/messaging
5. **Profile** - User profile

#### Usage:

```tsx
import { BottomNavigation } from "@/components/navigation/BottomNavigation";

// Add to any screen in the app route
export default function MyScreen() {
  return (
    <>
      <MyScreenComponent />
      <BottomNavigation />
    </>
  );
}
```

#### Implementation:

- Used in: `home.tsx`, `discover-users.tsx`, `profile.tsx`
- Active state detection via `usePathname()`
- Auto-highlights current route
- Properly handles Android back button conflicts

---

## Updated Screens

### HomeScreen

- Replaced custom header with `<TopBar />`
- Removed duplicate navigation code
- Cleaner, more maintainable code

### DiscoverUsersScreen

- Added `<TopBar title="Discover People" />`
- Replaced emoji icons with Ionicons
- Updated search bar styling to match HomeScreen theme
- Consistent UI/UX across the app

---

## Benefits of Reusable Components

1. **Consistency**: Uniform design across all screens
2. **Maintainability**: Update once, reflects everywhere
3. **DRY Principle**: Don't repeat yourself
4. **Type Safety**: TypeScript interfaces for props
5. **Testability**: Easier to test isolated components
6. **Developer Experience**: Faster development with pre-built components

---

## Future Enhancements

- [ ] Add badge notifications to icons
- [ ] Custom animation transitions
- [ ] Accessibility improvements
- [ ] Dark mode support
- [ ] Customizable color schemes
- [ ] RTL (Right-to-Left) support

---

## Files Modified/Created

### Created:

- `frontend/src/components/common/TopBar.tsx`
- `frontend/src/components/common/index.ts`
- `frontend/src/components/navigation/BottomNavigation.tsx`
- `frontend/src/components/navigation/index.ts`

### Modified:

- `frontend/src/screens/app/HomeScreen.tsx`
- `frontend/src/screens/app/DiscoverUsersScreen.tsx`
- `frontend/app/(app)/home.tsx`
- `frontend/app/(app)/discover-users.tsx`
- `frontend/app/(app)/profile.tsx`

---

## Testing Checklist

- [x] TopBar renders correctly on all screens
- [x] BottomNavigation highlights active route
- [x] Search icon navigates to discover page
- [x] Create button opens post creation
- [x] Profile button navigates to profile
- [x] Ionicons display correctly
- [x] No Android back button conflicts
- [x] Safe area handling on iOS
- [x] Consistent styling across screens

---

## Notes

- All components use the theme system for consistent styling
- Components are designed to be flexible and configurable
- Ionicons are used for modern, consistent iconography
- All navigation uses Expo Router for type-safe routing
