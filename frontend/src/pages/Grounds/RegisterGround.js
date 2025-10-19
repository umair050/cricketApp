import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  DollarSign,
  Clock,
  Image as ImageIcon,
  CheckCircle,
  ArrowLeft,
  Building2,
  Users,
  Ruler,
} from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useDispatch } from "react-redux";
import { createGround } from "../../store/slices/groundSlice";

const RegisterGround = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    name: "",
    description: "",
    pitchType: "turf",
    capacity: "",
    size: "",

    // Step 2: Location
    address: "",
    city: "",
    state: "",
    country: "India",
    latitude: "",
    longitude: "",

    // Step 3: Pricing & Timing
    hourlyRate: "",
    dailyRate: "",
    openTime: "06:00:00",
    closeTime: "22:00:00",
    is24Hours: false,

    // Step 4: Amenities
    amenities: {
      lighting: false,
      dressingRoom: false,
      parking: false,
      waterSupply: true,
      firstAid: false,
      cafeteria: false,
      scoreboard: false,
      seatingCapacity: 0,
    },

    // Step 5: Images
    images: [""],
  });

  const steps = [
    { number: 1, title: "Basic Info", icon: Building2 },
    { number: 2, title: "Location", icon: MapPin },
    { number: 3, title: "Pricing", icon: DollarSign },
    { number: 4, title: "Amenities", icon: CheckCircle },
    { number: 5, title: "Images", icon: ImageIcon },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "is24Hours") {
      // Handle 24 hours checkbox
      setFormData((prev) => ({
        ...prev,
        is24Hours: checked,
        openTime: checked ? "00:00:00" : "06:00:00",
        closeTime: checked ? "23:59:59" : "22:00:00",
      }));
    } else if (name.startsWith("amenities.")) {
      const amenityName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          [amenityName]: type === "checkbox" ? checked : parseInt(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    setError("");
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          setError("Ground name is required");
          return false;
        }
        if (!formData.description.trim()) {
          setError("Description is required");
          return false;
        }
        break;
      case 2:
        if (!formData.address.trim()) {
          setError("Address is required");
          return false;
        }
        if (!formData.city.trim()) {
          setError("City is required");
          return false;
        }
        if (!formData.state.trim()) {
          setError("State is required");
          return false;
        }
        break;
      case 3:
        if (!formData.hourlyRate || formData.hourlyRate <= 0) {
          setError("Valid hourly rate is required");
          return false;
        }
        if (!formData.dailyRate || formData.dailyRate <= 0) {
          setError("Valid daily rate is required");
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      setError("");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setError("");
    setLoading(true);

    try {
      // Remove is24Hours (UI-only field) and prepare data
      const { is24Hours, ...dataToSubmit } = formData;

      const submitData = {
        ...dataToSubmit,
        hourlyRate: parseFloat(formData.hourlyRate),
        dailyRate: parseFloat(formData.dailyRate),
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        capacity: parseInt(formData.capacity) || 0,
        size: parseFloat(formData.size) || 0,
        images: formData.images.filter((img) => img.trim()),
        amenities: {
          ...formData.amenities,
          seatingCapacity: parseInt(formData.amenities.seatingCapacity) || 0,
        },
      };

      await dispatch(createGround(submitData)).unwrap();
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/grounds/owner/my-grounds");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to register ground");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`text-center p-8 rounded-lg shadow-xl ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-300" />
          </div>
          <h2
            className={`text-2xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Ground Registered Successfully!
          </h2>
          <p
            className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Your ground is now pending admin approval.
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Redirecting to My Grounds...
          </p>
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
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Register Your Cricket Ground
          </h1>
          <p
            className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            List your ground and start earning from bookings
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        isCompleted
                          ? "bg-green-600 text-white"
                          : isActive
                          ? "bg-green-600 text-white"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isActive || isCompleted
                          ? isDarkMode
                            ? "text-white"
                            : "text-gray-900"
                          : isDarkMode
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        isCompleted
                          ? "bg-green-600"
                          : isDarkMode
                          ? "bg-gray-700"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="max-w-3xl mx-auto"
        >
          <div
            className={`rounded-lg shadow-md p-8 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Basic Information
                </h2>

                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Ground Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border text-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="e.g., MCG Cricket Ground"
                  />
                </div>

                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="Describe your ground's features, facilities, and what makes it special..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block mb-2 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Pitch Type *
                    </label>
                    <select
                      name="pitchType"
                      value={formData.pitchType}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="turf">Turf (Natural Grass)</option>
                      <option value="cement">Cement</option>
                      <option value="matting">Matting</option>
                      <option value="astro_turf">
                        Astro Turf (Artificial)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block mb-2 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Capacity (Players)
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={`block mb-2 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Ground Size (Optional)
                    </label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="Ground size in square meters"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Location Details
                </h2>

                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Full Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="123 Cricket Street, Locality"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block mb-2 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label
                      className={`block mb-2 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Maharashtra"
                    />
                  </div>

                  <div>
                    <label
                      className={`block mb-2 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Latitude (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      min="-90"
                      max="90"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="19.0760"
                    />
                    <p
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Range: -90 to 90 (e.g., 19.0760 for Mumbai)
                    </p>
                  </div>

                  <div>
                    <label
                      className={`block mb-2 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Longitude (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      min="-180"
                      max="180"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="72.8777"
                    />
                    <p
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Range: -180 to 180 (e.g., 72.8777 for Mumbai)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Pricing & Timing */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Pricing & Operating Hours
                </h2>

                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                  } border ${
                    isDarkMode ? "border-blue-800" : "border-blue-200"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-blue-300" : "text-blue-800"
                    }`}
                  >
                    💡 Tip: Set competitive rates based on your location and
                    facilities. You can adjust these later.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block mb-2 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Hourly Rate (₹) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border text-lg font-semibold ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="5000"
                      />
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Price per hour of usage
                    </p>
                  </div>

                  <div>
                    <label
                      className={`block mb-2 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Daily Rate (₹) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="dailyRate"
                        value={formData.dailyRate}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border text-lg font-semibold ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="40000"
                      />
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Full day booking rate
                    </p>
                  </div>
                </div>

                {/* 24 Hours Checkbox */}
                <div
                  className={`p-4 rounded-lg border ${
                    formData.is24Hours
                      ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                      : isDarkMode
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is24Hours"
                      checked={formData.is24Hours}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <div>
                      <span
                        className={`font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        ⏰ Open 24 Hours
                      </span>
                      <p
                        className={`text-xs mt-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Ground is available round the clock
                      </p>
                    </div>
                  </label>
                </div>

                {/* Operating Hours (hidden if 24 hours) */}
                {!formData.is24Hours && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block mb-2 font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Opening Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          name="openTime"
                          value={formData.openTime.substring(0, 5)}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              openTime: e.target.value + ":00",
                            }))
                          }
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block mb-2 font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Closing Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          name="closeTime"
                          value={formData.closeTime.substring(0, 5)}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              closeTime: e.target.value + ":00",
                            }))
                          }
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Location (already defined above) */}

            {/* Step 4: Amenities */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Amenities & Facilities
                </h2>

                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Select all amenities available at your ground
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      key: "lighting",
                      label: "Floodlights / Night Lighting",
                      icon: "💡",
                    },
                    { key: "dressingRoom", label: "Dressing Room", icon: "👔" },
                    { key: "parking", label: "Parking Facility", icon: "🚗" },
                    { key: "waterSupply", label: "Water Supply", icon: "💧" },
                    { key: "firstAid", label: "First Aid Kit", icon: "⚕️" },
                    {
                      key: "cafeteria",
                      label: "Cafeteria / Refreshments",
                      icon: "🍴",
                    },
                    { key: "scoreboard", label: "Scoreboard", icon: "📊" },
                  ].map(({ key, label, icon }) => (
                    <label
                      key={key}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.amenities[key]
                          ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                          : isDarkMode
                          ? "border-gray-600 hover:bg-gray-700"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name={`amenities.${key}`}
                        checked={formData.amenities[key]}
                        onChange={handleChange}
                        className="w-5 h-5"
                      />
                      <span className="text-2xl">{icon}</span>
                      <span
                        className={`font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {label}
                      </span>
                    </label>
                  ))}
                </div>

                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    name="amenities.seatingCapacity"
                    value={formData.amenities.seatingCapacity}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="500"
                  />
                  <p
                    className={`text-xs mt-1 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Number of spectator seats available
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Images */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Ground Images
                </h2>

                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                  } border ${
                    isDarkMode ? "border-blue-800" : "border-blue-200"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-blue-300" : "text-blue-800"
                    }`}
                  >
                    📸 Add at least one image URL. You can use free image
                    hosting services like Imgur, or cricket ground images from
                    Unsplash.
                  </p>
                </div>

                <div className="space-y-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) =>
                            handleImageChange(index, e.target.value)
                          }
                          className={`w-full px-4 py-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder={`Image ${
                            index + 1
                          } URL (e.g., https://example.com/ground.jpg)`}
                        />
                        {image && (
                          <p className="text-xs mt-1 text-green-600 dark:text-green-400">
                            ✓ Image URL added
                          </p>
                        )}
                      </div>
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addImageField}
                  className={`w-full px-4 py-3 rounded-lg border-2 border-dashed transition-colors ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  + Add Another Image
                </button>

                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <p
                    className={`text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Sample Image URLs (you can use these):
                  </p>
                  <ul className="text-xs space-y-1">
                    <li
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800
                    </li>
                    <li
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className={`flex-1 px-6 py-3 rounded-lg border font-medium ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  ← Previous
                </button>
              )}

              <button
                type="button"
                onClick={currentStep < 5 ? nextStep : handleSubmit}
                disabled={currentStep === 5 && loading}
                className={`flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentStep === 1 ? "w-full" : ""
                }`}
              >
                {currentStep === 5
                  ? loading
                    ? "Registering..."
                    : "✓ Register Ground"
                  : "Next →"}
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mt-4 text-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Step {currentStep} of 5
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterGround;
