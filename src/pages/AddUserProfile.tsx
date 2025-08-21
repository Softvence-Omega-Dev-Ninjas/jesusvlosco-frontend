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
  useCreateOffdayPayRollMutation,
  useCreateUserEducationMultipleMutation,
  useCreateUserExperienceMutation,
  useCreateUserMutation,
  useCreateUserPayRollMutation,
} from "@/store/api/admin/user/userApi";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const breakTimeOptions = [
  { label: "None", value: "NONE" },
  { label: "Half Hour", value: "HALF_HOUR" },
  { label: "One Hour", value: "ONE_HOUR" },
  { label: "Two Hour", value: "TWO_HOUR" },
  { label: "Three Hour", value: "THREE_HOUR" },
];

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
  const [params] = useSearchParams();
  console.log();
  const [selectedRole, setSelectedRole] = useState<TRole>(
    (params.get("role") as "ADMIN" | "EMPLOYEE") || "EMPLOYEE"
  );
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [createUserPayroll, { isLoading: isPayrollLoading }] =
    useCreateUserPayRollMutation();
  const [userId, setUserId] = useState("");
  console.log({ selectedRole });
  const [
    createuserMultipleEducation,
    { isLoading: isCreateUserEducationLoading },
  ] = useCreateUserEducationMultipleMutation();
  const [createUserExperience, { isLoading: isCreateUserExperienceLoading }] =
    useCreateUserExperienceMutation();

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
    { id: 1, program: "", institution: "", year: 0 },
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
    selectOffDay: "SUNDAY",
    breakTime: "HALF_HOUR",
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
      { id: newId, program: "", institution: "", year: 0 },
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

  const handlePartialSave = async (data: any) => {
    // console.log("Partial save (Payroll Cycle & Time-off):", data);
    const payrollData = {
      regularPayRate: Number(data?.payRateRegular),
      overTimePayRate: Number(data?.payRateOvertime),
      regularPayRateType: data?.payRateRegularPeriod.toUpperCase(),
      overTimePayRateType: data?.payRateOvertimePeriod.toUpperCase(),
      casualLeave: Number(data?.casualLeave?.split(" ")[0]),
      sickLeave: Number(data?.sickLeave?.split(" ")[0]),
    };
    console.log({ payrollData });
    try {
      const result = await createUserPayroll({
        data: payrollData,
        userId,
      }).unwrap();
      console.log({ result });
    } catch (error) {
      console.log({ error });
    }
  };
  const [createOffday, { isLoading: isCreateOffdayLoading }] =
    useCreateOffdayPayRollMutation();
  const handleFinalSave = async (data: any) => {
    const offdayData = {
      numberOffDay: 1,
      offDay: [data?.selectOffDay as string],
      breakTimePerDay: data?.breakTime,
    };
    try {
      const result = await createOffday({
        data: offdayData,
        userId,
      }).unwrap();
      if (result?.success) {
        navigate("/admin/user/user");
      }
      console.log({ result });
    } catch (error) {
      console.log({ error });
    }
    console.log({ offdayData });
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
        role: "EMPLOYEE",
        state: "",
        dob: "",
      });
    }
    if (tabId === "education" || tabId === "all") {
      setEducationList([{ id: 1, program: "", institution: "", year: 0 }]);
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
        selectOffDay: "SUNDAY",
        breakTime: "HALF_HOUR",
      });
    }
  };

  const handlePersonalInfo = async (formData: FormData) => {
    console.log({ formData });
    formData.role = selectedRole;
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
    data: { program: string; year: number; institution: string }[]
  ) => {
    console.log({ data });
    const educations = educationList?.map((el) => {
      return {
        program: el?.program,
        institution: el?.institution,
        year: Number(el?.year),
      };
    });
    console.log({ educations });

    try {
      // return;
      const result = await createuserMultipleEducation({
        educations,
        userId,
      }).unwrap();
      if (result?.success) {
        setActiveTab("experience");
      }
      console.log(result);
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
      console.log({ newData });

      const result = await createUserExperience({
        data,
        userId,
      }).unwrap();
      console.log(result);
      if (result?.success) {
        setActiveTab("payroll");
      }
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
          isLoading={isCreateUserEducationLoading}
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
          isLoading={isCreateUserExperienceLoading}
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
          isLoading={isPayrollLoading}
          isOffdayLoadin={isCreateOffdayLoading}
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
