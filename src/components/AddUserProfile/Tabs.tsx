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
    <div className="w-full mx-auto my-8">
      <nav className="flex flex-col lg:flex-row justify-between lg:space-x-8 gap-4 lg:gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-1 cursor-pointer border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#4E53B1] text-[#4E53B1] font-normal xl:font-semibold text-lg xl:text-xl "
                : "border-transparent text-gray-500 text-base xl:text-lg font-normal hover:text-gray-700 hover:border-gray-300"
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
