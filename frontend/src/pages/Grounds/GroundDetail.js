import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  ArrowLeft,
  Calendar as CalendarIcon,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroundById,
  clearCurrentGround,
} from "../../store/slices/groundSlice";
import BookingModal from "../../components/Grounds/BookingModal";
import groundsService from "../../services/groundsService";

const GroundDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const dispatch = useDispatch();
  const {
    currentGround: ground,
    loading,
    error,
  } = useSelector((state) => state.grounds);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]); // For multi-slot selection

  // Availability checker state
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [groundBookings, setGroundBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Load booked slots (public endpoint - no auth required)
  const loadGroundBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      // Try to get detailed bookings (owner only)
      try {
        const bookings = await groundsService.getGroundBookings(id);
        setGroundBookings(bookings);
      } catch (ownerErr) {
        // If not owner, get public booked slots instead
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

        const bookedSlotsData = await groundsService.getBookedSlots(
          id,
          thirtyDaysAgo.toISOString().split("T")[0],
          thirtyDaysLater.toISOString().split("T")[0]
        );

        // Convert slots to booking-like format for UI compatibility
        const slotsAsBookings = bookedSlotsData.slots.map((slot) => {
          // Convert UTC slot times to local time
          const utcStartDateTime = new Date(`${slot.date}T${slot.startTime}Z`);
          const utcEndDateTime = new Date(`${slot.date}T${slot.endTime}Z`);

          // Handle cross-day slots (endTime < startTime)
          if (slot.endTime < slot.startTime) {
            utcEndDateTime.setDate(utcEndDateTime.getDate() + 1);
          }

          return {
            id: `slot-${slot.date}-${slot.startTime}`,
            startDatetime: utcStartDateTime.toISOString(),
            endDatetime: utcEndDateTime.toISOString(),
            status: slot.isBooked ? "confirmed" : "pending",
            isPaid: false,
          };
        });

        setGroundBookings(slotsAsBookings);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setGroundBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, [id]);

  useEffect(() => {
    dispatch(fetchGroundById(id));
    loadGroundBookings();
    return () => {
      dispatch(clearCurrentGround());
    };
  }, [dispatch, id, loadGroundBookings]);

  // Load availability when date changes (not currently using API, just calculating from bookings)
  useEffect(() => {
    // Availability is calculated from groundBookings, no need for separate API call
  }, [selectedDate, ground]);

  // Handler for slot clicks (with multi-select support)
  const handleSlotClick = (slot, hour) => {
    if (slot.isBooked) {
      return; // Don't open modal for booked slots
    }

    const slotKey = `${selectedDate}-${hour}`;
    const isSelected = selectedSlots.some((s) => s.key === slotKey);

    if (isSelected) {
      // Deselect the slot
      setSelectedSlots(selectedSlots.filter((s) => s.key !== slotKey));
    } else {
      // Select the slot
      const [startTime, endTime] = slot.time.split(" - ");
      setSelectedSlots([
        ...selectedSlots,
        {
          key: slotKey,
          hour,
          startTime,
          endTime,
          date: selectedDate,
        },
      ]);
    }
  };

  // Handler for booking selected slots
  const handleBookSelectedSlots = () => {
    if (selectedSlots.length === 0) return;

    // Sort slots by hour
    const sortedSlots = [...selectedSlots].sort((a, b) => a.hour - b.hour);

    // Check if slots are consecutive
    const areConsecutive = sortedSlots.every((slot, index) => {
      if (index === 0) return true;
      return slot.hour === sortedSlots[index - 1].hour + 1;
    });

    if (!areConsecutive) {
      alert("Please select consecutive time slots");
      return;
    }

    // Create a single booking with combined time range
    const startTime = sortedSlots[0].startTime;
    const endTime = sortedSlots[sortedSlots.length - 1].endTime;

    setSelectedSlot({
      startTime,
      endTime,
    });
    setShowBookingModal(true);
  };

  // Clear selected slots when date changes or modal closes
  const handleModalClose = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);
    setSelectedSlots([]);
  };

  useEffect(() => {
    setSelectedSlots([]);
  }, [selectedDate]);

  // Generate time slots for display
  const generateTimeSlots = () => {
    const slots = [];
    if (!ground) return slots;

    const openHour =
      ground.openTime === "00:00:00"
        ? 0
        : parseInt(ground.openTime.split(":")[0]);
    const closeHour =
      ground.closeTime === "23:59:59"
        ? 24
        : parseInt(ground.closeTime.split(":")[0]);

    for (let hour = openHour; hour < closeHour; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

      // Check if this slot is booked
      const isBooked = groundBookings.some((booking) => {
        if (
          !booking.startDatetime ||
          booking.status === "cancelled" ||
          booking.status === "rejected"
        )
          return false;

        // Handle both ISO datetime strings and slot format
        let bookingDate, bookingStartHour;

        if (booking.startDatetime.includes("T")) {
          // ISO datetime format from bookings API (in UTC)
          const bookingDateTime = new Date(booking.startDatetime);

          // Get local date and time for comparison
          const year = bookingDateTime.getFullYear();
          const month = String(bookingDateTime.getMonth() + 1).padStart(2, "0");
          const day = String(bookingDateTime.getDate()).padStart(2, "0");
          bookingDate = `${year}-${month}-${day}`;
          bookingStartHour = bookingDateTime.getHours();
        } else {
          // Slot format from booked-slots API (already in local time)
          bookingDate = booking.startDatetime.split(" ")[0] || selectedDate;
          bookingStartHour = parseInt(
            booking.startDatetime.split("T")[1]?.split(":")[0] ||
              startTime.split(":")[0]
          );
        }

        if (bookingDate !== selectedDate) return false;
        return bookingStartHour === hour;
      });

      slots.push({
        time: `${startTime} - ${endTime}`,
        hour,
        isBooked,
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const bookedSlots = timeSlots.filter((s) => s.isBooked).length;
  const availableSlots = timeSlots.length - bookedSlots;

  // Calculate booking statistics
  const confirmedBookings = groundBookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const pendingBookings = groundBookings.filter(
    (b) => b.status === "pending"
  ).length;
  const totalRevenue = groundBookings
    .filter((b) => b.isPaid)
    .reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div
            className={`animate-spin rounded-full h-16 w-16 border-b-2 ${
              isDarkMode ? "border-white" : "border-gray-900"
            } mx-auto mb-4`}
          ></div>
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            Loading ground details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !ground) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load ground details</p>
          <button
            onClick={() => navigate("/grounds")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Grounds
          </button>
        </div>
      </div>
    );
  }

  const images =
    ground.images && ground.images.length > 0
      ? ground.images
      : ["/placeholder-image.png"];

  const pitchTypeLabels = {
    turf: "Turf",
    cement: "Cement",
    matting: "Matting",
    astro_turf: "Astro Turf",
  };

  const amenitiesDisplay = [
    { key: "lighting", label: "Lighting", icon: "💡" },
    { key: "dressingRoom", label: "Dressing Room", icon: "👔" },
    { key: "parking", label: "Parking", icon: "🚗" },
    { key: "waterSupply", label: "Water Supply", icon: "💧" },
    { key: "firstAid", label: "First Aid", icon: "⚕️" },
    { key: "cafeteria", label: "Cafeteria", icon: "🍴" },
    { key: "scoreboard", label: "Scoreboard", icon: "📊" },
  ];

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Back Button */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/grounds")}
            className={`flex items-center gap-2 ${
              isDarkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Grounds
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div>
              <div className="relative h-96 rounded-lg overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700">
                {/* Blurred Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
                  style={{
                    backgroundImage: `url(${images[selectedImage]})`,
                  }}
                ></div>
                {/* Main Image */}
                <img
                  src={images[selectedImage]}
                  alt={ground.name}
                  className="relative w-full h-full object-contain z-10"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.png";
                  }}
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-24 rounded-lg overflow-hidden cursor-pointer bg-gray-200 dark:bg-gray-700 ${
                        selectedImage === index ? "ring-4 ring-green-600" : ""
                      }`}
                    >
                      {/* Blurred Background */}
                      <div
                        className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
                        style={{
                          backgroundImage: `url(${img})`,
                        }}
                      ></div>
                      {/* Thumbnail Image */}
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="relative w-full h-full object-contain z-10"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ground Info */}
            <div
              className={`rounded-lg shadow-md p-6 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1
                    className={`text-3xl font-bold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ground.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {ground.address}, {ground.city}, {ground.state}
                      </span>
                    </div>
                  </div>
                </div>
                {ground.rating > 0 && (
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 px-3 py-1 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span
                      className={`font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {ground.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({ground.reviewCount})
                    </span>
                  </div>
                )}
              </div>

              {/* Pitch Type Badge */}
              <div className="mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {pitchTypeLabels[ground.pitchType] || ground.pitchType}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  About This Ground
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {ground.description}
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div
                  className={`p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <Clock className="w-5 h-5 text-blue-600 mb-1" />
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Opening Hours
                  </div>
                  <div
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ground.openTime === "00:00:00" &&
                    ground.closeTime === "23:59:59"
                      ? "⏰ 24 Hours"
                      : `${ground.openTime?.substring(
                          0,
                          5
                        )} - ${ground.closeTime?.substring(0, 5)}`}
                  </div>
                </div>

                {ground.capacity > 0 && (
                  <div
                    className={`p-3 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <Users className="w-5 h-5 text-purple-600 mb-1" />
                    <div
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Capacity
                    </div>
                    <div
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {ground.capacity} players
                    </div>
                  </div>
                )}

                {ground.size > 0 && (
                  <div
                    className={`p-3 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <div className="w-5 h-5 text-green-600 mb-1">📐</div>
                    <div
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Size
                    </div>
                    <div
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {ground.size} sq.m
                    </div>
                  </div>
                )}

                <div
                  className={`p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <CalendarIcon className="w-5 h-5 text-orange-600 mb-1" />
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Total Bookings
                  </div>
                  <div
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ground.totalBookings}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {ground.amenities && (
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Amenities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenitiesDisplay.map(({ key, label, icon }) =>
                      ground.amenities[key] ? (
                        <div
                          key={key}
                          className={`flex items-center gap-2 p-3 rounded-lg ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <span className="text-2xl">{icon}</span>
                          <div>
                            <div
                              className={`font-medium ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {label}
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                    {ground.amenities.seatingCapacity > 0 && (
                      <div
                        className={`flex items-center gap-2 p-3 rounded-lg ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <span className="text-2xl">💺</span>
                        <div>
                          <div
                            className={`font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Seating
                          </div>
                          <div
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {ground.amenities.seatingCapacity} seats
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Availability Checker - NEW! */}
            <div
              className={`rounded-lg shadow-md p-6 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Check Availability
                </h3>
                <CalendarIcon className="w-6 h-6 text-green-600" />
              </div>

              {/* Date Selector */}
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Availability Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div
                  className={`p-4 rounded-lg text-center ${
                    isDarkMode
                      ? "bg-blue-900/30 border border-blue-800"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {timeSlots.length}
                  </div>
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-blue-300" : "text-blue-800"
                    }`}
                  >
                    Total Slots
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg text-center ${
                    isDarkMode
                      ? "bg-green-900/30 border border-green-800"
                      : "bg-green-50 border border-green-200"
                  }`}
                >
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {availableSlots}
                  </div>
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-green-300" : "text-green-800"
                    }`}
                  >
                    Available
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg text-center ${
                    isDarkMode
                      ? "bg-red-900/30 border border-red-800"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {bookedSlots}
                  </div>
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-red-300" : "text-red-800"
                    }`}
                  >
                    Booked
                  </div>
                </div>
              </div>

              {/* Time Slots Grid */}
              {loadingBookings ? (
                <div className="text-center py-8">
                  <div
                    className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                      isDarkMode ? "border-white" : "border-gray-900"
                    } mx-auto mb-2`}
                  ></div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Loading slots...
                  </p>
                </div>
              ) : timeSlots.length > 0 ? (
                <>
                  <div className="mb-3">
                    <h4
                      className={`text-sm font-semibold mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Time Slots for{" "}
                      {new Date(selectedDate).toLocaleDateString("en-IN", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </h4>
                    <p
                      className={`text-xs flex items-center gap-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                      Click slots to select multiple (must be consecutive)
                    </p>
                  </div>

                  {/* Book Selected Slots Button */}
                  {selectedSlots.length > 0 && (
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedSlots.length} slot
                        {selectedSlots.length > 1 ? "s" : ""} selected
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSlots([])}
                          className={`px-3 py-1 rounded text-sm ${
                            isDarkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleBookSelectedSlots}
                          className="px-4 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Book {selectedSlots.length} Slot
                          {selectedSlots.length > 1 ? "s" : ""}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto overflow-x-hidden px-2 py-1">
                    {timeSlots.map((slot, index) => {
                      const slotKey = `${selectedDate}-${slot.hour}`;
                      const isSelected = selectedSlots.some(
                        (s) => s.key === slotKey
                      );

                      return (
                        <div
                          key={index}
                          onClick={() => handleSlotClick(slot, slot.hour)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            slot.isBooked
                              ? isDarkMode
                                ? "bg-red-900/20 border-red-800 text-red-300 cursor-not-allowed opacity-60"
                                : "bg-red-50 border-red-300 text-red-700 cursor-not-allowed opacity-60"
                              : isSelected
                              ? isDarkMode
                                ? "bg-blue-900/40 border-blue-600 text-blue-200 cursor-pointer shadow-lg ring-2 ring-blue-500"
                                : "bg-blue-100 border-blue-500 text-blue-900 cursor-pointer shadow-lg ring-2 ring-blue-400"
                              : isDarkMode
                              ? "bg-green-900/20 border-green-800 text-green-300 cursor-pointer hover:bg-green-900/40 hover:border-green-600 hover:shadow-lg transform hover:scale-105"
                              : "bg-green-50 border-green-300 text-green-700 cursor-pointer hover:bg-green-100 hover:border-green-400 hover:shadow-lg transform hover:scale-105"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                slot.isBooked
                                  ? "bg-red-600"
                                  : isSelected
                                  ? "bg-blue-600"
                                  : "bg-green-600 animate-pulse"
                              }`}
                            ></div>
                            <span className="text-sm font-semibold">
                              {slot.time}
                            </span>
                          </div>
                          <div className="text-xs mt-1 flex items-center gap-1">
                            {slot.isBooked ? (
                              "Booked"
                            ) : isSelected ? (
                              <>
                                <span>✓ Selected</span>
                              </>
                            ) : (
                              <>
                                <span>Click to Select</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div
                  className={`text-center py-8 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No time slots available</p>
                </div>
              )}
            </div>

            {/* Booking Statistics - NEW! */}
            <div
              className={`rounded-lg shadow-md p-6 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Booking Statistics
                </h3>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {groundBookings.length}
                  </div>
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Total Bookings
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {confirmedBookings}
                  </div>
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Confirmed
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {pendingBookings}
                  </div>
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Pending
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    ₹{totalRevenue.toFixed(0)}
                  </div>
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Revenue
                  </div>
                </div>
              </div>

              {/* Popularity Indicator */}
              {ground.totalBookings > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Popularity
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {ground.totalBookings > 50
                        ? "Very Popular"
                        : ground.totalBookings > 20
                        ? "Popular"
                        : "Rising"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (ground.totalBookings / 100) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Owner Info */}
            {ground.owner && (
              <div
                className={`rounded-lg shadow-md p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Ground Owner
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl">
                    {ground.owner.firstName?.[0] ||
                      ground.owner.fullName?.[0] ||
                      "O"}
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {ground.owner.fullName ||
                        `${ground.owner.firstName} ${ground.owner.lastName}`}
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {ground.owner.email}
                    </div>
                  </div>
                </div>

                {/* Call Now Button */}
                {ground.owner.phone && (
                  <a
                    href={`tel:${ground.owner.phone}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span className="text-xl">📞</span>
                    <span className="font-semibold">
                      Call to Confirm Booking
                    </span>
                  </a>
                )}
                {ground.owner.phone && (
                  <p
                    className={`text-xs text-center mt-2 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {ground.owner.phone}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div
              className={`sticky top-4 rounded-lg shadow-md p-6 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Booking Information
              </h3>

              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    Hourly Rate
                  </span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₹{ground.hourlyRate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    Daily Rate
                  </span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₹{ground.dailyRate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg transition-colors mb-4"
              >
                Book Now
              </button>

              {/* Quick Availability Indicator */}
              <div
                className={`p-3 rounded-lg mb-4 ${
                  availableSlots > 5
                    ? isDarkMode
                      ? "bg-green-900/30 border border-green-800"
                      : "bg-green-50 border border-green-200"
                    : availableSlots > 0
                    ? isDarkMode
                      ? "bg-yellow-900/30 border border-yellow-800"
                      : "bg-yellow-50 border border-yellow-200"
                    : isDarkMode
                    ? "bg-red-900/30 border border-red-800"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      availableSlots > 5
                        ? "bg-green-600"
                        : availableSlots > 0
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  ></div>
                  <span
                    className={`text-sm font-semibold ${
                      availableSlots > 5
                        ? "text-green-600"
                        : availableSlots > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {availableSlots > 5
                      ? "Good Availability"
                      : availableSlots > 0
                      ? "Limited Slots"
                      : "Fully Booked"}
                  </span>
                </div>
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {availableSlots} of {timeSlots.length} slots available today
                </p>
              </div>

              {/* Additional Info */}
              <div
                className={`pt-6 border-t ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Instant booking confirmation
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Secure payment processing
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Flexible cancellation policy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={handleModalClose}
          ground={ground}
          prefilledDate={selectedSlot ? selectedDate : null}
          prefilledSlot={selectedSlot}
          selectedSlots={selectedSlots.length > 0 ? selectedSlots : null}
          onSuccess={() => {
            setSelectedSlot(null);
            navigate("/bookings/my-bookings");
          }}
        />
      )}
    </div>
  );
};

export default GroundDetail;
