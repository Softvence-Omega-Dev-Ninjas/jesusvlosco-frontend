import { Calendar } from "lucide-react";

interface NextShift {
  time: string;
  location: string;
  colleagues: string;
}

const NextShiftCard: React.FC<{ shift: NextShift }> = ({ shift }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <Calendar className="h-4 w-4 text-primary mr-2 mt-1" />
        <div>
          <p className="font-medium text-primary">{shift.time}</p>
          <p className="text-sm text-primary">{shift.location}</p>
          <p className="text-sm text-primary">With: {shift.colleagues}</p>
        </div>
      </div>
    </div>
  );
};

export default NextShiftCard;
