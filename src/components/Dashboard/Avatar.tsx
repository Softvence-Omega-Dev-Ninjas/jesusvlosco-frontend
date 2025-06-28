import React from "react";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  imageUrl?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  size = "md",
  className = "",
  imageUrl,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  return (
    <div
      className={`rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={initials}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-semibold text-indigo-700">{initials}</span>
      )}
    </div>
  );
};
