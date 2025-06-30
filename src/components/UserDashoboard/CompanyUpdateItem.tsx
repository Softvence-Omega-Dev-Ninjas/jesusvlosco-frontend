import { CompanyUpdate } from "./types";

const CompanyUpdateItem: React.FC<{ update: CompanyUpdate }> = ({ update }) => {
  const getBadgeColor = (dept: string) => {
    switch (dept) {
      case "HR":
        return "bg-[#FFEFD9] text-primary px-2.5 py-1";
      case "IT":
        return "bg-green-100 text-green-800 px-3.5 py-1";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="pb-4 mb-4  last:mb-0">
      <div className="flex items-start justify-between mb-2">
        <span
          className={` rounded text-sm font-medium ${getBadgeColor(
            update.department
          )}`}
        >
          {update.department}
        </span>
      </div>

      <h4 className="font-medium text-lg text-gray-800 mb-1">{update.title}</h4>
      <p className="text-base font-normal text-gray-600">
        {update.description}
      </p>
      <span className="text-sm font-normal text-gray-500">{update.time}</span>
    </div>
  );
};

export default CompanyUpdateItem;
