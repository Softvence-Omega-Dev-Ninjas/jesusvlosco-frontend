interface EmployeeCardProps {
  name: string;
  role: string;
  status: "Available" | "Busy" | "Unavailable";
  offDay: string;
  avatar?: string;
  className?: string;
}

export default function EmployeeCard({
  name,
  role,
  status,
  offDay,
  avatar,
  className = "",
}: EmployeeCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "text-green-500";
      case "Busy":
        return "text-yellow-500";
      case "Unavailable":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Manager":
        return "border-primary text-primary";
      case "Supervisor":
        return "border-blue-500 text-blue-600";
      case "Associate":
        return "border-gray-500 text-gray-600";
      default:
        return "border-gray-500 text-gray-600";
    }
  };

  return (
    <div
      className={`bg-white border h-[140px] border-gray-200 rounded-2xl p-5 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-400 flex items-center justify-center">
            {avatar ? (
              <img
                src={avatar || "/placeholder.svg"}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className={`text-sm font-medium ${getStatusColor(status)}`}>
              {status}
            </p>
            <p className="text-sm text-primary font-medium">
              Off Day: {offDay}
            </p>
          </div>
        </div>

        <div
          className={`px-4 py-2 border-[1.5px] rounded-full font-medium ${getRoleBadgeColor(
            role
          )}`}
        >
          {role}
        </div>
      </div>
    </div>
  );
}
