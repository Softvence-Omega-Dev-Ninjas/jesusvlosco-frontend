import { ChevronDown, Edit } from "lucide-react";
import { useState } from "react";

interface PayrollData {
  payRateRegular: string;
  payRateOvertime: string;
  payRateRegularPeriod: string;
  payRateOvertimePeriod: string;
  casualLeave: string;
  sickLeave: string;
  numberOfDays: string;
  selectOffDay: string;
  breakTime: string;
}

interface PayrollFormProps {
  payrollData: PayrollData;
  handlePayrollChange: (field: string, value: string) => void;
  payPeriodOptions: string[];
  casualLeaveOptions: string[];
  sickLeaveOptions: string[];
  numberOfDaysOptions: string[];
  offDayOptions: string[];
  breakTimeOptions: { label: string; value: string }[];
  handlePartialSave: (data: PayrollData) => void;
  handleFinalSave: (data: any) => void;
  handleCancel: (tabId: string) => void;
  isLoading: boolean;
  isOffdayLoadin: boolean;
}

const PayrollForm = ({
  payrollData,
  handlePayrollChange,
  payPeriodOptions,
  casualLeaveOptions,
  sickLeaveOptions,
  offDayOptions,
  breakTimeOptions,
  handlePartialSave,
  handleFinalSave,
  isLoading,
  handleCancel,
  isOffdayLoadin,
}: PayrollFormProps) => {
  const [regularPeriodOpen, setRegularPeriodOpen] = useState(false);
  const [overtimePeriodOpen, setOvertimePeriodOpen] = useState(false);
  const [casualLeaveOpen, setCasualLeaveOpen] = useState(false);
  const [sickLeaveOpen, setSickLeaveOpen] = useState(false);
  const [offDayOpen, setOffDayOpen] = useState(false);
  const [breakTimeOpen, setBreakTimeOpen] = useState(false);

  return (
    <div>
      {/* Payroll Cycle & Time-off */}
      <div className="rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Payroll Cycle & Time-off
          </h2>
          <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#4E53B1] text-white rounded-lg  transition-colors">
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-3 px-6 xl:gap-16 gap-8">
          {/* Pay rate */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Pay rate
            </label>

            <div className="mb-4">
              <div className="relative flex  lg:w-94 items-center justify-between gap-2 border border-gray-300 rounded-lg p-2">
                <span className="text-lg font-semibold text-gray-600">
                  Regular :
                </span>
                <div>
                  <input
                    type="text"
                    value={payrollData.payRateRegular}
                    onChange={(e) =>
                      handlePayrollChange("payRateRegular", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border w-24 bg-[#F5F5F5] border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>X per</span>
                  <div className="w-24">
                    <div
                      className="flex items-center justify-between py-2 cursor-pointer"
                      onClick={() => setRegularPeriodOpen(!regularPeriodOpen)}
                    >
                      <div>
                        {payrollData.payRateRegularPeriod.toLowerCase()}
                      </div>
                      <div className="h-5 w-0.5 bg-[#C5C5C5] absolute right-8 top-1/2 transform -translate-y-1/2 font-bold text-[#5B5B5B] pointer-events-none"></div>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 font-bold text-[#5B5B5B] pointer-events-none" />
                    </div>
                    {regularPeriodOpen && (
                      <div className="absolute w-55 top-full right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                        {payPeriodOptions.map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              handlePayrollChange(
                                "payRateRegularPeriod",
                                option
                              );
                              setRegularPeriodOpen(false);
                            }}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                              option === payrollData.payRateRegularPeriod
                                ? "text-blue-600 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {option.toLowerCase()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="relative flex lg:w-94 items-center justify-between gap-2 border border-gray-300 rounded-lg p-2">
                <span className="text-lg font-semibold text-gray-600">
                  Overtime :
                </span>
                <div>
                  <input
                    type="text"
                    value={payrollData.payRateOvertime}
                    onChange={(e) =>
                      handlePayrollChange("payRateOvertime", e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-[#F5F5F5] border w-24 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>X per</span>
                  <div className="w-24">
                    <div
                      className="flex items-center justify-between py-2 cursor-pointer"
                      onClick={() => setOvertimePeriodOpen(!overtimePeriodOpen)}
                    >
                      <div>
                        {payrollData.payRateOvertimePeriod.toLowerCase()}
                      </div>
                      <div className="h-5 w-0.5 bg-[#C5C5C5] absolute right-8 top-1/2 transform -translate-y-1/2 font-bold text-[#5B5B5B] pointer-events-none"></div>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 font-bold text-[#5B5B5B] pointer-events-none" />
                    </div>
                    {overtimePeriodOpen && (
                      <div className="absolute w-55 top-full right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                        {payPeriodOptions.map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              handlePayrollChange(
                                "payRateOvertimePeriod",
                                option
                              );
                              setOvertimePeriodOpen(false);
                            }}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                              option === payrollData.payRateOvertimePeriod
                                ? "text-blue-600 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {option.toLowerCase()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time-off */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Time-off
            </label>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="mb-6">
                <label className="block text-base font-normal text-gray-700 mb-4">
                  Paid leave :
                </label>
                <hr className="border-gray-300 mb-4" />

                <div className="relative mb-4">
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer text-gray-600"
                    onClick={() => setCasualLeaveOpen(!casualLeaveOpen)}
                  >
                    <span>Casual Leave : {payrollData.casualLeave}</span>
                    {/* <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" /> */}
                    <div className="h-5 w-0.5 bg-[#C5C5C5] absolute right-8 top-1/2 transform -translate-y-1/2 font-bold text-[#5B5B5B] pointer-events-none"></div>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 font-bold text-[#5B5B5B] pointer-events-none" />
                  </div>
                  {casualLeaveOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                      {casualLeaveOptions.map((option) => (
                        <div
                          key={option}
                          onClick={() => {
                            handlePayrollChange("casualLeave", option);
                            setCasualLeaveOpen(false);
                          }}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                            option === payrollData.casualLeave
                              ? "text-blue-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer"
                    onClick={() => setSickLeaveOpen(!sickLeaveOpen)}
                  >
                    <span className="text-gray-600">
                      Sick leave : {payrollData.sickLeave}
                    </span>
                    {/* <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" /> */}
                    <div className="h-5 w-0.5 bg-[#C5C5C5] absolute right-8 top-1/2 transform -translate-y-1/2 font-bold text-[#5B5B5B] pointer-events-none"></div>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 font-bold text-[#5B5B5B] pointer-events-none" />
                  </div>
                  {sickLeaveOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                      {sickLeaveOptions.map((option) => (
                        <div
                          key={option}
                          onClick={() => {
                            handlePayrollChange("sickLeave", option);
                            setSickLeaveOpen(false);
                          }}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                            option === payrollData.sickLeave
                              ? "text-blue-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            disabled={isLoading}
            onClick={() => handlePartialSave(payrollData)}
            className="cursor-pointer  disabled:opacity-70 disabled:cursor-not-allowed px-6 py-2 bg-[#4E53B1] text-white rounded-lg  transition-colors"
          >
            {isLoading ? "Saveing..." : "Save"}
          </button>
          <button
            onClick={() => handleCancel("payroll")}
            className="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Offday & Break time */}
      <div className="rounded-2xl border border-gray-200 p-6 mb-6 h-96 flex flex-col">
        <div className="flex justify-between items-center mb-6 ">
          <h2 className="text-lg font-medium text-gray-900">
            Offday & Break time
          </h2>
          <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#4E53B1] text-white rounded-lg  transition-colors">
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:gap-37 gap-6">
          {/* Select off day here */}
          <div className=" w-full lg:w-66 ">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select off day here
            </label>
            <div className="relative">
              <div
                className="flex items-center  justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer font-medium"
                onClick={() => setOffDayOpen(!offDayOpen)}
              >
                <span>{payrollData.selectOffDay}</span>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {offDayOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                  {offDayOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        handlePayrollChange("selectOffDay", option);
                        setOffDayOpen(false);
                      }}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                        option === payrollData.selectOffDay
                          ? "text-blue-600 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Break Time */}
          <div className=" w-full lg:w-66">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Break Time
            </label>
            <div className="relative">
              <div
                className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer"
                onClick={() => setBreakTimeOpen(!breakTimeOpen)}
              >
                <span>{payrollData.breakTime}</span>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {breakTimeOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                  {breakTimeOptions.map((option) => (
                    <div
                      key={option.label}
                      onClick={() => {
                        handlePayrollChange("breakTime", option.value);
                        setBreakTimeOpen(false);
                      }}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                        option.value === payrollData.breakTime
                          ? "text-blue-600 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-auto">
          <button
            disabled={isOffdayLoadin}
            onClick={() => handleFinalSave(payrollData)}
            className="cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed px-6 py-2 bg-[#4E53B1] text-white rounded-lg  transition-colors"
          >
            {isOffdayLoadin ? "Saving" : "Save"}
          </button>
          <button
            onClick={() => handleCancel("payroll")}
            className="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollForm;
