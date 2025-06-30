import { LucideIcon } from "lucide-react";

interface BadgeProps {
  title: string;
  date: string;
  icon: LucideIcon;
}

const Badge: React.FC<BadgeProps> = ({ title, date, icon: Icon }) => {
  return (
    <div className="flex items-start space-x-3 mb-4">
      <div className="flex-shrink-0">
        <Icon className="h-8 w-8 text-yellow-500" />
      </div>
      <div>
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">Badge received by You on {date}</p>
      </div>
    </div>
  );
};

export default Badge;
