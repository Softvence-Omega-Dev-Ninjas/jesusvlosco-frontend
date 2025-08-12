import { useAppSelector } from "@/hooks/useRedux";
import { selectUser } from "@/store/Slices/AuthSlice/authSlice";
import { Link } from "react-router-dom";

export default function VerificationComplete() {
  const user = useAppSelector(selectUser);
  console.log(user?.role);
  const path = user?.role === "EMPLOYEE" ? "/user" : "/admin";
  return (
    <div className="bg-white p-10 rounded-xl shadow-md text-center w-[300px]">
      {/* Green check icon (you can replace with an SVG or image) */}
      <div className="flex justify-center mb-4">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center animate-ping-slow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-[#5A60EA] mb-4">
        Verification Complete
      </h2>

      <Link
        to={path}
        className="bg-[#5A60EA] hover:bg-[#4752d6] text-white px-6 py-2 rounded mt-4"
      >
        Let's Go!
      </Link>
    </div>
  );
}
