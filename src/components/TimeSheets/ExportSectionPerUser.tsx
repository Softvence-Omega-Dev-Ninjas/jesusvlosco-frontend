/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useGetTimeSheetByTimeRangePerUserQuery } from "@/store/api/admin/time-clock/timeClockApi";
import { DateTime } from "luxon";
import { userDefaultTimeZone } from "@/utils/dateUtils";
import { toast } from "sonner";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";

const ExportSectionPerUser = () => {
  const [range, setRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const timezone = userDefaultTimeZone();

  // selection & search
  const [userId, setUserId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>(""); // visible value in input
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // debounce input -> server query param
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const convertToISO = (
    dateString: string,
    isStart: boolean = true
  ): string => {
    if (!dateString) return "";
    try {
      const date = DateTime.fromISO(dateString, { zone: timezone });
      return isStart
        ? date.startOf("day").toUTC().toISO() || ""
        : date.endOf("day").toUTC().toISO() || "";
    } catch (error) {
      console.error("convertToISO error:", error);
      return "";
    }
  };

  const convertFromISO = (isoString: string): string => {
    if (!isoString) return "";
    return DateTime.fromISO(isoString).toISODate() || "";
  };

  const start = range.start ? range.start : "";
  const end = range.end ? range.end : "";

  const { data: timeSheetData, isLoading } =
    useGetTimeSheetByTimeRangePerUserQuery(
      {
        from: start,
        to: end,
        userId,
        timezone,
      },
      {
        skip: !range.start || !range.end,
      }
    );

  // SERVER-SIDE SEARCH: pass debouncedSearch to backend; skip when empty to avoid returning full list
  const { data: userData, isFetching: usersFetching } = useGetAllUserQuery(
    { searchTerm: debouncedSearch },
    {
      skip: !debouncedSearch,
    }
  );

  const users = useMemo(() => userData?.data ?? [], [userData]);

  // When userId is set programmatically (e.g., from selectedUser) ensure selectedUser is populated.
  useEffect(() => {
    if (!userId) {
      setSelectedUser(null);
      return;
    }
    // try to find in recently fetched users first
    const found = users.find((u: any) => u.id === userId) ?? null;
    if (found) {
      setSelectedUser(found);
      setSearchTerm(getUserDisplayName(found));
    }
  }, [userId, users]);

  // Display name helper
  function getUserDisplayName(u: any) {
    if (!u) return "";
    const first = u?.profile?.firstName?.trim() ?? "";
    const last = u?.profile?.lastName?.trim() ?? "";
    if (first || last) return `${first} ${last}`.trim();
    if (u?.email) return u.email;
    return `#${u?.employeeID ?? ""}`;
  }

  const selectUser = (u: any) => {
    setUserId(u.id);
    setSelectedUser(u);
    setSearchTerm(getUserDisplayName(u));
    setShowDropdown(false);
  };

  const clearSelectedUser = () => {
    setUserId("");
    setSelectedUser(null);
    setSearchTerm("");
    setShowDropdown(false);
    setDebouncedSearch("");
  };

  // Quick ranges
  const setQuickRange = (
    type: "thisWeek" | "lastWeek" | "thisMonth" | "lastMonth"
  ) => {
    const now = DateTime.now().setZone(timezone);

    let s: DateTime;
    let e: DateTime;

    switch (type) {
      case "thisWeek":
        s = now.startOf("week");
        e = now.endOf("week");
        break;
      case "lastWeek":
        s = now.minus({ weeks: 1 }).startOf("week");
        e = now.minus({ weeks: 1 }).endOf("week");
        break;
      case "thisMonth":
        s = now.startOf("month");
        e = now.endOf("month");
        break;
      case "lastMonth":
        s = now.minus({ months: 1 }).startOf("month");
        e = now.minus({ months: 1 }).endOf("month");
        break;
    }

    setRange({
      start: s.startOf("day").toUTC().toISO() || "",
      end: e.endOf("day").toUTC().toISO() || "",
    });
  };

  const handleExport = async () => {
    if (!range.start || !range.end) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (!userId) {
      toast.error("Please select a user");
      return;
    }
    try {
      setLoading(true);
      // Use timeSheetData from hook to build/export PDF
      // ...
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export timesheet data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8 mt-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Export Timesheets as PDF Per User
          </h3>
          <div className="text-xs text-gray-500 mt-2">
            Select a week or month range (in your timezone: {timezone}) or pick
            custom dates.
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Inputs */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="border border-gray-300 rounded px-3 py-2"
                    value={convertFromISO(range.start)}
                    onChange={(e) => {
                      const converted = convertToISO(e.target.value, true);
                      setRange((r) => ({ ...r, start: converted }));
                    }}
                    max={convertFromISO(range.end) || undefined}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="border border-gray-300 rounded px-3 py-2"
                    value={convertFromISO(range.end)}
                    onChange={(e) => {
                      const converted = convertToISO(e.target.value, false);
                      setRange((r) => ({ ...r, end: converted }));
                    }}
                    min={convertFromISO(range.start) || undefined}
                  />
                </div>

                <div className="relative w-full sm:w-80">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search user (server)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                      placeholder="Search by name, email or employee ID"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        // open dropdown when user types
                        if (e.target.value.trim()) setShowDropdown(true);
                        // if user cleared input, also clear selection
                        if (!e.target.value) clearSelectedUser();
                      }}
                      onFocus={() => {
                        if (searchTerm) setShowDropdown(true);
                      }}
                      aria-autocomplete="list"
                    />
                    {selectedUser ? (
                      <button
                        onClick={clearSelectedUser}
                        className="text-xs bg-red-50 px-2 py-1 rounded hover:bg-red-100"
                        title="Clear selection"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>

                  {/* Dropdown from server results */}
                  {showDropdown && debouncedSearch && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow max-h-64 overflow-auto">
                      {usersFetching ? (
                        <div className="p-3 text-xs text-gray-500">
                          Searching...
                        </div>
                      ) : users.length === 0 ? (
                        <div className="p-3 text-xs text-gray-500">
                          No users found
                        </div>
                      ) : (
                        <ul>
                          {users.map((u: any) => (
                            <li
                              key={u.id}
                              className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                selectUser(u);
                              }}
                            >
                              <img
                                src={
                                  u?.profile?.profileUrl ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    getUserDisplayName(u)
                                  )}&background=ddd`
                                }
                                alt={getUserDisplayName(u)}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {getUserDisplayName(u)}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {u.email}{" "}
                                  {u.employeeID ? `• #${u.employeeID}` : ""}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">
                                Select
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleExport}
                  disabled={
                    !range.start ||
                    !range.end ||
                    isLoading ||
                    loading ||
                    !selectedUser
                  }
                  className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60"
                >
                  {loading ? "Exporting..." : "Export PDF"}
                </button>
              </div>

              {/* Quick ranges */}
              <div className="flex gap-2 justify-end mt-4">
                <button
                  onClick={() => setQuickRange("thisWeek")}
                  className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                >
                  This Week
                </button>
                <button
                  onClick={() => setQuickRange("lastWeek")}
                  className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                >
                  Last Week
                </button>
                <button
                  onClick={() => setQuickRange("thisMonth")}
                  className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                >
                  This Month
                </button>
                <button
                  onClick={() => setQuickRange("lastMonth")}
                  className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                >
                  Last Month
                </button>
              </div>
            </div>

            {/* Right: Selected user card */}
            <div className="w-full lg:w-72">
              {selectedUser ? (
                <div className="border border-gray-100 bg-gray-50 rounded-lg p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        selectedUser?.profile?.profileUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          getUserDisplayName(selectedUser)
                        )}&background=ddd`
                      }
                      alt={getUserDisplayName(selectedUser)}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-semibold">
                        {getUserDisplayName(selectedUser)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedUser.role}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    <div>
                      <span className="font-medium text-gray-700">Email: </span>
                      <span className="truncate">{selectedUser.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Employee ID:{" "}
                      </span>
                      <span>{selectedUser.employeeID ?? "-"}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={clearSelectedUser}
                      className="text-xs px-3 py-1 rounded border border-gray-200 hover:bg-gray-100"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-200 rounded-lg p-4 text-xs text-gray-500">
                  No user selected
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExportSectionPerUser;
