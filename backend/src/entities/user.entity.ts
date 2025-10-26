/**
 * User Entity
 * Represents the structure of user data returned from the API
 */

export interface UserEntity {
  id: string;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  dateOfBirth: Date | null;
  country: string | null;
  profileImage: string | null;
  occupation: string | null;
  bio: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

/**
 * Public User Entity
 * User data safe to return in public endpoints (without sensitive data)
 */
export interface PublicUserEntity {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  occupation: string | null;
  bio: string | null;
  isVerified: boolean;
  createdAt: Date;
}

/**
 * User with Stats Entity
 * User data with follower and post counts
 */
export interface UserWithStatsEntity {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  isVerified: boolean;
  _count: {
    followers: number;
    posts: number;
  };
} 