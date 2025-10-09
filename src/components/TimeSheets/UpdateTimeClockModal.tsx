/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { TimeSheetEntry } from "@/pages/TimeSheets";
import { useEditTimeClockAdminMutation } from "@/store/api/admin/time-clock/timeClockApi";
import ClockLocationMap from "./ClockLocationMap";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entry: TimeSheetEntry | null;
  onUpdated?: () => void;
}

const pad = (n: number) => n.toString().padStart(2, "0");

function isoToLocalDatetimeInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function UpdateTimeClockModal({
  isOpen,
  onClose,
  entry,
}: Props) {
  const [editTime] = useEditTimeClockAdminMutation();

  const [clockInLocal, setClockInLocal] = useState<string>("");
  const [clockOutLocal, setClockOutLocal] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setClockInLocal(isoToLocalDatetimeInput(entry.clockIn));
      setClockOutLocal(isoToLocalDatetimeInput(entry.clockOut));
    } else {
      setClockInLocal("");
      setClockOutLocal("");
    }
  }, [entry]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;

    if (!entry.clockOut) {
      Swal.fire(
        "Validation",
        "This entry has not been clocked out yet.",
        "warning"
      );
      return;
    }

    if (!clockInLocal && !clockOutLocal) {
      Swal.fire(
        "Validation",
        "Provide at least one of Clock In or Clock Out.",
        "warning"
      );
      return;
    }

    // Convert local datetime-local (yyyy-mm-ddThh:mm) into ISO strings
    const toIso = (local?: string) => {
      if (!local) return undefined;
      // Date constructor will interpret string as local time when format is yyyy-mm-ddTHH:mm
      const d = new Date(local);
      return d.toISOString();
    };

    const payload: Record<string, string | undefined> = {};
    if (clockInLocal) payload["clockInAt"] = toIso(clockInLocal);
    if (clockOutLocal) payload["clockOutAt"] = toIso(clockOutLocal);

    try {
      setLoading(true);
      await editTime({ id: entry.id, data: payload }).unwrap();
      setLoading(false);
      Swal.fire("Success", "Time clock updated successfully.", "success");
      onClose();
    } catch (err: any) {
      setLoading(false);
      console.error("Update error", err);
      const message =
        err?.data?.message || err?.message || "Failed to update time clock.";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={() => !loading && onClose()}
      />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl z-10 p-6"
      >
        <h3 className="text-lg font-semibold mb-4">
          Edit Clock-in / Clock-out Time
        </h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            {/* user info */}
            <div className="flex items-center mb-4">
              <img
                src={entry?.user?.profileUrl || ""}
                alt="User Avatar"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">{entry?.user?.name}</p>
                <p className="text-sm text-gray-600">{entry?.user?.email}</p>
              </div>
            </div>

            {/* shift info */}
            <div className="flex items-center mb-4">
              <div>
                <p className="font-semibold mb-1 text-gray-600 text-sm">Shift:</p>
                <p className="font-semibold">{entry?.shift?.title}</p>
                <p className="text-sm text-gray-600">
                  {entry?.shift?.location}
                </p>
              </div>
            </div>

            {/* inputs */}
            <label className="block mb-3">
              <span className="text-sm text-gray-700">Clock In</span>
              <input
                type="datetime-local"
                value={clockInLocal}
                onChange={(e) => setClockInLocal(e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm text-gray-700">Clock Out</span>
              <input
                type="datetime-local"
                value={clockOutLocal}
                onChange={(e) => setClockOutLocal(e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
            </label>
          </div>

          {/* Map of clock-in / clock-out location */}
          <div className="mb-4">
            <p className="font-semibold mb-2">Clock In Location</p>
            <ClockLocationMap entry={entry as TimeSheetEntry} />
          </div>
        </div>
        {/* buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => !loading && onClose()}
            className="px-4 py-2 rounded border"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white bg-blue-600 disabled:opacity-50`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
