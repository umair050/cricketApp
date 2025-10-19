import React from "react";
import { MapPin, Star, DollarSign, Clock, Users } from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useNavigate } from "react-router-dom";

const GroundCard = ({ ground }) => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const pitchTypeColors = {
    turf: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cement: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    matting: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    astro_turf:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };

  const pitchTypeLabels = {
    turf: "Turf",
    cement: "Cement",
    matting: "Matting",
    astro_turf: "Astro Turf",
  };

  return (
    <div
      onClick={() => navigate(`/grounds/${ground.id}`)}
      className={`rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isDarkMode
          ? "bg-gray-800 hover:bg-gray-750"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        {/* Blurred Background */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-md scale-110"
          style={{
            backgroundImage: `url(${
              ground.images?.[0] || "/placeholder-image.png"
            })`,
          }}
        ></div>
        {/* Main Image */}
        <img
          src={ground.images?.[0] || "/placeholder-image.png"}
          alt={ground.name}
          className="relative w-full h-full object-contain z-10"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder-image.png";
          }}
        />
        <div className="absolute z-10 top-3 right-3 flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              pitchTypeColors[ground.pitchType] || pitchTypeColors.turf
            }`}
          >
            {pitchTypeLabels[ground.pitchType] || ground.pitchType}
          </span>
        </div>
        {ground.rating > 0 && (
          <div className="absolute bottom-3 left-3 bg-white dark:bg-gray-900 px-2 py-1 rounded-lg flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-sm">
              {ground.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({ground.reviewCount})
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3
          className={`text-lg font-bold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {ground.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4" />
          <span>
            {ground.city}, {ground.state}
          </span>
        </div>

        {/* Description */}
        <p
          className={`text-sm mb-4 line-clamp-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {ground.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ground.amenities?.lighting && (
            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              Lighting
            </span>
          )}
          {ground.amenities?.parking && (
            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
              Parking
            </span>
          )}
          {ground.amenities?.dressingRoom && (
            <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
              Dressing Room
            </span>
          )}
        </div>

        {/* Pricing & Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <span
                className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ₹{ground.hourlyRate}
              </span>
              <span className="text-xs text-gray-500">/hour</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {ground.openTime === "00:00:00" &&
                ground.closeTime === "23:59:59"
                  ? "24 Hours"
                  : `${ground.openTime?.substring(
                      0,
                      5
                    )} - ${ground.closeTime?.substring(0, 5)}`}
              </span>
            </div>
            {ground.capacity > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{ground.capacity}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroundCard;
