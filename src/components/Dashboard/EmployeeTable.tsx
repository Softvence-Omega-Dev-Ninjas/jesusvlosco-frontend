import React from "react";
import { DateTime } from "luxon";
import { Avatar } from "./Avatar";
import { useGetAllAssignedUsersQuery } from "@/store/api/admin/dashboard/getAllAssignedUsers";
import { AssignedUsersResponse, Profile } from "./employeeTableUtils";

// --- Small helpers (timezone-aware) ---
const formatDate = (iso?: string, zone = "UTC") => {
  if (!iso) return "";
  const dt = DateTime.fromISO(iso).setZone(zone);
  return dt.isValid ? dt.toFormat("dd/LL/yyyy") : "";
};

const formatTimeRange = (startIso?: string, endIso?: string, zone = "UTC") => {
  if (!startIso && !endIso) return "";
  const s = startIso
    ? DateTime.fromISO(startIso).setZone(zone).toFormat("h:mm a")
    : "";
  const e = endIso
    ? DateTime.fromISO(endIso).setZone(zone).toFormat("h:mm a")
    : "";
  return s && e ? `${s.toLowerCase()} - ${e.toLowerCase()}` : s || e;
};

const humanizeShiftType = (t?: string, startIso?: string, zone = "UTC") => {
  if (t)
    return t
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/(^| )\w/g, (c) => c.toUpperCase());
  if (startIso)
    return DateTime.fromISO(startIso).setZone(zone).hour < 12 ? "AM" : "PM";
  return "Shift";
};

const joinName = (p?: Profile) =>
  `${(p?.firstName ?? "").trim()} ${(p?.lastName ?? "").trim()}`.trim() ||
  "Unknown";

// --- Loading skeleton (simple, beautiful) ---
const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3 p-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 animate-pulse">
        <div className="rounded-full bg-gray-200 w-10 h-10" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-2 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
    ))}
  </div>
);

