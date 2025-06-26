interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "border-[#4E53B1] text-[#4E53B1]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
