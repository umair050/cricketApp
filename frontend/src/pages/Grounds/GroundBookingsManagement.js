import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  User,
  ArrowLeft,
} from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import groundsService from "../../services/groundsService";

const GroundBookingsManagement = () => {
  const { groundId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [bookings, setBookings] = useState([]);
  const [ground, setGround] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadData();
  }, [groundId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [groundData, bookingsData] = await Promise.all([
        groundsService.getGroundById(groundId),
        groundsService.getGroundBookings(groundId),
      ]);
      setGround(groundData);
      setBookings(bookingsData);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await groundsService.updateBooking(bookingId, { status: "confirmed" });
      await loadData(); // Reload data
    } catch (err) {
      alert(err.message || "Failed to confirm booking");
    }
  };

  const handleRejectBooking = async (bookingId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      await groundsService.updateBooking(bookingId, {
        status: "rejected",
        cancellationReason: reason,
      });
      await loadData(); // Reload data
    } catch (err) {
      alert(err.message || "Failed to reject booking");
    }
  };

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const totalRevenue = bookings
    .filter((b) => b.isPaid)
    .reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const extractPhone = (notes) => {
    const match = notes?.match(/Contact:\s*([+\d\s-]+)/);
    return match ? match[1].trim() : null;
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div
              className={`animate-spin rounded-full h-16 w-16 border-b-2 ${
                isDarkMode ? "border-white" : "border-gray-900"
              } mx-auto mb-4`}
            ></div>
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              Loading bookings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/grounds/owner/my-grounds")}
            className={`flex items-center gap-2 mb-4 ${
              isDarkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to My Grounds
          </button>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Manage Bookings: {ground?.name}
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            View and manage all booking requests for this ground
          </p>
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
                  Total Bookings
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {bookings.length}
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
                  Pending
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {statusCounts.pending}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
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
                  Confirmed
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
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
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
                  Revenue
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₹{totalRevenue.toFixed(0)}
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
              { value: "rejected", label: "Rejected" },
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
            {error}
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const customerPhone = extractPhone(booking.notes);
              const statusColors = {
                pending:
                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                confirmed:
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                rejected:
                  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                cancelled:
                  "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
                completed:
                  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
              };

              return (
                <div
                  key={booking.id}
                  className={`rounded-lg shadow-md p-6 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          {booking.user?.fullName?.[0] || "U"}
                        </div>
                        <div>
                          <h3
                            className={`text-lg font-bold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {booking.user?.fullName || "Customer"}
                          </h3>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {booking.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[booking.status]
                      }`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Date
                        </div>
                        <div
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatDate(booking.startDatetime)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Time
                        </div>
                        <div
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatTime(booking.startDatetime)} -{" "}
                          {formatTime(booking.endDatetime)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <span className="text-2xl">💰</span>
                      </div>
                      <div>
                        <div
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Amount
                        </div>
                        <div className={`font-semibold text-green-600`}>
                          ₹{booking.totalAmount}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Contact & Purpose */}
                  {(customerPhone || booking.purpose) && (
                    <div
                      className={`p-4 rounded-lg mb-4 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      {customerPhone && (
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <span
                              className={`text-sm font-semibold ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              Customer Phone:
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {customerPhone}
                            </span>
                            <a
                              href={`tel:${customerPhone}`}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              📞 Call
                            </a>
                          </div>
                        </div>
                      )}
                      {booking.purpose && (
                        <div>
                          <span
                            className={`text-xs font-semibold ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Purpose:
                          </span>
                          <span
                            className={`ml-2 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {booking.purpose.charAt(0).toUpperCase() +
                              booking.purpose.slice(1)}
                          </span>
                        </div>
                      )}
                      {booking.notes && (
                        <div className="mt-2">
                          <span
                            className={`text-xs font-semibold ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Notes:
                          </span>
                          <p
                            className={`mt-1 text-sm whitespace-pre-line ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {booking.notes.replace(/Contact:.*\n?/, "")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {booking.cancellationReason && (
                    <div className="p-3 rounded-lg mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                        Reason:
                      </span>
                      <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                        {booking.cancellationReason}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons for Pending Bookings */}
                  {booking.status === "pending" && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleConfirmBooking(booking.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Confirm Booking
                      </button>
                      <button
                        onClick={() => handleRejectBooking(booking.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Booking ID */}
                  <div
                    className={`mt-4 pt-4 border-t ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Booking ID: {booking.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={`text-center py-16 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md`}
          >
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-blue-600 dark:text-blue-300" />
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
                ? "Booking requests will appear here"
                : `No ${filterStatus} bookings for this ground`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroundBookingsManagement;
