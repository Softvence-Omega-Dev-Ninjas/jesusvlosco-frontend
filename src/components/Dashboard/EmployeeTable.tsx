import React from "react";
import { Avatar } from "./Avatar";
import { Employee } from "./dashboard";

export const EmployeeTable: React.FC<{ employees: Employee[] }> = ({
  employees,
}) => {
  const shouldScroll = employees.length > 5;

  return (
    <div className="rounded-2xl overflow-hidden w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4">
        <h2 className="text-2xl font-bold text-[#4E53B1]">Assigned Employee</h2>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border border-gray-200 p-5 rounded-2xl">
        <div
          className={`divide-y divide-gray-300 ${
            shouldScroll ? "max-h-[400px] overflow-y-auto" : ""
          }`}
        >
          <div className="px-5 mr-2.5 py-4 grid grid-cols-4 border border-primary rounded-2xl gap-4 text-lg font-medium text-[#4E53B1]">
            <div>Employee</div>
            <div>Project Name</div>
            <div>Shift</div>
            <div>Date</div>
          </div>
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="px-6 py-4 grid grid-cols-4 gap-4 items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  initials={employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                  imageUrl={employee.avatar}
                  size="lg"
                  className="flex-shrink-0 h-10 w-10"
                />
                <div>
                  <div className="text-[#4E53B1] text-base font-semibold">
                    {employee.name}
                  </div>
                  <div className="text-sm font-medium text-[#949494]">
                    {employee.role}
                  </div>
                </div>
              </div>

              <div className="text-base font-normal text-[#484848]">
                {employee.project}
              </div>

              <div>
                <div className="text-base font-normal text-[#484848]">
                  {employee.shift}
                </div>
                <div className="text-sm font-normal text-gray-500 mt-1">
                  {employee.time}
                </div>
              </div>

              <div className="text-base font-normal text-gray-900">
                {employee.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                initials={employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
                imageUrl={employee.avatar}
                size="lg"
              />
              <div className="flex-1">
                <div className="font-medium text-primary text-sm">
                  {employee.name}
                </div>
                <div className="text-xs text-gray-500">{employee.role}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-normal text-[#484848]">
                  {employee.shift}
                </div>
              </div>
            </div>

            <div className="space-y-2 ml-13">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Project:</span>
                <span className="text-xs text-gray-900">
                  {employee.project}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Time:</span>
                <span className="text-xs text-gray-600">{employee.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Date:</span>
                <span className="text-xs text-gray-900">{employee.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
