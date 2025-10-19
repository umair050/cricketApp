import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { fetchPointsTable } from "../../store/slices/matchSlice";
import { useDarkMode } from "../../contexts/DarkModeContext";

const PointsTable = ({ tournamentId }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  const { pointsTable, loading, error } = useSelector((state) => state.match);
  const [activeGroup, setActiveGroup] = useState(0);

  useEffect(() => {
    if (tournamentId) {
      dispatch(fetchPointsTable(tournamentId));
    }
  }, [dispatch, tournamentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg">
        {error}
      </div>
    );
  }

  if (!pointsTable || pointsTable.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          No points table data available yet
        </p>
      </div>
    );
  }

  const currentGroupData = pointsTable[activeGroup];

  const getPositionColor = (index) => {
    if (index === 0) return "text-yellow-500"; // 1st place
    if (index === 1) return "text-gray-400"; // 2nd place
    if (index === 2) return "text-orange-400"; // 3rd place
    return isDarkMode ? "text-gray-500" : "text-gray-400";
  };

  const formatNRR = (nrr) => {
    const value = parseFloat(nrr);
    return value >= 0 ? `+${value.toFixed(3)}` : value.toFixed(3);
  };

  return (
    <div
      className={`rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Group Tabs */}
      {pointsTable.length > 1 && (
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {pointsTable.map((group, index) => (
            <button
              key={index}
              onClick={() => setActiveGroup(index)}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeGroup === index
                  ? "border-b-2 border-green-600 text-green-600"
                  : isDarkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {group.groupName}
            </button>
          ))}
        </div>
      )}

      {/* Points Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <th
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Pos
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Team
              </th>
              <th
                className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                M
              </th>
              <th
                className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                W
              </th>
              <th
                className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                L
              </th>
              <th
                className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Pts
              </th>
              <th
                className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                NRR
              </th>
            </tr>
          </thead>
          <tbody>
            {currentGroupData?.teams?.map((teamStat, index) => (
              <tr
                key={teamStat.id}
                className={`border-b transition-colors ${
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-50"
                } ${
                  teamStat.isQualified ? "bg-green-50 dark:bg-green-900/20" : ""
                }`}
              >
                {/* Position */}
                <td className="px-4 py-3">
                  <span className={`font-bold ${getPositionColor(index)}`}>
                    {index + 1}
                  </span>
                </td>

                {/* Team */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isDarkMode
                          ? "bg-green-700 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {teamStat.team?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {teamStat.team?.name}
                      </p>
                      {teamStat.isQualified && (
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          Qualified
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Matches Played */}
                <td
                  className={`px-4 py-3 text-center font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {teamStat.matchesPlayed}
                </td>

                {/* Wins */}
                <td
                  className={`px-4 py-3 text-center font-medium ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {teamStat.wins}
                </td>

                {/* Losses */}
                <td
                  className={`px-4 py-3 text-center font-medium ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {teamStat.losses}
                </td>

                {/* Points */}
                <td
                  className={`px-4 py-3 text-center font-bold text-lg ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {teamStat.points}
                </td>

                {/* NRR */}
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {teamStat.netRunRate > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : teamStat.netRunRate < 0 ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : null}
                    <span
                      className={`font-medium ${
                        teamStat.netRunRate > 0
                          ? "text-green-600 dark:text-green-400"
                          : teamStat.netRunRate < 0
                          ? "text-red-600 dark:text-red-400"
                          : isDarkMode
                          ? "text-gray-300"
                          : "text-gray-900"
                      }`}
                    >
                      {formatNRR(teamStat.netRunRate)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div
        className={`px-4 py-3 border-t text-xs ${
          isDarkMode
            ? "border-gray-700 text-gray-400"
            : "border-gray-200 text-gray-600"
        }`}
      >
        <p>
          <span className="font-medium">M</span> = Matches,{" "}
          <span className="font-medium">W</span> = Wins,{" "}
          <span className="font-medium">L</span> = Losses,{" "}
          <span className="font-medium">Pts</span> = Points,{" "}
          <span className="font-medium">NRR</span> = Net Run Rate
        </p>
        <p className="mt-1 text-green-600 dark:text-green-400">
          • Qualified teams are highlighted
        </p>
      </div>
    </div>
  );
};

export default PointsTable;


