import { CompanyUpdate } from "./types";

const CompanyUpdateItem: React.FC<{ update: CompanyUpdate }> = ({ update }) => {
  return (
    <div className="pb-4 mb-4  last:mb-0">
      <div className="flex items-start justify-between mb-2">
        <span
          className="px-2 inline-flex text-xs leading-5 font-semibold "
        >
          {update.title}
        </span>
      </div>

      <h4 className="font-medium text-lg text-gray-800 mb-1">{update.message}</h4>
      <span className="text-sm font-normal text-gray-500">{new Date(update.createdAt).toLocaleString()}</span>
    </div>
  );
};

export default CompanyUpdateItem;
