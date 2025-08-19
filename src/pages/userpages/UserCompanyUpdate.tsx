import UserAnnouncementForm from "@/components/UserDashoboard/UserAnnouncementForm";
import UserAnnouncementList from "@/components/UserDashoboard/UserAnnouncementList";
import { useState } from "react";

export default function UserCompanyUpdate() {

      const [showForm, setShowForm] = useState(false);
      const toggleForm = () => {
        setShowForm(!showForm);
      };
    return (
           <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h2 className="text-xl text-indigo-900 font-semibold mb-1">
            Company Update & Announcement
          </h2>
          <p className="text-gray-700">
            Stay informed with the latest company news and important updates
          </p>
        </div>
        <div>
          <button
            onClick={toggleForm}
            className="mt-2 px-4 min-w-max py-2 text-white text-sm font-medium rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            style={{ backgroundColor: "rgba(78, 83, 177, 1)" }}
          >
            {showForm ? "← Back to list" : "+ Add announcement"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        {showForm ? <UserAnnouncementForm /> : <UserAnnouncementList/>}
      </div>
    </div>
    )
}
