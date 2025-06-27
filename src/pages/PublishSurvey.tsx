import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    lastLogin: string;
    avatar: string;
}

interface SurveySettings {
    assignBy: 'all' | 'select';
    selectedUsers: string[];
    publishNow: boolean;
    publishDate: string;
    publishTime: string;
    notifyPushUp: boolean;
    notificationText: string;
    showOnFeed: boolean;
    sendReminder: boolean;
    reminderDate: string;
    reminderTime: string;
    showOnFeedAgency: boolean;
}

// Mock Data
const mockUsers: User[] = [
    {
        id: '21369',
        name: 'Cody Fisher',
        email: 'nevaeh.simmons@example.com',
        phone: '(303) 555-0105',
        department: 'Design',
        lastLogin: '2/19/12',
        avatar: 'CF'
    },
    {
        id: '21369',
        name: 'Leslie Alexander',
        email: 'kenzi.lawson@example.com',
        phone: '(907) 555-0101',
        department: 'Medical',
        lastLogin: '4/4/18',
        avatar: 'LA'
    },
    {
        id: '21369',
        name: 'Kristin Watson',
        email: 'georgia.young@example.com',
        phone: '(316) 555-0116',
        department: 'Trainer',
        lastLogin: '7/18/17',
        avatar: 'KW'
    },
    {
        id: '21369',
        name: 'Robert Fox',
        email: 'sara.cruz@example.com',
        phone: '(219) 555-0114',
        department: 'Medical',
        lastLogin: '6/2/19',
        avatar: 'RF'
    },
    {
        id: '21369',
        name: 'Jacob Jones',
        email: 'nathan.roberts@example.com',
        phone: '(201) 555-0124',
        department: 'Medical',
        lastLogin: '1/28/17',
        avatar: 'JJ'
    },
    {
        id: '21369',
        name: 'Theresa Webb',
        email: 'deanna.curtis@example.com',
        phone: '(406) 555-0120',
        department: 'Sales',
        lastLogin: '9/2/15',
        avatar: 'TW'
    },
    {
        id: '21369',
        name: 'Guy Hawkins',
        email: 'bill.sanders@example.com',
        phone: '(629) 555-0129',
        department: 'Marketing',
        lastLogin: '8/30/14',
        avatar: 'GH'
    },
    {
        id: '21369',
        name: 'Kathryn Murphy',
        email: 'debra.holt@example.com',
        phone: '(270) 555-0117',
        department: 'Marketing',
        lastLogin: '8/15/17',
        avatar: 'KM'
    },
    {
        id: '21369',
        name: 'Devon Lane',
        email: 'michelle.rivera@example.com',
        phone: '(704) 555-0127',
        department: 'Medical',
        lastLogin: '5/7/16',
        avatar: 'DL'
    },
    {
        id: '21369',
        name: 'Esther Howard',
        email: 'tanya.hill@example.com',
        phone: '(307) 555-0133',
        department: 'Sales',
        lastLogin: '1/3/14',
        avatar: 'EH'
    }
];

