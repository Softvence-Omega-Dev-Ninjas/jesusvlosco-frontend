import { FaSpinner } from "react-icons/fa";

export default function TableLoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white opacity-50">
      <FaSpinner className="animate-spin text-4xl" />
    </div>
  );
}