// --- Component ---
const EmployeeTable: React.FC = () => {
  // Detect user's timezone (IANA). Fallback to UTC if not available/invalid.
  const detectedZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const zone = DateTime.now().setZone(detectedZone).isValid
    ? detectedZone
    : "UTC";

  // default date in user's timezone (YYYY-MM-DD for <input type="date">)
  const todayIsoDate =
    DateTime.now().setZone(zone).toISODate() || new Date().toISOString();

  const [shiftDate, setShiftDate] = React.useState<string>(todayIsoDate);
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(15);

  // Important: pass timezone to backend so server filters using this zone
  const {
    data: assignedUsersData,
    isLoading,
    isFetching,
    error,
  } = useGetAllAssignedUsersQuery({
    shiftDate,
    page,
    limit,
    timezone: zone,
  }) as {
    data?: AssignedUsersResponse;
    isLoading: boolean;
    isFetching: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
  };

  // keep local page in sync with backend page (so UI and local state stay consistent)
  React.useEffect(() => {
    const remotePage = assignedUsersData?.metadata?.page;
    if (remotePage && remotePage !== page) setPage(remotePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedUsersData?.metadata?.page]);

  const items = assignedUsersData?.data ?? [];
  const metadata = assignedUsersData?.metadata;
  const totalPages = metadata?.totalPage ?? 1;
  const total = metadata?.total ?? 0;

  // handlers
  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShiftDate(e.target.value);
    setPage(1);
  };
  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const onLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  // loading / error
  if (isLoading || isFetching) return <LoadingSkeleton rows={6} />;
  if (error)
    return (
      <div className="p-4 text-red-500">Failed to load assigned employees.</div>
    );

  return (
    <div className="rounded-2xl overflow-hidden w-full">
      {/* Header + filters */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#4E53B1]">
            Assigned Employee
          </h2>
          <div className="text-sm text-gray-500">
            Times shown in your timezone:{" "}
            <span className="font-medium">{zone}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Date:</label>
          <input
            type="date"
            value={shiftDate}
            onChange={onDateChange}
            className="border px-2 py-1 rounded"
          />

          <label className="text-sm text-gray-600">Show:</label>
          <select
            value={limit}
            onChange={onLimitChange}
            className="border px-2 py-1 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
          </select>

          <div className="text-sm text-gray-600">
            {metadata
              ? `Page ${metadata.page} / ${totalPages} — ${total} items`
              : ""}
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border border-gray-200 p-5 rounded-2xl">
        <div
          className={`divide-y divide-gray-300 ${
            items.length > 5 ? "max-h-[400px] overflow-y-auto" : ""
          }`}
        >
          <div className="px-5 mr-2.5 py-4 grid grid-cols-5 border border-primary rounded-2xl gap-4 text-lg font-medium text-[#4E53B1]">
            <div>Employee</div>
            <div>Project Name</div>
            <div className="col-span-2">Shift</div>
            <div>Date</div>
          </div>

          {items.map((item) => {
            const profile = item.profile ?? {};
            const shift = item.shift ?? {};
            const project = item.project ?? {};
            const name = joinName(profile);
            const role = profile.jobTitle ?? "Employee";
            const avatar = profile.profileUrl ?? "";
            // render using user's timezone
            const date = formatDate(item.date, zone);
            const time = formatTimeRange(shift.startTime, shift.endTime, zone);
            const shiftLabel = humanizeShiftType(
              shift.shiftType,
              shift.startTime,
              zone
            );
            const shiftLocation = shift.location ?? project.location ?? "";
            const id =
              profile.id ||
              shift.id ||
              `${project.id}-${Math.random().toString(36).slice(2, 8)}`;

            return (
              <div
                key={id}
                className="px-6 py-4 grid grid-cols-5 gap-4 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    initials={name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    imageUrl={avatar}
                    size="lg"
                    className="flex-shrink-0 h-10 w-10"
                  />
                  <div>
                    <div className="text-[#4E53B1] text-base font-semibold">
                      {name}
                    </div>
                    <div className="text-sm font-medium text-[#949494]">
                      {role}
                    </div>
                  </div>
                </div>

                <div className="text-base font-normal text-[#484848]">
                  {project.title ?? "No Project"}
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
                      {shiftLabel}
                    </div>
                    <div className="text-sm text-gray-600">{time}</div>
                  </div>

                  {shiftLocation ? (
                    <div className="text-xs text-gray-400 mt-1">
                      {shiftLocation}
                    </div>
                  ) : null}
                </div>

                <div className="text-base font-normal text-gray-900">
                  {date}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pager controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {items.length} of {total} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={page <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">{page}</span>
            <button
              onClick={onNext}
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {items.map((item) => {
          const profile = item.profile ?? {};
          const shift = item.shift ?? {};
          const project = item.project ?? {};
          const name = joinName(profile);
          const role = profile.jobTitle ?? "Employee";
          const avatar = profile.profileUrl ?? "";
          const date = formatDate(item.date, zone);
          const time = formatTimeRange(shift.startTime, shift.endTime, zone);
          const shiftLabel = humanizeShiftType(
            shift.shiftType,
            shift.startTime,
            zone
          );
          const shiftLocation = shift.location ?? project.location ?? "";
          const id =
            profile.id ||
            shift.id ||
            `${project.id}-${Math.random().toString(36).slice(2, 8)}`;

          return (
            <div
              key={id}
              className="px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  initials={name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                  imageUrl={avatar}
                  size="lg"
                />
                <div className="flex-1">
                  <div className="font-medium text-primary text-sm">{name}</div>
                  <div className="text-xs text-gray-500">{role}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-normal text-[#484848]">
                    {shiftLabel}
                  </div>
                </div>
              </div>

              <div className="space-y-2 ml-13">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Project:</span>
                  <span className="text-xs text-gray-900">
                    {project.title ?? "No Project"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Time:</span>
                  <span className="text-xs text-gray-600">{time}</span>
                </div>

                {shiftLocation ? (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Location:</span>
                    <span className="text-xs text-gray-900">
                      {shiftLocation}
                    </span>
                  </div>
                ) : null}

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Date:</span>
                  <span className="text-xs text-gray-900">{date}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Mobile pager (same controls) */}
        <div className="flex items-center justify-between mt-4 px-4">
          <button
            onClick={onPrev}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-sm">
            {page} / {totalPages}
          </div>
          <button
            onClick={onNext}
            disabled={page >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
