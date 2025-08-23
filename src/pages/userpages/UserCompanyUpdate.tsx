import UserAnnouncementForm from "@/components/UserDashoboard/UserAnnouncementForm";
import UserAnnouncementList from "@/components/UserDashoboard/UserAnnouncementList";
import { useState } from "react";

export default function UserCompanyUpdate() {

      const [showForm] = useState(false);
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
      </div>

      <div className="mt-6">
        {showForm ? <UserAnnouncementForm /> : <UserAnnouncementList/>}
      </div>
    </div>
    )
}
