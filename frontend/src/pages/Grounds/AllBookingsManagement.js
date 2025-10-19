import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  DollarSign,
} from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import groundsService from "../../services/groundsService";

const AllBookingsManagement = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [allBookings, setAllBookings] = useState([]);
  const [myGrounds, setMyGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGround, setFilterGround] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get all owner's grounds
      const groundsData = await groundsService.getMyGrounds();
      setMyGrounds(groundsData);

      // Get bookings for each ground
      const bookingsPromises = groundsData.map((ground) =>
        groundsService.getGroundBookings(ground.id).catch(() => [])
      );
      const bookingsArrays = await Promise.all(bookingsPromises);

      // Flatten and combine all bookings
      const combined = bookingsArrays.flat();
      setAllBookings(combined);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await groundsService.updateBooking(bookingId, { status: "confirmed" });
      await loadData(); // Reload all data
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
      await loadData(); // Reload all data
    } catch (err) {
      alert(err.message || "Failed to reject booking");
    }
  };

  // Apply filters
  let filteredBookings = allBookings;

  if (filterStatus !== "all") {
    filteredBookings = filteredBookings.filter(
      (b) => b.status === filterStatus
    );
  }

  if (filterGround !== "all") {
    filteredBookings = filteredBookings.filter(
      (b) => b.ground?.id === filterGround
    );
  }

  const statusCounts = {
    all: allBookings.length,
    pending: allBookings.filter((b) => b.status === "pending").length,
    confirmed: allBookings.filter((b) => b.status === "confirmed").length,
    completed: allBookings.filter((b) => b.status === "completed").length,
    rejected: allBookings.filter((b) => b.status === "rejected").length,
    cancelled: allBookings.filter((b) => b.status === "cancelled").length,
  };

  const totalRevenue = allBookings
    .filter((b) => b.isPaid)
    .reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0);

  const pendingRevenue = allBookings
    .filter((b) => b.status === "pending" || b.status === "confirmed")
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
              Loading all bookings...
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
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            All Booking Requests
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Manage bookings across all your grounds in one place
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
                  {allBookings.length}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Across {myGrounds.length} grounds
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
                <p className={`text-3xl font-bold text-yellow-600`}>
                  {statusCounts.pending}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Needs action
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
                <p className={`text-3xl font-bold text-green-600`}>
                  {statusCounts.confirmed}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Active bookings
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
                  Total Revenue
                </p>
                <p className={`text-2xl font-bold text-green-600`}>
                  ₹{totalRevenue.toFixed(0)}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Pending: ₹{pendingRevenue.toFixed(0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`rounded-lg shadow-md p-6 mb-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Status Filter */}
          <div className="mb-4">
            <label
              className={`block mb-3 font-semibold ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Filter by Status:
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { value: "all", label: "All" },
                { value: "pending", label: "Pending", highlight: true },
                { value: "confirmed", label: "Confirmed" },
                { value: "completed", label: "Completed" },
                { value: "rejected", label: "Rejected" },
                { value: "cancelled", label: "Cancelled" },
              ].map(({ value, label, highlight }) => (
                <button
                  key={value}
                  onClick={() => setFilterStatus(value)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterStatus === value
                      ? "bg-green-600 text-white"
                      : highlight && statusCounts[value] > 0
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                  {statusCounts[value] > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-opacity-30 bg-white rounded-full text-xs font-bold">
                      {statusCounts[value]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ground Filter */}
          {myGrounds.length > 1 && (
            <div>
              <label
                className={`block mb-3 font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Filter by Ground:
              </label>
              <select
                value={filterGround}
                onChange={(e) => setFilterGround(e.target.value)}
                className={`w-full md:w-auto px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Grounds ({myGrounds.length})</option>
                {myGrounds.map((ground) => (
                  <option key={ground.id} value={ground.id}>
                    {ground.name}
                  </option>
                ))}
              </select>
            </div>
          )}
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
                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
                confirmed:
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700",
                rejected:
                  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700",
                cancelled:
                  "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600",
                completed:
                  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700",
              };

              return (
                <div
                  key={booking.id}
                  className={`rounded-lg shadow-md p-6 border-l-4 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } ${statusColors[booking.status]}`}
                >
                  {/* Ground Name Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span
                        className={`font-bold text-sm ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        {booking.ground?.name}
                      </span>
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        • {booking.ground?.city}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        statusColors[booking.status]
                      }`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {booking.user?.fullName?.[0] || "U"}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-bold ${
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

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div
                      className={`p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Date
                        </span>
                      </div>
                      <div
                        className={`font-semibold text-sm ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatDate(booking.startDatetime)}
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Time
                        </span>
                      </div>
                      <div
                        className={`font-semibold text-sm ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatTime(booking.startDatetime)}
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Amount
                        </span>
                      </div>
                      <div className="font-semibold text-sm text-green-600">
                        ₹{booking.totalAmount}
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">💳</span>
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Payment
                        </span>
                      </div>
                      <div
                        className={`font-semibold text-sm ${
                          booking.isPaid ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {booking.isPaid ? "Paid" : "Pending"}
                      </div>
                    </div>
                  </div>

                  {/* Customer Contact */}
                  {customerPhone && (
                    <div
                      className={`p-4 rounded-lg mb-4 ${
                        isDarkMode
                          ? "bg-blue-900/20 border border-blue-800"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <span
                            className={`font-semibold ${
                              isDarkMode ? "text-blue-300" : "text-blue-800"
                            }`}
                          >
                            Customer Contact:
                          </span>
                          <span
                            className={`font-mono font-bold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {customerPhone}
                          </span>
                        </div>
                        <a
                          href={`tel:${customerPhone}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                        >
                          <span>📞</span>
                          <span>Call Now</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Purpose & Notes */}
                  {(booking.purpose || booking.notes) && (
                    <div
                      className={`p-3 rounded-lg mb-4 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      {booking.purpose && (
                        <div className="mb-2">
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
                        <div>
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
                            {booking.notes.replace(/Contact:.*\n?/g, "").trim()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rejection/Cancellation Reason */}
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
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleConfirmBooking(booking.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Confirm Booking
                      </button>
                      <button
                        onClick={() => handleRejectBooking(booking.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Booking ID Footer */}
                  <div
                    className={`mt-4 pt-4 border-t ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }
                      >
                        Booking ID: {booking.id.substring(0, 8)}...
                      </span>
                      <span
                        className={
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }
                      >
                        Created: {formatDate(booking.createdAt)}
                      </span>
                    </div>
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
                ? "Booking requests will appear here when customers book your grounds"
                : `No ${filterStatus} bookings at the moment`}
            </p>
            <button
              onClick={() => navigate("/grounds/owner/my-grounds")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Back to My Grounds
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBookingsManagement;
