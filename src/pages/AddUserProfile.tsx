import EducationForm from "@/components/AddUserProfile/EducationForm";
import ExperienceForm from "@/components/AddUserProfile/ExperienceForm";
import Header from "@/components/AddUserProfile/Header";
import PayrollForm from "@/components/AddUserProfile/PayrollForm";
import PersonalInfoForm from "@/components/AddUserProfile/PersonalInfoForm";
import Tabs from "@/components/AddUserProfile/Tabs";
import {
  Education,
  Experience,
  type FormData,
  PayrollData,
  Tab,
  TRole,
} from "@/components/AddUserProfile/types";
import {
  useCreateUserEducationMultipleMutation,
  useCreateUserEducationMutation,
  useCreateUserExperienceMutation,
  useCreateUserMutation,
} from "@/store/api/admin/user/userApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const payPeriodOptions = ["Hour", "Day", "Week", "Month"];
const casualLeaveOptions = [
  "3 days",
  "5 days",
  "10 days",
  "15 days",
  "20 days",
];
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
const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
];
const jobTitleOptions = [
  { label: "Back-End Developer", value: "BACK_END_DEVELOPER" },
  { label: "Front-End Developer", value: "FRONT_END_DEVELOPER" },
  { label: "Full Stack Developer", value: "FULL_STACK_DEVELOPER" },
  { label: "Mobile Developer", value: "MOBILE_DEVELOPER" },
  { label: "UI Developer", value: "UI_DEVELOPER" },
  { label: "UX Developer", value: "UX_DEVELOPER" },
  { label: "Seals Engineer", value: "SEALS_ENGINEER" },
  { label: "Data Scientist", value: "DATA_SCIENTIST" },
  { label: "Data Analyst", value: "DATA_ANALYST" },
  { label: "Data Engineer", value: "DATA_ENGINEER" },
  { label: "HR Manager", value: "HR_MANAGER" },
  { label: "Finance Manager", value: "FINANCE_MANAGER" },
  { label: "Marketing Manager", value: "MARKETING_MANAGER" },
];

const departmentOptions = [
  { label: "IT", value: "IT" },
  { label: "Development", value: "DEVELOPMENT" },
  { label: "HR", value: "HR" },
  { label: "Finance", value: "FINANCE" },
  { label: "Marketing", value: "MARKETING" },
  { label: "Seals", value: "SEALS" },
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
const AddUserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [selectedRole, setSelectedRole] = useState<TRole>("EMPLOYEE");
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [userId, setUserId] = useState("");
  const [createUserEducation] = useCreateUserEducationMutation();
  const [createuserMultipleEducation] =
    useCreateUserEducationMultipleMutation();
  const [createUserExperience] = useCreateUserExperienceMutation();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    employeeID: "",
    jobTitle: "",
    department: "",
    address: "",
    city: "",
    role: selectedRole,
    state: "",
    dob: "",
  });

  const [educationList, setEducationList] = useState<Education[]>([
    { id: 1, program: "", institution: "", year: "" as string },
  ]);

  const [experienceList, setExperienceList] = useState<Experience[]>([
    {
      id: 1,
      designation: "",
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
    casualLeave: "10 days",
    sickLeave: "10 days",
    numberOfDays: "Select number here",
    selectOffDay: "Sunday",
    breakTime: "30 min",
  });

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
      { id: newId, program: "", institution: "", year: "" as string },
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
        designation: "",
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
    navigate("/user/user");
  };

  const handleCancel = (tabId: string): void => {
    if (tabId === "personal" || tabId === "all") {
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        gender: "",
        employeeID: "",
        jobTitle: "",
        department: "",
        address: "",
        city: "",
        role: "USER",
        state: "",
        dob: "",
      });
    }
    if (tabId === "education" || tabId === "all") {
      setEducationList([
        { id: 1, program: "", institution: "", year: "" as string },
      ]);
    }
    if (tabId === "experience" || tabId === "all") {
      setExperienceList([
        {
          id: 1,
          designation: "",
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
        casualLeave: "10 days",
        sickLeave: "10 days",
        numberOfDays: "Select number here",
        selectOffDay: "Sunday",
        breakTime: "30 min",
      });
    }
  };

  const handlePersonalInfo = async (formData: FormData) => {
    console.log({ formData });
    const personalFormData = new FormData();
    // formData.role = selectedRole || 'EMPLOYEE';
    for (const key in formData) {
      personalFormData.append(key, formData[key as keyof FormData] as string);
    }

    try {
      const result = await createUser(personalFormData).unwrap();
      console.log({ result });
      if (result?.success) {
        setUserId(result?.data?.id);
        setActiveTab("education");
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.data?.message);
    }
    // console.log({ personalFormData });
  };

  const hanldeEducationInfo = async (
    data: { program: string; year: string | number; institution: string }[]
  ) => {
    try {
      if (educationList?.length === 1) {
        console.log("Single");
        data[0].year = Number(data[0].year);
        console.log(data, userId);
        const result = await createUserEducation({ data: data[0], userId });
        console.log(result);
      } else if (educationList?.length > 1) {
        console.log("Multiple");
        // return;
        const result = await createuserMultipleEducation({ data, userId });
        console.log(result)
      }
      setActiveTab("experience");
    } catch (error) {}
  };

  const handleExperience = async (data: Experience[]) => {
    // console.log({  data,userId });
    
    try {
      const newData = data?.map(({ id, ...rest }) => ({
        ...rest,
        startDate: rest?.startDate.toString(),
    endDate: rest?.endDate.toString(),
      }));
      console.log({newData})

      const result = await createUserExperience({  data, userId: '84588304-daf4-4d79-ba3a-6de4c29f7107' }).unwrap();
      console.log(result);

      setActiveTab("experience");
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <div className=" w-full bg-gray-50 mx-auto">
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
          isLoading={isLoading}
          stateOptions={stateOptions}
          setActiveTab={setActiveTab}
          handleCancel={handleCancel}
          handlePersonalInfo={handlePersonalInfo}
        />
      )}
      {activeTab === "education" && (
        <EducationForm
          educationList={educationList}
          handleEducationChange={(id: number, field: string, value: string) =>
            handleEducationChange(id, field as keyof Education, value)
          }
          hanldeEducationInfo={hanldeEducationInfo}
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
          handleExperience={handleExperience}
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
