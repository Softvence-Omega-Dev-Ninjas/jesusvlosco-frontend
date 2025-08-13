// src/components/Dashboard/StatusBadge.tsx
import { CheckCircle, Clock, X } from "lucide-react";

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({
  status,
  className = "",
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "morning":
        return "bg-blue-900 text-blue-800";
      case "night":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-3 h-3" />;
      case "declined":
        return <X className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(
        status
      )} ${className}`}
    >
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
