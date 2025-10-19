import React, { useState, useEffect, useCallback } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useDispatch } from "react-redux";
import { createBooking } from "../../store/slices/groundSlice";
import groundsService from "../../services/groundsService";

const BookingModal = ({
  isOpen,
  onClose,
  ground,
  onSuccess,
  prefilledDate,
  prefilledSlot,
}) => {
  const { isDarkMode } = useDarkMode();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState(null);

  const [formData, setFormData] = useState({
    slotType: "hourly",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    notes: "",
    contactPhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setAvailability(null);
  };

  const checkAvailabilityWithData = useCallback(
    async (date, startTime, endTime) => {
      if (!date || !startTime || !endTime) {
        setError("Please select date and time");
        return;
      }

      setChecking(true);
      setError("");

      try {
        // Send times as-is (treated as local time by backend)
        const result = await groundsService.checkAvailability({
          groundId: ground.id,
          date: date,
          startTime: startTime + ":00",
          endTime: endTime + ":00",
        });

        setAvailability(result);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to check availability");
      } finally {
        setChecking(false);
      }
    },
    [ground.id]
  );

  useEffect(() => {
    if (isOpen) {
      if (prefilledDate && prefilledSlot) {
        // Use prefilled data from slot click
        setFormData((prev) => ({
          ...prev,
          date: prefilledDate,
          startTime: prefilledSlot.startTime,
          endTime: prefilledSlot.endTime,
        }));
        // Auto-check availability for prefilled slots
        setTimeout(() => {
          checkAvailabilityWithData(
            prefilledDate,
            prefilledSlot.startTime,
            prefilledSlot.endTime
          );
        }, 100);
      } else {
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData((prev) => ({
          ...prev,
          date: tomorrow.toISOString().split("T")[0],
        }));
      }
    }
  }, [isOpen, prefilledDate, prefilledSlot, checkAvailabilityWithData]);

  const checkAvailability = async () => {
    await checkAvailabilityWithData(
      formData.date,
      formData.startTime,
      formData.endTime
    );
  };

  const calculateAmount = () => {
    if (!formData.startTime || !formData.endTime) return 0;

    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);

    if (formData.slotType === "daily") {
      return ground.dailyRate;
    }

    return hours * ground.hourlyRate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!availability || !availability.available) {
      setError("Please check availability first");
      return;
    }

    setLoading(true);

    try {
      // Construct datetime (treated as local time, stored as UTC by backend)
      const startDatetime = new Date(
        `${formData.date}T${formData.startTime}:00`
      );
      const endDatetime = new Date(`${formData.date}T${formData.endTime}:00`);

      const bookingData = {
        groundId: ground.id,
        slotType: formData.slotType,
        startDatetime: startDatetime.toISOString(),
        endDatetime: endDatetime.toISOString(),
        totalAmount: calculateAmount(),
        purpose: formData.purpose || undefined,
        notes: formData.notes
          ? `${formData.notes}\n\nContact: ${formData.contactPhone}`
          : `Contact: ${formData.contactPhone}`,
      };

      await dispatch(createBooking(bookingData)).unwrap();

      // Reset form
      setFormData({
        slotType: "hourly",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
        notes: "",
        contactPhone: "",
      });
      setAvailability(null);

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalAmount = calculateAmount();
  const platformFee = totalAmount * 0.1;
  const finalAmount = totalAmount + platformFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Book Ground
            </h2>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {ground.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {availability && (
            <div
              className={`px-4 py-3 rounded flex items-center gap-2 ${
                availability.available
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}
            >
              {availability.available ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Slot is available! You can proceed with booking.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <span>
                    Slot is not available. Please choose different time.
                  </span>
                </>
              )}
            </div>
          )}

          {/* Booking Type */}
          <div>
            <label
              className={`block mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Booking Type
            </label>
            <select
              name="slotType"
              value={formData.slotType}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Full Day</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>
            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                min={ground.openTime?.substring(0, 5)}
                max={ground.closeTime?.substring(0, 5)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>
            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                min={formData.startTime}
                max={ground.closeTime?.substring(0, 5)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>
          </div>

          {/* Check Availability Button */}
          <button
            type="button"
            onClick={checkAvailability}
            disabled={checking}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {checking ? "Checking..." : "Check Availability"}
          </button>

          {/* Contact Phone for Confirmation */}
          <div
            className={`p-4 rounded-lg border ${
              isDarkMode
                ? "bg-blue-900/20 border-blue-800"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start gap-2 mb-3">
              <span className="text-2xl">📞</span>
              <div>
                <h4
                  className={`font-semibold ${
                    isDarkMode ? "text-blue-300" : "text-blue-800"
                  }`}
                >
                  Owner will call to confirm
                </h4>
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-blue-400" : "text-blue-700"
                  }`}
                >
                  Ground owner will contact you to confirm the booking details
                </p>
              </div>
            </div>
            <label
              className={`block mb-2 text-sm font-medium ${
                isDarkMode ? "text-blue-300" : "text-blue-800"
              }`}
            >
              Your Contact Number *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="+91 98765 43210"
              required
            />
          </div>

          {/* Purpose & Notes */}
          <div>
            <label
              className={`block mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Purpose (Optional)
            </label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="">Select purpose</option>
              <option value="practice">Practice</option>
              <option value="match">Match</option>
              <option value="tournament">Tournament</option>
              <option value="coaching">Coaching</option>
            </select>
          </div>

          <div>
            <label
              className={`block mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Any special requirements..."
            />
          </div>

          {/* Price Summary */}
          {totalAmount > 0 && (
            <div
              className={`p-4 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <h3
                className={`font-semibold mb-3 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Price Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    {formData.slotType === "daily"
                      ? "Daily Rate"
                      : "Hourly Rate"}
                  </span>
                  <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    Platform Fee (10%)
                  </span>
                  <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                    ₹{platformFee.toFixed(2)}
                  </span>
                </div>
                <div
                  className={`flex justify-between pt-2 border-t ${
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  }`}
                >
                  <span
                    className={`font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Total Amount
                  </span>
                  <span className={`font-bold text-green-600`}>
                    ₹{finalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-lg border ${
                isDarkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !availability?.available}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
