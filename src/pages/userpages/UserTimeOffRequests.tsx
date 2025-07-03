
import React from 'react';

interface TimeOffPolicy {
    type: string;
    days: number;
    bgColor: string;
    textColor: string;
}

interface TimeOffRequest {
    id: string;
    date: string;
    policy: string;
    requestedOn: string;
    totalRequested: string;
    status: 'Added by admin' | 'Rejected' | 'Pending' | 'Approved';
    statusColor: string;
}

const TimeOffDashboard: React.FC = () => {
    const policies: TimeOffPolicy[] = [
        { type: 'Time off', days: 22, bgColor: 'bg-gray-100', textColor: 'text-[#4E53B1]' },
        { type: 'Sick leave', days: 10, bgColor: 'bg-gray-100', textColor: 'text-[#4E53B1]' },
        { type: 'Casual leave', days: 12, bgColor: 'bg-gray-100', textColor: 'text-[#4E53B1]' },
        { type: 'Unpaid leave', days: 8, bgColor: 'bg-gray-100', textColor: 'text-[#4E53B1]' },
    ];

    const requests: TimeOffRequest[] = [
        {
            id: '1',
            date: '12/07/25-Full day',
            policy: 'Sick leave',
            requestedOn: '12/07/25',
            totalRequested: '1 Days',
            status: 'Added by admin',
            statusColor: 'bg-green-100 text-green-700'
        },
        {
            id: '2',
            date: '27/06/25-Full day',
            policy: 'Time off',
            requestedOn: '27/06/25',
            totalRequested: '1 Days',
            status: 'Rejected',
            statusColor: 'bg-red-100 text-red-700'
        },
        {
            id: '3',
            date: '27/06/25-Full day',
            policy: 'Time off',
            requestedOn: '27/06/25',
            totalRequested: '1 Days',
            status: 'Rejected',
            statusColor: 'bg-red-100 text-red-700'
        },
        {
            id: '4',
            date: '27/06/25-Full day',
            policy: 'Time off',
            requestedOn: '27/06/25',
            totalRequested: '1 Days',
            status: 'Rejected',
            statusColor: 'bg-red-100 text-red-700'
        },
        {
            id: '5',
            date: '25/06/25-Full day',
            policy: 'Sick leave',
            requestedOn: '25/06/25',
            totalRequested: '1 Days',
            status: 'Pending',
            statusColor: 'bg-yellow-100 text-yellow-700'
        },
        {
            id: '6',
            date: '25/06/25-Full day',
            policy: 'Sick leave',
            requestedOn: '25/06/25',
            totalRequested: '1 Days',
            status: 'Pending',
            statusColor: 'bg-yellow-100 text-yellow-700'
        },
        {
            id: '7',
            date: '16/06/25-Full day',
            policy: 'Sick leave',
            requestedOn: '16/06/25',
            totalRequested: '1 Days',
            status: 'Approved',
            statusColor: 'bg-green-100 text-green-700'
        },
        {
            id: '8',
            date: '16/06/25-Full day',
            policy: 'Sick leave',
            requestedOn: '16/06/25',
            totalRequested: '1 Days',
            status: 'Approved',
            statusColor: 'bg-green-100 text-green-700'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-9xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-[#4E53B1]">Time Off Requests</h1>
                    <button className="bg-[#4E53B1] text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors">
                        Request time off
                    </button>
                </div>

                {/* Time Off Policies */}
                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Time Off Policies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {policies.map((policy, index) => (
                            <div
                                key={index}
                                className={`${policy.bgColor} rounded-lg p-4 `}
                            >
                                <div className="text-sm text-gray-600 mb-1">{policy.type}</div>
                                <div className={`text-2xl text-[#4E53B1] font-bold ${policy.textColor}`}>
                                    {policy.days} Days
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Requests History */}
                <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Requests History</h2>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4E53B1] uppercase tracking-wider">
                                            Date of time off
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4E53B1] uppercase tracking-wider">
                                            Policy
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4E53B1] uppercase tracking-wider">
                                            Requested on
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4E53B1] uppercase tracking-wider">
                                            Total requested
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4E53B1] uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4E53B1] uppercase tracking-wider">
                                            Notes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {requests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {request.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {request.policy}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {request.requestedOn}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {request.totalRequested}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-10 text-center py-1 text-xs font-medium rounded-full ${request.statusColor}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button className="text-[#4E53B1] hover:text-indigo-900">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeOffDashboard;