import EducationForm from "@/components/AddUserProfile/EducationForm";
import ExperienceForm from "@/components/AddUserProfile/ExperienceForm";
import Header from "@/components/AddUserProfile/Header";
import PayrollForm from "@/components/AddUserProfile/PayrollForm";
import PersonalInfoForm from "@/components/AddUserProfile/PersonalInfoForm";
import Tabs from "@/components/AddUserProfile/Tabs";
import {
  Education,
  Experience,
  FormData,
  PayrollData,
  Tab,
} from "@/components/AddUserProfile/types";
import { useState } from "react";

const AddUserProfile = () => {
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [selectedRole, setSelectedRole] = useState<string>("Employee");

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailId: "",
    gender: "",
    employeeId: "",
    jobTitle: "",
    department: "",
    address: "",
    city: "",
    state: "",
    dateOfBirth: "",
  });

  const [educationList, setEducationList] = useState<Education[]>([
    { id: 1, program: "", institution: "", year: "" },
  ]);

  const [experienceList, setExperienceList] = useState<Experience[]>([
    {
      id: 1,
      position: "",
      companyName: "",
      jobType: "",
      startDate: "",
      endDate: "",
      isCurrentlyWorking: false,
      description: "",
    },
  ]);

  const [payrollData, setPayrollData] = useState<PayrollData>({
    payRateRegular: "",
    payRateOvertime: "",
    payRateRegularPeriod: "Hour",
    payRateOvertimePeriod: "Hour",
    casualLeave: "Casual leave :",
    sickLeave: "10 days",
    numberOfDays: "Select number here",
    selectOffDay: "Sunday",
    breakTime: "30 min",
  });

  const payPeriodOptions = ["Hour", "Day", "Week", "Month"];
  const casualLeaveOptions = ["5 days", "10 days", "15 days", "20 days"];
  const sickLeaveOptions = ["10 days", "15 days", "20 days", "30 days"];
  const numberOfDaysOptions = ["Select number here", "1", "2", "3"];
  const offDayOptions = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const breakTimeOptions = ["30 min", "1 hour", "3 hour"];
  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
  const jobTitleOptions = [
    "Software Engineer",
    "Product Manager",
    "Designer",
    "Data Analyst",
    "Marketing Specialist",
  ];
  const departmentOptions = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
  ];
  const cityOptions = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
  ];
  const stateOptions = [
    "California",
    "Texas",
    "Florida",
    "New York",
    "Pennsylvania",
    "Illinois",
  ];
  const programOptions = [
    "Bachelor of Science",
    "Bachelor of Arts",
    "Master of Science",
    "Master of Arts",
    "PhD",
    "Associate Degree",
    "Diploma",
    "Certificate",
  ];
  const institutionOptions = [
    "Harvard University",
    "MIT",
    "Stanford University",
    "UC Berkeley",
    "Yale University",
    "Princeton University",
    "Columbia University",
    "Other",
  ];
  const yearOptions = Array.from({ length: 50 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );
  const jobTypeOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Temporary",
  ];

  const tabs: Tab[] = [
    { id: "personal", label: "Personal Information" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience & skills" },
    { id: "payroll", label: "Payroll, Time-off & Break time" },
  ];

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEducationChange = (
    id: number,
    field: keyof Education,
    value: string
  ): void => {
    setEducationList((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const addEducation = (): void => {
    const newId = Math.max(...educationList.map((edu) => edu.id)) + 1;
    setEducationList((prev) => [
      ...prev,
      { id: newId, program: "", institution: "", year: "" },
    ]);
  };

  const handleExperienceChange = (
    id: number,
    field: keyof Experience,
    value: string | boolean
  ): void => {
    setExperienceList((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const addExperience = (): void => {
    const newId = Math.max(...experienceList.map((exp) => exp.id)) + 1;
    setExperienceList((prev) => [
      ...prev,
      {
        id: newId,
        position: "",
        companyName: "",
        jobType: "",
        startDate: "",
        endDate: "",
        isCurrentlyWorking: false,
        description: "",
      },
    ]);
  };

  const handlePayrollChange = (
    field: keyof PayrollData,
    value: string
  ): void => {
    setPayrollData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (data: unknown, tabId: string): void => {
    console.log(`Saving data for ${tabId}:`, data);
    const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handlePartialSave = (data: unknown): void => {
    console.log("Partial save (Payroll Cycle & Time-off):", data);
  };

  const handleFinalSave = (): void => {
    const allData = {
      role: selectedRole,
      personalInfo: formData,
      education: educationList,
      experience: experienceList,
      payroll: payrollData,
    };
    console.log("Final save data:", allData);
    handleCancel("all");
    setActiveTab("personal");
  };

  const handleCancel = (tabId: string): void => {
    if (tabId === "personal" || tabId === "all") {
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        emailId: "",
        gender: "",
        employeeId: "",
        jobTitle: "",
        department: "",
        address: "",
        city: "",
        state: "",
        dateOfBirth: "",
      });
    }
    if (tabId === "education" || tabId === "all") {
      setEducationList([{ id: 1, program: "", institution: "", year: "" }]);
    }
    if (tabId === "experience" || tabId === "all") {
      setExperienceList([
        {
          id: 1,
          position: "",
          companyName: "",
          jobType: "",
          startDate: "",
          endDate: "",
          isCurrentlyWorking: false,
          description: "",
        },
      ]);
    }
    if (tabId === "payroll" || tabId === "all") {
      setPayrollData({
        payRateRegular: "",
        payRateOvertime: "",
        payRateRegularPeriod: "Hour",
        payRateOvertimePeriod: "Hour",
        casualLeave: "Casual leave :",
        sickLeave: "10 days",
        numberOfDays: "Select number here",
        selectOffDay: "Sunday",
        breakTime: "30 min",
      });
    }
  };

  return (
    <div className="mx-auto">
      <Header selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "personal" && (
        <PersonalInfoForm
          formData={formData}
          handleInputChange={(field: string, value: string) =>
            handleInputChange(field as keyof FormData, value)
          }
          genderOptions={genderOptions}
          jobTitleOptions={jobTitleOptions}
          departmentOptions={departmentOptions}
          cityOptions={cityOptions}
          stateOptions={stateOptions}
          setActiveTab={setActiveTab}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      )}
      {activeTab === "education" && (
        <EducationForm
          educationList={educationList}
          handleEducationChange={(id: number, field: string, value: string) =>
            handleEducationChange(id, field as keyof Education, value)
          }
          addEducation={addEducation}
          programOptions={programOptions}
          institutionOptions={institutionOptions}
          yearOptions={yearOptions}
          setActiveTab={setActiveTab}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      )}
      {activeTab === "experience" && (
        <ExperienceForm
          experienceList={experienceList}
          handleExperienceChange={(
            id: number,
            field: string,
            value: string | boolean
          ) => handleExperienceChange(id, field as keyof Experience, value)}
          addExperience={addExperience}
          jobTypeOptions={jobTypeOptions}
          setActiveTab={setActiveTab}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      )}
      {activeTab === "payroll" && (
        <PayrollForm
          payrollData={payrollData}
          handlePayrollChange={(field: string, value: string) =>
            handlePayrollChange(field as keyof PayrollData, value)
          }
          payPeriodOptions={payPeriodOptions}
          casualLeaveOptions={casualLeaveOptions}
          sickLeaveOptions={sickLeaveOptions}
          numberOfDaysOptions={numberOfDaysOptions}
          offDayOptions={offDayOptions}
          breakTimeOptions={breakTimeOptions}
          handlePartialSave={handlePartialSave}
          handleFinalSave={handleFinalSave}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AddUserProfile;
