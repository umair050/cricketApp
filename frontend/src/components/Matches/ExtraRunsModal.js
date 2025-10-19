import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";

const ExtraRunsModal = ({ isOpen, onClose, onSubmit, extraType }) => {
  const { isDarkMode } = useDarkMode();
  const [additionalRuns, setAdditionalRuns] = useState(0);

  const handleSubmit = () => {
    onSubmit(extraType, additionalRuns);
    setAdditionalRuns(0);
    onClose();
  };

  const getExtraInfo = () => {
    switch (extraType?.id) {
      case "wide":
        return {
          title: "Wide Ball",
          baseRuns: 1,
          description: "Base: +1 run. Add any additional runs if batsmen ran.",
          color: "yellow",
        };
      case "no_ball":
        return {
          title: "No Ball",
          baseRuns: 1,
          description:
            "Base: +1 run. Add runs if batsman hit the ball. Next ball is FREE HIT!",
          color: "yellow",
        };
      case "bye":
        return {
          title: "Bye",
          baseRuns: 0,
          description:
            "Runs scored without bat contact. Select number of byes.",
          color: "blue",
        };
      case "leg_bye":
        return {
          title: "Leg Bye",
          baseRuns: 0,
          description: "Runs scored off the body. Select number of leg byes.",
          color: "blue",
        };
      default:
        return {
          title: "Extra",
          baseRuns: 0,
          description: "Select runs",
          color: "gray",
        };
    }
  };

  if (!isOpen || !extraType) return null;

  const info = getExtraInfo();
  const totalRuns = info.baseRuns + additionalRuns;

  const runOptions = [0, 1, 2, 3, 4];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl max-w-md w-full ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div>
            <h3
              className={`text-xl font-semibold flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <AlertTriangle className={`w-5 h-5 text-${info.color}-500`} />
              {info.title}
            </h3>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {info.description}
            </p>
          </div>
          <button
            onClick={() => {
              setAdditionalRuns(0);
              onClose();
            }}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Total Runs Display */}
          <div
            className={`mb-6 p-4 rounded-lg text-center ${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <p
              className={`text-sm mb-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Runs
            </p>
            <p
              className={`text-5xl font-bold ${
                isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              {totalRuns}
            </p>
            <p
              className={`text-xs mt-2 ${
                isDarkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {info.baseRuns > 0 && `${info.baseRuns} (base) + `}
              {additionalRuns}{" "}
              {extraType?.id === "wide" || extraType?.id === "no_ball"
                ? "(runs)"
                : "(byes)"}
            </p>
          </div>

          {/* Run Selection */}
          <div>
            <p
              className={`text-sm font-medium mb-3 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {extraType?.id === "wide" || extraType?.id === "no_ball"
                ? "Additional Runs (if batsmen ran or ball was hit)"
                : "Number of Runs"}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {runOptions.map((runs) => (
                <button
                  key={runs}
                  onClick={() => setAdditionalRuns(runs)}
                  className={`p-4 rounded-lg font-bold text-xl transition-all ${
                    additionalRuns === runs
                      ? "bg-green-600 text-white"
                      : isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  {runs}
                </button>
              ))}
            </div>
          </div>

          {/* Special Notes */}
          {extraType?.id === "no_ball" && (
            <div
              className={`mt-4 p-3 rounded-lg border-2 border-yellow-500 ${
                isDarkMode ? "bg-yellow-900 bg-opacity-20" : "bg-yellow-50"
              }`}
            >
              <p
                className={`text-sm font-medium flex items-center gap-2 ${
                  isDarkMode ? "text-yellow-400" : "text-yellow-700"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Next ball will be a FREE HIT! 🔥
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t flex gap-3 ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            Submit {info.title}
          </button>
          <button
            onClick={() => {
              setAdditionalRuns(0);
              onClose();
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtraRunsModal;

