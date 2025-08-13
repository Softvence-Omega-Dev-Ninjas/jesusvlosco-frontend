import NotificationIcon from "@/assets/user-dashboard/notifications.svg";

interface AlertBannerProps {
  message: string;
  type?: "warning" | "info";
  onDismiss: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({
  message,
  type = "warning",
  onDismiss,
}) => {
  const bgColor =
    type === "warning"
      ? "bg-[#F5D8D8] border-[#DC1E28]"
      : "bg-blue-50 border-blue-200";
  const textColor = type === "warning" ? "text-[#DC1E28]" : "text-blue-800";

  return (
    <div className={`${bgColor} border-l-4 p-4 mb-6 rounded-lg`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={NotificationIcon} alt="" />
          <span className={`font-medium text-base ${textColor}`}>
            {message}
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="text-[#DC1E28] cursor-pointer font-medium"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;
