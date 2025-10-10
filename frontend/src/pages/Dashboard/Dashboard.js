import React from "react";
import {
  Users,
  Shield,
  Trophy,
  TrendingUp,
  Calendar,
  MapPin,
} from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuthContext();

  const stats = [
    {
      icon: Users,
      label: "Total Players",
      value: "1,234",
      color: "bg-blue-500",
    },
    {
      icon: Shield,
      label: "Active Teams",
      value: "156",
      color: "bg-green-500",
    },
    { icon: Trophy, label: "Tournaments", value: "23", color: "bg-yellow-500" },
    {
      icon: TrendingUp,
      label: "Matches Played",
      value: "89",
      color: "bg-purple-500",
    },
  ];

  const recentActivity = [
    {
      type: "match",
      title: "Mumbai Lions vs Delhi Warriors",
      time: "2 hours ago",
      status: "live",
    },
    {
      type: "tournament",
      title: "Summer Cricket League 2024",
      time: "5 hours ago",
      status: "upcoming",
    },
    {
      type: "team",
      title: "New player joined Chennai Super Kings",
      time: "1 day ago",
      status: "completed",
    },
    {
      type: "match",
      title: "Bangalore Challengers vs Kolkata Knights",
      time: "2 days ago",
      status: "completed",
    },
  ];

  const upcomingEvents = [
    {
      title: "Inter-City Tournament",
      date: "2024-01-15",
      location: "Mumbai",
      teams: 16,
    },
    {
      title: "Local League Finals",
      date: "2024-01-20",
      location: "Delhi",
      teams: 8,
    },
    {
      title: "Youth Cricket Championship",
      date: "2024-01-25",
      location: "Bangalore",
      teams: 12,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.fullName}! 🏏
        </h1>
        <p className="text-green-100">
          Ready to discover cricket talent and connect with players around you?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card-cricket">
            <div className="flex items-center">
              <div className={`${color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary">{label}</p>
                <p className="text-2xl font-bold text-primary">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card-cricket">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    activity.status === "live"
                      ? "bg-red-500"
                      : activity.status === "upcoming"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="font-medium text-primary">{activity.title}</p>
                  <p className="text-sm text-muted">{activity.time}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === "live"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      : activity.status === "upcoming"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
            View All Activity
          </button>
        </div>

        {/* Upcoming Events */}
        <div className="card-cricket">
          <h2 className="text-xl font-bold text-primary mb-4">
            Upcoming Events
          </h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="border-l-4 border-green-500 pl-4 py-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-primary">{event.title}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                    {event.teams} teams
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
            View All Events
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-cricket">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-cricket-outline flex items-center justify-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Find Players</span>
          </button>
          <button className="btn-cricket-outline flex items-center justify-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Create Team</span>
          </button>
          <button className="btn-cricket-outline flex items-center justify-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Join Tournament</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
