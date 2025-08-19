import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "OPEN" | "DAFT" | "DONE";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center px-3 py-2 rounded-full text-xs font-medium", {
        "bg-[#F5F5F5] text-slate-500": status === "OPEN",
        "bg-[#FFE6E7] text-red-600": status === "DAFT",
        "bg-[#D9F0E4] text-green-800": status === "DONE",
      })}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
