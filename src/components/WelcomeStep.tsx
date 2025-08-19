import { Phone, Mail } from "lucide-react";

type Props = {
  onSelectMethod: (method: "phone" | "email") => void;
};

export default function WelcomeStep({ onSelectMethod }: Props) {
  return (
    <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
      <h2 className="text-2xl font-bold text-indigo-600 mb-3">Welcome</h2>
      <p className="text-gray-600 mb-8">Log in to your company app</p>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => onSelectMethod("phone")}
          className="flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          <Phone size={18} /> Log in with phone
        </button>

        <button
          onClick={() => onSelectMethod("email")}
          className="flex items-center gap-2 px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          <Mail size={18} /> Log in with email
        </button>
      </div>
    </div>
  );
}
