import React from "react";
import { User, Edit, Camera, MapPin, Phone, Mail } from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";

const Profile = () => {
  const { user } = useAuthContext();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Profile</h1>
          <p className="text-secondary mt-1">
            Manage your cricket profile and statistics
          </p>
        </div>
        <button className="btn-cricket flex items-center space-x-2">
          <Edit className="w-5 h-5" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card-cricket text-center">
            <div className="relative mb-4">
              <div className="bg-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-primary mb-1">
              {user?.fullName}
            </h2>
            <p className="text-green-600 dark:text-green-400 font-medium mb-2 capitalize">
              {user?.role}
            </p>

            <div className="space-y-2 text-sm text-secondary">
              {user?.email && (
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              )}
              {user?.phone && (
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, Maharashtra</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                ✓ Profile Verified
              </span>
            </div>
          </div>
        </div>

        {/* Details and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Player Statistics */}
          <div className="card-cricket">
            <h3 className="text-lg font-bold text-primary mb-4">
              Cricket Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  23
                </p>
                <p className="text-sm text-secondary">Matches Played</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  45.2
                </p>
                <p className="text-sm text-secondary">Batting Average</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  125.5
                </p>
                <p className="text-sm text-secondary">Strike Rate</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  12
                </p>
                <p className="text-sm text-secondary">Wickets Taken</p>
              </div>
            </div>
          </div>

          {/* Player Details */}
          <div className="card-cricket">
            <h3 className="text-lg font-bold text-primary mb-4">
              Player Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Playing Role
                </label>
                <p className="text-primary">All-rounder</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Batting Style
                </label>
                <p className="text-primary">Right-handed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Bowling Style
                </label>
                <p className="text-primary">Right-arm Medium</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Preferred Format
                </label>
                <p className="text-primary">T20, ODI</p>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="card-cricket">
            <h3 className="text-lg font-bold text-primary mb-4">About Me</h3>
            <p className="text-secondary leading-relaxed">
              Passionate cricket player with 5+ years of experience in local
              tournaments. Love playing as an all-rounder and always ready to
              contribute to the team's success. Looking forward to connecting
              with fellow cricketers and participating in more competitive
              matches.
            </p>
          </div>

          {/* Recent Activity */}
          <div className="card-cricket">
            <h3 className="text-lg font-bold text-primary mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-light-gray rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">
                    Joined Mumbai Warriors team
                  </p>
                  <p className="text-xs text-muted">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-light-gray rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">
                    Scored 89* in Local Championship
                  </p>
                  <p className="text-xs text-muted">1 week ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-light-gray rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">
                    Registered for Summer League 2024
                  </p>
                  <p className="text-xs text-muted">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
