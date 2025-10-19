import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyGrounds } from "../../store/slices/groundSlice";
import GroundCard from "../../components/Grounds/GroundCard";

const MyGrounds = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myGrounds, loading, error } = useSelector((state) => state.grounds);

  useEffect(() => {
    dispatch(fetchMyGrounds());
  }, [dispatch]);

  const totalBookings = myGrounds.reduce(
    (sum, ground) => sum + (ground.totalBookings || 0),
    0
  );
  const avgRating =
    myGrounds.length > 0
      ? (
          myGrounds.reduce((sum, ground) => sum + (ground.rating || 0), 0) /
          myGrounds.length
        ).toFixed(1)
      : "0.0";

  const approvedGrounds = myGrounds.filter(
    (g) => g.status === "approved"
  ).length;
  const pendingGrounds = myGrounds.filter((g) => g.status === "pending").length;

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                My Grounds
              </h1>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Manage your cricket ground listings
              </p>
            </div>
            <button
              onClick={() => navigate("/grounds/register")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              List New Ground
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className={`rounded-lg shadow-md p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm mb-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Grounds
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {myGrounds.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg shadow-md p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm mb-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Bookings
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {totalBookings}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg shadow-md p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm mb-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Average Rating
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {avgRating}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg shadow-md p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm mb-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Status
                </p>
                <p
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {approvedGrounds} Active
                </p>
                {pendingGrounds > 0 && (
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-yellow-400" : "text-yellow-600"
                    }`}
                  >
                    {pendingGrounds} Pending
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error.message || "Failed to load grounds"}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-96 rounded-lg animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        {/* Grounds Grid */}
        {!loading && myGrounds.length > 0 && (
          <div>
            <h2
              className={`text-xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Your Grounds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGrounds.map((ground) => (
                <div key={ground.id} className="relative">
                  <GroundCard ground={ground} />
                  {ground.status === "pending" && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                      Pending Approval
                    </div>
                  )}
                  {ground.status === "rejected" && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                      Rejected
                    </div>
                  )}
                  {ground.status === "approved" && (
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/grounds/${ground.id}/manage-bookings`);
                        }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Manage Bookings
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && myGrounds.length === 0 && (
          <div
            className={`text-center py-16 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md`}
          >
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-green-600 dark:text-green-300" />
            </div>
            <h3
              className={`text-2xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No grounds listed yet
            </h3>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Start earning by listing your cricket ground
            </p>
            <button
              onClick={() => navigate("/grounds/register")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              List Your First Ground
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGrounds;