// Progress Steps Component
const ProgressSteps: React.FC<{ currentStep: number; steps: string[] }> = ({ currentStep, steps }) => {
    return (

        <div className="flex items-center bg-white px-14 py-6 justify-center mb-8">
            {['Assign by', 'Recipients', 'Publish settings', 'Summary'].map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col  items-center">
                        <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStep
                                    ? 'bg-[#4E53B1] text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                        />
                        <span
                            className={`mt-2 text-xs ${index === currentStep ? 'text-[#4E53B1] font-medium' : 'text-gray-500'
                                }`}
                        >
                            {step}
                        </span>
                    </div>
                    {index < 3 && (
                        <div
                            className={`w-40  -mt-5 h-0.5 ${index < currentStep ? 'bg-[#4E53B1]' : 'bg-gray-200'
                                }`}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// Assign By Step Component
const AssignByStep: React.FC<{
    assignBy: 'all' | 'select';
    onAssignByChange: (value: 'all' | 'select') => void;
}> = ({ assignBy, onAssignByChange }) => {
    return (
        <div className="max-w-md mx-auto">
            <div className="flex gap-4 justify-center p-20">
                <button
                    onClick={() => onAssignByChange('all')}
                    className={`px-16 py-6 rounded-lg font-medium transition-colors ${assignBy === 'all'
                        ? 'bg-[rgba(78,83,177,1)] text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => onAssignByChange('select')}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors ${assignBy === 'select'
                        ? 'bg-[rgba(78,83,177,1)] text-white min-w-max'
                        : 'bg-white border border-[rgba(78,83,177,1)] text-[rgba(78,83,177,1)] hover:bg-gray-50 min-w-max'
                        }`}
                >
                    Select user
                </button>
            </div>
        </div>
    );
};

// Recipients Step Component
const RecipientsStep: React.FC<{
    users: User[];
    selectedUsers: string[];
    onUserSelectionChange: (userId: string, selected: boolean) => void;
}> = ({ users, selectedUsers, onUserSelectionChange }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAll = (checked: boolean) => {
        filteredUsers.forEach(user => {
            onUserSelectionChange(user.id, checked);
        });
    };

    const isAllSelected = filteredUsers.length > 0 && filteredUsers.every(user => selectedUsers.includes(user.id));

    return (
        <div className="bg-white">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-[rgba(78,83,177,1)] mb-2">Select user from the list</h3>

                <div className="flex gap-4 mb-4">
                    <div className="flex-1  relative">
                        <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search names, roles, department"
                            className="w-full max-w-2xl pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-12 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="rounded border-gray-300 text-[rgba(78,83,177,1)] focus:ring-indigo-500"
                                />
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">ID</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Name</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Email</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Phone</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Department</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Last login</th>
                            <th className="w-12 px-4 py-3">
                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={(e) => onUserSelectionChange(user.id, e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">{user.id}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{user.department}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{user.lastLogin}</td>
                                <td className="px-4 py-3">
                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Publish Settings Step Component
const PublishSettingsStep: React.FC<{
    settings: SurveySettings;
    onSettingsChange: (settings: Partial<SurveySettings>) => void;
}> = ({ settings, onSettingsChange }) => {
    return (
        <div className="max-w-8xl mx-auto space-y-8">
            {/* Publish Options */}
            <div className="space-y-4">
               
               <div className='flex gap-20'>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="publishOption"
                                checked={settings.publishNow}
                                onChange={() => onSettingsChange({ publishNow: true })}
                                className="text-[rgba(78,83,177,1)] focus:ring-indigo-500"
                            />
                            <span className="text-gray-900">Publish now</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="publishOption"
                                checked={!settings.publishNow}
                                onChange={() => onSettingsChange({ publishNow: false })}
                                className="text-[rgba(78,83,177,1)] focus:ring-indigo-500"
                            />
                            <span className="text-gray-900">Select date & time</span>
                        </label>
                    </div>

               </div>
                {!settings.publishNow && (
                    <div className="ml-8 lg:ml-50 flex items-center gap-4">
                        <input
                            type="date"
                            value={settings.publishDate}
                            onChange={(e) => onSettingsChange({ publishDate: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <span className="text-gray-500">At</span>
                        <input
                            type="time"
                            value={settings.publishTime}
                            onChange={(e) => onSettingsChange({ publishTime: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                )}
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
                <label className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        checked={settings.notifyPushUp}
                        onChange={(e) => onSettingsChange({ notifyPushUp: e.target.checked })}
                        className="mt-1 rounded border-gray-300 text-[rgba(78,83,177,1)] focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                        <span className="text-gray-900">Notify employees via push up notification</span>
                        <div className="mt-2">
                            <textarea
                                value={settings.notificationText}
                                onChange={(e) => onSettingsChange({ notificationText: e.target.value })}
                                placeholder="A new update is waiting for you in the XYZ company app"
                                className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                rows={2}
                            />
                        </div>
                    </div>
                </label>
            </div>

            <div className="space-y-4">
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={settings.showOnFeed}
                        onChange={(e) => onSettingsChange({ showOnFeed: e.target.checked })}
                        className="rounded border-gray-300 text-[rgba(78,83,177,1)] focus:ring-indigo-500"
                    />
                    <span className="text-gray-900">Show on feed by XYZ agency</span>
                </label>
            </div>

            {/* Reminder Settings */}
            <div className="space-y-4">
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={settings.sendReminder}
                        onChange={(e) => onSettingsChange({ sendReminder: e.target.checked })}
                        className="rounded border-gray-300 text-[rgba(78,83,177,1)] focus:ring-indigo-500"
                    />
                    <span className="text-gray-900">Send on reminder if user didn't view by</span>
                </label>

                {settings.sendReminder && (
                    <div className="ml-8 flex items-center gap-4">
                        <input
                            type="date"
                            value={settings.reminderDate}
                            onChange={(e) => onSettingsChange({ reminderDate: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <input
                            type="time"
                            value={settings.reminderTime}
                            onChange={(e) => onSettingsChange({ reminderTime: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={settings.showOnFeedAgency}
                        onChange={(e) => onSettingsChange({ showOnFeedAgency: e.target.checked })}
                        className="rounded border-gray-300 text-[rgba(78,83,177,1)] focus:ring-indigo-500"
                    />
                    <span className="text-gray-900">Show on feed by XYZ agency</span>
                </label>
            </div>
        </div>
    );
};

// Summary Step Component
const SummaryStep: React.FC<{
    settings: SurveySettings;
    onConfirm: () => void;
}> = ({ settings, onConfirm }) => {
    const formatDateTime = (date: string, time: string) => {
        if (!date || !time) return '';
        const dateObj = new Date(`${date}T${time}`);
        return dateObj.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-gray-100 rounded-lg p-12 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Survey is Live!</h2>

                <p className="text-gray-600 mb-6">
                    "Your survey is live and ready for participation!"
                </p>

                <div className="space-y-3 text-sm text-gray-600">
                    <p>
                        Asset will be published on{' '}
                        <span className="font-medium">
                            {settings.publishNow
                                ? 'now'
                                : formatDateTime(settings.publishDate, settings.publishTime) || '21/06/2025 at 16:40'
                            }
                        </span>
                    </p>

                    {settings.notifyPushUp && (
                        <div>
                            <p className="font-medium mb-2">User will be notified :</p>
                            <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 max-w-md mx-auto">
                                {settings.notificationText || 'A new update is waiting for you in the XYZ company app'}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end  gap-4 mt-8">
                <button
                    onClick={onConfirm}
                    className="bg-[rgba(78,83,177,1)] text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Confirm survey
                </button>
                <button
                    onClick={onConfirm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

// Main PublishSurvey Component
const PublishSurvey: React.FC = () => {
    const steps = ['Assign by', 'Recipients', 'Publish settings', 'Summary'];
    const [currentStep, setCurrentStep] = useState(0);
    const [settings, setSettings] = useState<SurveySettings>({
        assignBy: 'all',
        selectedUsers: [],
        publishNow: true,
        publishDate: '2025-06-21',
        publishTime: '16:40',
        notifyPushUp: true,
        notificationText: 'A new update is waiting for you in the XYZ company app',
        showOnFeed: false,
        sendReminder: false,
        reminderDate: '2025-06-21',
        reminderTime: '16:40',
        showOnFeedAgency: false
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleCancel = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleAssignByChange = (value: 'all' | 'select') => {
        setSettings(prev => ({ ...prev, assignBy: value }));
    };

    const handleUserSelectionChange = (userId: string, selected: boolean) => {
        setSettings(prev => ({
            ...prev,
            selectedUsers: selected
                ? [...prev.selectedUsers, userId]
                : prev.selectedUsers.filter(id => id !== userId)
        }));
    };

    const handleSettingsChange = (newSettings: Partial<SurveySettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const handleConfirm = () => {
        console.log('Survey confirmed with settings:', settings);
        // Handle survey confirmation logic here
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <AssignByStep
                        assignBy={settings.assignBy}
                        onAssignByChange={handleAssignByChange}
                    />
                );
            case 1:
                return (
                    <RecipientsStep
                        users={mockUsers}
                        selectedUsers={settings.selectedUsers}
                        onUserSelectionChange={handleUserSelectionChange}
                    />
                );
            case 2:
                return (
                    <PublishSettingsStep
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                    />
                );
            case 3:
                return (
                    <SummaryStep
                        settings={settings}
                        onConfirm={handleConfirm}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-8xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-[rgba(78,83,177,1)] mb-2">
                        Create New Survey & Poll
                    </h1>
                    <p className="text-gray-600">
                        Design your survey or poll by adding questions, choosing response types, and setting audience and scheduling options
                    </p>
                </div>

                {/* Progress Steps */}
                <ProgressSteps currentStep={currentStep} steps={steps} />

                {/* Step Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    {renderCurrentStep()}
                </div>

                {/* Navigation Buttons */}
                {currentStep < 3 && (
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleCancel}
                            disabled={currentStep === 0}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleNext}
                            className="bg-[rgba(78,83,177,1)] text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublishSurvey;
