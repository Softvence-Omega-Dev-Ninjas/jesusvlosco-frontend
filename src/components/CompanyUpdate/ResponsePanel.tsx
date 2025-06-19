
import React from 'react';

interface ResponsePanelProps {
    announcement: {
        id: number;
        title: string;
        time: string;
        tags: string[];
    };
    onClose: () => void;
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({ announcement, onClose }) => {
    const users = [
        {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Confirmed",
        },
        {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Cancelled",
        },
        {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Confirmed",
        },
        {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Confirmed",
        },
        {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Confirmed",
        },
       {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Cancelled",
        },
        {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Confirmed",
        },
        {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Confirmed",
        },
        {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Confirmed",
        },
        {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Confirmed",
        },
        {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Cancelled",
        },
        {
            name: "Cody Fisher",
            phone: "(702) 555-0122",
            like: 1,
            date: "6/9/14",
            status: "Viewed",
            confirmed: "Confirmed",
        },
        // Add more users as needed
    ];

    return (
        // <div className="w-full max-w-8xl mx-auto bg-white border rounded-xl p-4 md:p-6   shadow-inner overflow-hidden">
        <div className="w-full max-w-8xl  md:mx-auto  bg-white border rounded-xl p-4 md:p-6 shadow-inner overflow-hidden">


            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-semibold text-indigo-700">Response</h2>
                    <p className="text-sm text-gray-500 truncate">{announcement.title}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-lg md:text-base"
                >
                    ✕
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-sm md:text-lg font-bold">80%</span>
                    </div>
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">210/250</span> Viewed
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 text-sm md:text-lg font-bold">20%</span>
                    </div>
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">40/250</span> Not viewed
                    </p>
                </div>
                <div className="flex items-center justify-start md:justify-end">
                    <p className="text-sm text-gray-500">❤️ 200 likes</p>
                </div>
            </div>




            <div className="w-full overflow-x-auto">
                <table className="min-w-full text-xs sm:text-sm border border-gray-200">
                    <thead className="bg-gray-50 text-gray-600 whitespace-nowrap">
                        <tr>
                            <th className="px-2 py-1 sm:px-4 sm:py-2">
                                <input type="checkbox" className="w-3 h-3 sm:w-4 sm:h-4" />
                            </th>
                            <th className="px-2 py-1 sm:px-4 sm:py-2">Name</th>
                            <th className="px-2 py-1 sm:px-4 sm:py-2">Phone</th>
                            <th className="px-2 py-1 sm:px-4 sm:py-2">Like</th>
                            <th className="px-2 py-1 sm:px-4 sm:py-2">Date</th>
                            <th className="px-2 py-1 sm:px-4 sm:py-2">Status</th>
                            <th className="px-2 py-1 sm:px-4 sm:py-2">Confirmed</th>
                        </tr>
                    </thead>
                    <tbody >
                        {users.map((user, idx) => (
                            <tr key={idx} className="border-t  border-gray-100">
                                <td className="px-2  py-1 sm:px-4 sm:py-2">
                                    <input type="checkbox" className="w-3 h-3 sm:w-4 sm:h-4" />
                                </td>
                                <td className="px-2 py-1 sm:px-4 sm:py-2 whitespace-nowrap">{user.name}</td>
                                <td className="px-2 py-1 sm:px-4 sm:py-2 whitespace-nowrap">{user.phone}</td>
                                <td className="px-2 py-1 sm:px-4 sm:py-2">{user.like}</td>
                                <td className="px-2 py-1 sm:px-4 sm:py-2 whitespace-nowrap">{user.date}</td>
                                <td className="px-2 py-1 sm:px-4 sm:py-2">
                                    <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xxs sm:text-xs font-medium ${user.status === "Viewed"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-2 py-1 sm:px-4 sm:py-2">
                                    <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xxs sm:text-xs font-medium ${user.confirmed === "Confirmed"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}>
                                        {user.confirmed}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* Mobile Pagination */}
            <div className="md:hidden flex justify-center mt-4">
                <button className="px-4 py-2 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">
                    Load More
                </button>
            </div>
        </div>
    );
};

export default ResponsePanel;
