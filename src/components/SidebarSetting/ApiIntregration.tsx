import React, { useState } from "react";
import {

  Plus as PlusIcon,
  Check, // Changed from ChevronsRight to ChevronRight for cleaner look
} from "lucide-react";

// Interface for an integration item
interface Integration {
  id: string;
  name: string;
  status: "Connected" | "Disconnected";
  description?: string; // Optional description for disconnected integrations
}

const ApiIntregration: React.FC = () => {
  // State for the automatic synchronization toggle
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);

  // State for integration items
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "1", name: "Gusto", status: "Connected" },
    { id: "2", name: "Quickbooks online", status: "Connected" },
    {
      id: "3",
      name: "Xero(UK)",
      status: "Disconnected",
      description: "Email marketing and newsletter integration.",
    },
    {
      id: "4",
      name: "GitHub",
      status: "Disconnected",
      description: "Connect to your repositories and track issues",
    },
  ]);

  // State for API Key and Webhook URL
  const [apiKey, setApiKey] = useState("********************");
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhook");

  // Function to handle toggle change
  const handleToggleChange = () => {
    setIsSyncEnabled(!isSyncEnabled);
  };

  // Function to handle "Connect" button click for an integration
  const handleConnectIntegration = (id: string) => {
    setIntegrations((prevIntegrations) =>
      prevIntegrations.map((integration) =>
        integration.id === id
          ? { ...integration, status: "Connected", description: undefined }
          : integration
      )
    );
    // In a real app, this would trigger an actual connection process
    console.log(`Attempting to connect to integration with ID: ${id}`);
  };

  // Function to handle saving all settings
  const handleSaveAllSettings = () => {
    console.log("Saving all settings:", {
      isSyncEnabled,
      integrations,
      apiKey,
      webhookUrl,
    });
    // Implement actual save logic (e.g., API call) here
    alert("Settings saved successfully! (Check console for data)");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center  font-sans">
      {/* Main Content Area */}
      <div className=" p-6 rounded-lg shadow-xl w-full  border border-gray-200">
        {/* Integration Setups Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#484848]">
            Integration Setups
          </h1>
          <p className=" text-sm mt-1 text-[#5B5B5B]">
            Connect and manage third-party integrations.
          </p>
        </div>

        {/* Automatic Synchronization Section */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#484848]">
                Automatic Synchronization
              </h2>
              <p className="text-[#5B5B5B] text-sm">
                Automatically sync data between integrated services.
              </p>
            </div>
            {/* Toggle Switch */}
            <label
              htmlFor="sync-toggle"
              className="flex items-center cursor-pointer"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  id="sync-toggle"
                  className="sr-only"
                  checked={isSyncEnabled}
                  onChange={handleToggleChange}
                />
                <div
                  className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
                    isSyncEnabled ? "bg-primary" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
                    isSyncEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </div>

        {/* Available Integrations Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#484848]">
              Available Integrations
            </h2>
            <button className="flex items-center bg-primary text-white py-2 px-4 rounded-md shadow-sm  transition duration-150 ease-in-out ">
              <PlusIcon className="h-4 w-4 mr-1" /> Add new
            </button>
          </div>

          <div className="space-y-3">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
              <div>
                  <div className="flex flex-col md:flex-row md:items-center">
                  <span className="text-[#484848] font-medium mr-2">
                    {integration.name}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      integration.status === "Connected"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {integration.status}
                  </span>
                  
                </div>
                <div>
                  {integration.description && (
                    <p className="text-gray-600 text-sm mt-4 ">
                      {integration.description}
                    </p>
                  )}
                </div>
              </div>
                <button
                  onClick={() => handleConnectIntegration(integration.id)}
                  className={`flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition duration-150 ease-in-out w-32 ${
                    integration.status === "Connected"
                      ? "bg-green-500 text-white  focus:outline-none focus:ring-2  focus:ring-offset-2"
                      : "bg-green-500 text-white focus:outline-none focus:ring-2  focus:ring-offset-2"
                  }`}
                  disabled={integration.status === "Connected"}
                >
                  {integration.status === "Connected" ? (
                    <>
                      <Check className="h-5 w-5 mr-1" />
                      Connected
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-1" />
                      Connect
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API Access Section */}
        <div>
          <h2 className="text-lg font-semibold text-[#484848] mb-4">
            API Access
          </h2>

          {/* API Key Field */}
          <div className="mb-4">
            <label
              htmlFor="api-key"
              className="block text-[#484848] text-sm font-medium mb-1"
            >
              API Key
            </label>
            <input
              type="password"
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full  text-gray-800"
              readOnly // As per image, it seems non-editable directly
            />
            <p className="text-gray-600 text-xs mt-1">
              Your API key is used to authenticate API requests.
            </p>
          </div>

          {/* Webhook URL Field */}
          <div className="mb-6">
            <label
              htmlFor="webhook-url"
              className="block text-[#484848] text-sm font-medium mb-1"
            >
              Webhook URL
            </label>
            <input
              type="text"
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full  text-gray-800"
              placeholder="https://example.com/webhook"
            />
            <p className="text-gray-600 text-xs mt-1">
              The URL where we'll send webhook notifications.
            </p>
          </div>

          {/* Save All Settings Button */}
          <div className="flex justify-start">
            {" "}
            {/* Changed from justify-end to justify-start */}
            <button
              onClick={handleSaveAllSettings}
              className="bg-primary  text-white  py-2 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2  "
            >
              Save all settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiIntregration;
