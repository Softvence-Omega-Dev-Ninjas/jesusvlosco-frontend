import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Users, 
  BarChart3, 
  CheckSquare, 
  Calendar,
  MessageCircle,
  Bell,
  
} from 'lucide-react';

interface ToggleState {
  email: boolean;
  communication: boolean;
  users: boolean;
  surveyPoll: boolean;
  tasksProjects: boolean;
  scheduling: boolean;
  message: boolean;
  userRegistration: boolean;
}

const Notification: React.FC = () => {
  const [settings, setSettings] = useState<ToggleState>({
    email: true,
    communication: true,
    users: true,
    surveyPoll: true,
    tasksProjects: true,
    scheduling: true,
    message: true,
    userRegistration: true,
  });

  const handleToggle = (key: keyof ToggleState) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const Toggle: React.FC<{ isOn: boolean; onToggle: () => void }> = ({ isOn, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        isOn ? 'bg-primary' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isOn ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const SettingItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isOn: boolean;
    onToggle: () => void;
  }> = ({ icon, label, isOn, onToggle }) => (
    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="text-gray-500">
          {icon}
        </div>
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      <Toggle isOn={isOn} onToggle={onToggle} />
    </div>
  );

  return (
    <div className=" mx-auto  space-y-6">
      {/* Main Notification Settings */}
      <div className="rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-primary">Notification Settings</h2>
        </div>
        
        <div className="divide-y divide-gray-500">
          <SettingItem
          
            icon={<Mail size={20} />}
            label="Email"
            isOn={settings.email}
            onToggle={() => handleToggle('email')}
          />
          
          <SettingItem
            icon={<MessageSquare size={20} />}
            label="Communication"
            isOn={settings.communication}
            onToggle={() => handleToggle('communication')}
          />
          
          <SettingItem
            icon={<Users size={20} />}
            label="Users"
            isOn={settings.users}
            onToggle={() => handleToggle('users')}
          />
          
          <SettingItem
            icon={<BarChart3 size={20} />}
            label="Survey & Poll"
            isOn={settings.surveyPoll}
            onToggle={() => handleToggle('surveyPoll')}
          />
          
          <SettingItem
            icon={<CheckSquare size={20} />}
            label="Tasks & Projects"
            isOn={settings.tasksProjects}
            onToggle={() => handleToggle('tasksProjects')}
          />
          
          <SettingItem
            icon={<Calendar size={20} />}
            label="Scheduling"
            isOn={settings.scheduling}
            onToggle={() => handleToggle('scheduling')}
          />
          
          <SettingItem
            icon={<MessageCircle size={20} />}
            label="Message"
            isOn={settings.message}
            onToggle={() => handleToggle('message')}
          />
        </div>
      </div>

      {/* User Registration */}
      <div className=" rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-800">User Registration</h2>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Mail size={20} className="text-gray-500" />
                  <span className="text-gray-700 font-medium">Email</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">In-App</span>
                </div>
              </div>
            </div>
            <Toggle 
              isOn={settings.userRegistration} 
              onToggle={() => handleToggle('userRegistration')} 
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-primary text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none ">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Notification;