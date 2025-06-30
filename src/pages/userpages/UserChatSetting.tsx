import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SettingItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function UserChatSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: "message-notifications",
      title: "Enable Message Notifications",
      description: "Receive notifications when new messages arrive",
      enabled: true,
    },
    {
      id: "chat-sounds",
      title: "Chat Sounds",
      description: "Play sound when receiving new messages",
      enabled: true,
    },
    {
      id: "vibration",
      title: "Vibration",
      description: "Vibrate device when receiving messages (mobile only)",
      enabled: false,
    },
    {
      id: "message-preview",
      title: "Message Preview",
      description: "Show message content in notification previews",
      enabled: true,
    },
    {
      id: "unread-badge",
      title: "Unread Chat Badge",
      description: "Show red badge with unread message count",
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-primary">Chat Settings</h1>
        </div>

        {/* Settings Container */}
        <div className="rounded-lg border border-gray-200 overflow-hidden p-4">
          {/* Section Header */}
          <div className="">
            <h2 className="text-sm font-medium text-primary">
              Message notification
            </h2>
          </div>

          {/* Settings List */}
          <div className="divide-y divide-gray-200 mt-4 space-y-3">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="px-6 py-4 flex items-center justify-between border border-gray-200 rounded-xl"
              >
                <div className="flex-1">
                  <h3 className=" text-[#484848] mb-1.5">{setting.title}</h3>
                  <p className="text-[#484848]">{setting.description}</p>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleSetting(setting.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    setting.enabled ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      setting.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
