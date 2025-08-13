import { useState } from "react";

export default function TimeSheet() {
  const [selectedProjects, setSelectedProjects] = useState<{
    [key: string]: string;
  }>({});

  const handleProjectSelect = (rowId: string, project: string) => {
    setSelectedProjects((prev) => ({
      ...prev,
      [rowId]: project,
    }));
  };

  return (
    <div className="px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src="https://i.pravatar.cc"
                alt="Robert Fox"
                className="rounded-full size-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">
                Robert Fox
              </h1>
              <div className="w-5 h-5 flex items-center justify-center">
                <img src={""} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#484848] font-semibold">
            <span>Pay Period:</span>
            <button className="flex items-center gap-1">
              <span>{"<"}</span>
              <span>01/06 to 30/06</span>
              <span>{">"}</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button className="px-6 py-2 bg-[#1EBD66] text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
            Submit timesheet
          </button>
          <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Export
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-4 lg:gap-6 mb-8 items-center">
        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">
            183.75
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Regular</div>
        </div>
        <div className="text-base lg:text-lg font-medium text-gray-900">+</div>
        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">11</div>
          <div className="text-xs lg:text-sm text-gray-600">1.5 X Overtime</div>
        </div>
        <div className="text-base lg:text-lg font-medium text-gray-900">+</div>
        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">8</div>
          <div className="text-xs lg:text-sm text-gray-600">Paid time off</div>
        </div>
        <div className="text-base lg:text-lg font-medium text-gray-900">=</div>
        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">
            202.75
          </div>
          <div className="text-xs lg:text-sm text-gray-600">
            Total Paid Hours
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">0</div>
          <div className="text-xs lg:text-sm text-gray-600">
            Unpaid time off
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">
            2340,58 US$
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Pay per dates</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Project
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Start
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    End
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Total Hours
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden md:table-cell">
                    Daily Total
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden lg:table-cell">
                    Weekly Total
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden lg:table-cell">
                    Regular
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden lg:table-cell">
                    OvertimeX1.5
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Jun 30 Section */}
                <tr>
                  <td
                    colSpan={10}
                    className="bg-primary text-white text-center py-3 font-medium"
                  >
                    Jun 30
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Mon 30/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["mon30-1"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("mon30-1", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    1:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    5 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Mon 30/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["mon30-2"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("mon30-2", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    2:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    4 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell"></td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell"></td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell"></td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell"></td>
                  <td className="py-3 px-2 sm:px-4"></td>
                </tr>

                {/* Jun 23-Jun 29 Section */}
                <tr>
                  <td
                    colSpan={10}
                    className="bg-primary text-white text-center py-3 font-medium"
                  >
                    Jun 23-Jun 29
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Sun 29/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["sun29"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("sun29", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Sat 28/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["sat28"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("sat28", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Fri 27/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["fri27"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("fri27", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Fri 27/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["fri27"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("fri27", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Fri 27/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["fri27"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("fri27", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Fri 27/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["fri27"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("fri27", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Fri 27/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["fri27"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("fri27", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>

                {/* Jun 16-Jun 22 Section */}
                <tr>
                  <td
                    colSpan={10}
                    className="bg-primary text-white text-center py-3 font-medium"
                  >
                    Jun 16-Jun 22
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Sun 29/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["sun29"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("sun29", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Sat 28/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["sat28"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("sat28", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Fri 27/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["fri27"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("fri27", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Fri 27/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["fri27"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("fri27", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Fri 27/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["fri27"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("fri27", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Fri 27/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["fri27"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("fri27", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                    Fri 27/6
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      className="border border-gray-300 rounded-full px-2 sm:px-4 py-2 text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm"
                      value={selectedProjects["fri27"] || ""}
                      onChange={(e) =>
                        handleProjectSelect("fri27", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    8:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    6:00 AM
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                    10 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                    9 Hours
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                    --
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button className="text-primary hover:text-indigo-800 text-sm">
                      View Notes
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
