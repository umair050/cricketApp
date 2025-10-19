import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useDispatch } from "react-redux";
import { cancelBooking } from "../../store/slices/groundSlice";

const BookingCard = ({ booking, onUpdate }) => {
  const { isDarkMode } = useDarkMode();
  const dispatch = useDispatch();
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    confirmed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    rejected: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };

  const statusIcons = {
    pending: AlertCircle,
    confirmed: CheckCircle,
    cancelled: XCircle,
    completed: CheckCircle,
    rejected: XCircle,
  };

  const StatusIcon = statusIcons[booking.status] || AlertCircle;

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

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a cancellation reason");
      return;
    }

    setCancelling(true);
    try {
      await dispatch(
        cancelBooking({ id: booking.id, reason: cancelReason })
      ).unwrap();
      setShowCancelConfirm(false);
      setCancelReason("");
      if (onUpdate) onUpdate();
    } catch (error) {
      alert(error.message || "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";

  return (
    <div
      className={`rounded-lg shadow-md p-6 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            className={`text-xl font-bold mb-1 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {booking.ground?.name || "Ground"}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>
              {booking.ground?.city}, {booking.ground?.state}
            </span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
            statusColors[booking.status]
          }`}
        >
          <StatusIcon className="w-4 h-4" />
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Amount
            </div>
            <div
              className={`font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              ₹{booking.totalAmount}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <AlertCircle
              className={`w-5 h-5 ${
                booking.isPaid ? "text-green-600" : "text-orange-600"
              }`}
            />
          </div>
          <div>
            <div
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Payment
            </div>
            <div
              className={`font-semibold ${
                booking.isPaid ? "text-green-600" : "text-orange-600"
              }`}
            >
              {booking.isPaid ? "Paid" : "Pending"}
            </div>
          </div>
        </div>
      </div>

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
                {booking.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Owner Contact - Call to Confirm */}
      {booking.ground?.owner?.phone && booking.status === "pending" && (
        <div
          className={`p-4 rounded-lg mb-4 border ${
            isDarkMode
              ? "bg-blue-900/20 border-blue-800"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📞</span>
            <span
              className={`font-semibold ${
                isDarkMode ? "text-blue-300" : "text-blue-800"
              }`}
            >
              Waiting for Owner Confirmation
            </span>
          </div>
          <a
            href={`tel:${booking.ground.owner.phone}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>📞</span>
            <span>Call Owner: {booking.ground.owner.phone}</span>
          </a>
        </div>
      )}

      {/* Cancellation Reason */}
      {booking.cancellationReason && (
        <div className="p-3 rounded-lg mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <span className="text-xs font-semibold text-red-700 dark:text-red-400">
            Cancellation Reason:
          </span>
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">
            {booking.cancellationReason}
          </p>
        </div>
      )}

      {/* Cancel Booking */}
      {canCancel && !showCancelConfirm && (
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Cancel Booking
        </button>
      )}

      {/* Cancel Confirmation */}
      {showCancelConfirm && (
        <div
          className={`p-4 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <p
            className={`text-sm mb-3 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Please provide a reason for cancellation:
          </p>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows="2"
            className={`w-full px-3 py-2 rounded-lg border mb-3 ${
              isDarkMode
                ? "bg-gray-600 border-gray-500 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="Reason for cancellation..."
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowCancelConfirm(false);
                setCancelReason("");
              }}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancelBooking}
              disabled={cancelling}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? "Cancelling..." : "Confirm Cancel"}
            </button>
          </div>
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
};

export default BookingCard;
