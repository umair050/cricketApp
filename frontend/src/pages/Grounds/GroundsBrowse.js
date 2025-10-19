import React, { useEffect, useState } from "react";
import { Search, Filter, MapPin, X } from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGrounds,
  setFilters,
  clearFilters,
} from "../../store/slices/groundSlice";
import GroundCard from "../../components/Grounds/GroundCard";

const GroundsBrowse = () => {
  const { isDarkMode } = useDarkMode();
  const dispatch = useDispatch();
  const { grounds, pagination, filters, loading, error } = useSelector(
    (state) => state.grounds
  );

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    // Remove empty filter values before sending
    const cleanedFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    dispatch(fetchGrounds({ ...cleanedFilters, page: 1, limit: 12 }));
  }, [dispatch]);

  const handleSearch = () => {
    // Remove empty filter values before sending
    const cleanedFilters = Object.entries(localFilters).reduce(
      (acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    dispatch(setFilters(localFilters));
    dispatch(fetchGrounds({ ...cleanedFilters, page: 1, limit: 12 }));
  };

  const handleClearFilters = () => {
    setLocalFilters({
      city: "",
      state: "",
      pitchType: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      search: "",
    });
    dispatch(clearFilters());
    dispatch(fetchGrounds({ page: 1, limit: 12 }));
  };

  const handlePageChange = (newPage) => {
    // Remove empty filter values before sending
    const cleanedFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    dispatch(fetchGrounds({ ...cleanedFilters, page: newPage, limit: 12 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value !== ""
  );

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="container mx-auto px-4 py-6">
          <h1
            className={`text-3xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Browse Cricket Grounds
          </h1>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="search"
                value={localFilters.search}
                onChange={handleFilterChange}
                placeholder="Search grounds by name or description..."
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg border flex items-center gap-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                  {Object.values(localFilters).filter((v) => v !== "").length}
                </span>
              )}
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div
              className={`mt-4 p-4 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label
                    className={`block mb-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={localFilters.city}
                    onChange={handleFilterChange}
                    placeholder="e.g., Mumbai"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={localFilters.state}
                    onChange={handleFilterChange}
                    placeholder="e.g., Maharashtra"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Pitch Type
                  </label>
                  <select
                    name="pitchType"
                    value={localFilters.pitchType}
                    onChange={handleFilterChange}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="">All Types</option>
                    <option value="turf">Turf</option>
                    <option value="cement">Cement</option>
                    <option value="matting">Matting</option>
                    <option value="astro_turf">Astro Turf</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block mb-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Min Price (₹/hr)
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={localFilters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Max Price (₹/hr)
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={localFilters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleClearFilters}
                    className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            Found <span className="font-semibold">{pagination.total}</span>{" "}
            grounds
          </p>
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
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        {!loading && grounds.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grounds.map((ground) => (
              <GroundCard key={ground.id} ground={ground} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && grounds.length === 0 && (
          <div
            className={`text-center py-12 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No grounds found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && grounds.length > 0 && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-4 py-2 rounded-lg border ${
                pagination.page === 1
                  ? "opacity-50 cursor-not-allowed"
                  : isDarkMode
                  ? "border-gray-600 text-white hover:bg-gray-700"
                  : "border-gray-300 text-gray-900 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg ${
                    page === pagination.page
                      ? "bg-green-600 text-white"
                      : isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={`px-4 py-2 rounded-lg border ${
                pagination.page === pagination.totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : isDarkMode
                  ? "border-gray-600 text-white hover:bg-gray-700"
                  : "border-gray-300 text-gray-900 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroundsBrowse;
