import React, { useEffect, useState } from "react";
import { Calendar, Filter } from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings } from "../../store/slices/groundSlice";
import BookingCard from "../../components/Grounds/BookingCard";

const MyBookings = () => {
  const { isDarkMode } = useDarkMode();
  const dispatch = useDispatch();
  const { myBookings, loading, error } = useSelector((state) => state.grounds);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  // Debug: Log bookings data
  useEffect(() => {
    console.log("My Bookings Data:", { myBookings, loading, error });
  }, [myBookings, loading, error]);

  const filteredBookings =
    filterStatus === "all"
      ? myBookings
      : myBookings.filter((booking) => booking.status === filterStatus);

  const statusCounts = {
    all: myBookings.length,
    pending: myBookings.filter((b) => b.status === "pending").length,
    confirmed: myBookings.filter((b) => b.status === "confirmed").length,
    completed: myBookings.filter((b) => b.status === "completed").length,
    cancelled: myBookings.filter((b) => b.status === "cancelled").length,
  };

  const totalSpent = myBookings
    .filter((b) => b.isPaid)
    .reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0);

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="container mx-auto px-4 py-6">
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            My Bookings
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Manage your ground bookings
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  {myBookings.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-300" />
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
                  Active Bookings
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {statusCounts.confirmed}
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
                  Total Spent
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₹{totalSpent.toFixed(0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className={`font-semibold ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Filter by status:
            </span>
            {[
              { value: "all", label: "All" },
              { value: "pending", label: "Pending" },
              { value: "confirmed", label: "Confirmed" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilterStatus(value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === value
                    ? "bg-green-600 text-white"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                {label}
                {statusCounts[value] > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-opacity-30 bg-white rounded-full text-xs">
                    {statusCounts[value]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error.message || "Failed to load bookings"}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-64 rounded-lg animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bookings Grid */}
        {!loading && filteredBookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onUpdate={() => dispatch(fetchMyBookings())}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && (
          <div
            className={`text-center py-16 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md`}
          >
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-green-600 dark:text-green-300" />
            </div>
            <h3
              className={`text-2xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {filterStatus === "all"
                ? "No bookings yet"
                : `No ${filterStatus} bookings`}
            </h3>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {filterStatus === "all"
                ? "Browse grounds and make your first booking"
                : `You don't have any ${filterStatus} bookings at the moment`}
            </p>
            {filterStatus === "all" && (
              <a
                href="/grounds"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center gap-2"
              >
                Browse Grounds
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
