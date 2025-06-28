import { useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  X,
  FileText,
  ChevronDown,
} from 'lucide-react'

const SelectedSurveyView = ({ onBack }: { onBack: () => void }) => (
  <div className="w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg min-h-[400px] flex flex-col items-center justify-center">
    <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold text-gray-800 mb-6">
      This is an upcoming component
    </h2>
    <button
      onClick={onBack}
      className="px-5 py-2 bg-blue-700 text-white font-medium rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      Back to Templates
    </button>
  </div>
)

const SurveyTemplate = ({
  onBackToPollCreation,
}: {
  onBackToPollCreation: () => void
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const categories: Record<string, string[]> = {
    All: [
      'Employee Health and Well-being',
      'Equipment & Tools',
      'Time Management & Scheduling',
    ],
    'HR & Employee Management': [
      'Team Performance & Job Satisfaction',
      'Employee Engagement & Training and Development',
    ],
    'Safety and Compliance': [
      'Accident and Injury Reporting',
      'Compliance with Regulations',
    ],
    'Project Management': ['Project Progress', 'Client Feedback'],
  }

  return (
    <div className="w-full min-h-screen font-inter bg-[#FAFBFF] px-4 sm:px-6 md:px-8 lg:px-12 py-6">
      {/* heading + search/filter */}
      <div className="w-full mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#4E53B1] mb-4">
          Employee Satisfaction Survey Template
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Poll"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
            <SlidersHorizontal size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* main content */}
      <div className="w-full">
        {selectedItem ? (
          <SelectedSurveyView onBack={() => setSelectedItem(null)} />
        ) : (
          <div className="w-full bg-[#FAFBFF] border border-gray-200 rounded-xl p-4 sm:p-6 md:p-8">
            {/* top tag bar */}
            <div className="flex items-center bg-[] border border-blue-200 rounded-lg px-4 py-2 mb-6 text-blue-700 font-medium text-sm sm:text-base">
              <span>Survey Template</span>
              <button
                onClick={onBackToPollCreation}
                className="ml-auto text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* categories */}
            <div className="space-y-8">
              {Object.entries(categories).map(([cat, items]) => (
                <div key={cat}>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    {cat}
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => setSelectedItem(item)}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-gray-500" />
                          <span className="text-gray-700 text-sm sm:text-base">
                            {item}
                          </span>
                        </div>
                        <ChevronDown
                          size={20}
                          className="text-gray-500 rotate-90"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SurveyTemplate
