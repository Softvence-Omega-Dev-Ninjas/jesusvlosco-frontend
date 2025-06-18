import AnnouncementList from "@/components/CompanyUpdate/AnnouncementList";


export const CompanyUpdate = () => {
    return (
        <div className="p-4  bg-white rounded-lg shadow">
            <div className="flex justify-between">
                <div>
                    <h2 className="text-xl  text-indigo-900  font-semibold mb-3">Company Update & Announcement</h2>
                    <p className="text-gray-700">Stay informed with the latest company news and important updates</p>
                </div>
                <div>
                    <button className="mt-4 px-4 min-w-max py-2  text-white text-sm font-medium rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" style={{ backgroundColor: 'rgba(78, 83, 177, 1)' }}  >
                        + Add announcement
                    </button>
                </div>
            </div>
            {/* Add your community/announcement interface here */}
            <AnnouncementList />
        </div>
    );
};


