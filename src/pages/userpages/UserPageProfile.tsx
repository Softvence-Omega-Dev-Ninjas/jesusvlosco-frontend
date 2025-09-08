/* eslint-disable react-hooks/exhaustive-deps */
import distance from "../../assets/distance.png";
import { BiEditAlt } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGetUserProfileQuery } from "@/store/api/auth/authApi";
import { useUpdateEmployeeMutation } from "@/store/api/admin/user/userApi";
import Swal from "sweetalert2";
import { customList } from "country-codes-list";

// Generate array of all country codes
const countryCodes = Object.values(customList("countryCode", "{countryCode} | {countryNameEn} | +{countryCallingCode}")).map((item: string) => {
  const [code, name, dialCode] = item.split(" | ");
  return { code, name, dialCode: dialCode.replace("+", "") };
});

// Format ISO date into yyyy-mm-dd
const formatDate = (isoDate?: string) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0]; // yyyy-MM-dd
};

// Parse phone number for initial values
const parsePhoneNumber = (fullPhone?: string) => {
  if (!fullPhone) return { countryCode: "US", dialCode: "1", phone: "" };
  for (const country of countryCodes) {
    if (fullPhone.startsWith(country.dialCode)) {
      return {
        countryCode: country.code,
        dialCode: country.dialCode,
        phone: fullPhone.substring(country.dialCode.length),
      };
    }
  }
  return { countryCode: "US", dialCode: "1", phone: fullPhone };
};

const departmentOptions = [
  { label: "IT", value: "IT" },
  { label: "Development", value: "DEVELOPMENT" },
  { label: "HR", value: "HR" },
  { label: "Finance", value: "FINANCE" },
  { label: "Marketing", value: "MARKETING" },
  { label: "Seals", value: "SEALS" },
  { label: "Labourer", value: "LABOURER" },
  { label: "Carpenter", value: "CARPENTER" },
  { label: "Electrician", value: "ELECTRICIAN" },
  { label: "Driver", value: "DRIVER" },
];

const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
];

const UserPageProfile = () => {
  const [readOnly, setReadOnly] = useState(true);

  const userInfo = useGetUserProfileQuery({});
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

  const userData = userInfo?.data?.data || {};
  const parsedPhone = parsePhoneNumber(userData?.phone);

  type FormData = {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    phone: string;
    countryCode: string;
    dialCode: string;
    address: string;
    state: string;
    country: string;
    nationality: string;
    dob: string;
    jobTitle: string;
    department: string;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { dirtyFields },
  } = useForm<FormData>();

  const currentCountryCode = watch("countryCode");
  const currentDialCode = watch("dialCode");

  // Reset form when profile data changes
  useEffect(() => {
    if (userData?.profile && userData?.id) {
      reset({
        firstName: userData.profile.firstName || "",
        lastName: userData.profile.lastName || "",
        gender: userData.profile.gender || "",
        email: userData.email || "",
        phone: parsedPhone.phone,
        countryCode: parsedPhone.countryCode,
        dialCode: parsedPhone.dialCode,
        address: userData.profile.address || "",
        state: userData.profile.state || "",
        country: userData.profile.country || "",
        nationality: userData.profile.nationality || "",
        dob: userData.profile.dob ? formatDate(userData.profile.dob) : "",
        jobTitle: userData.profile.jobTitle || "",
        department: userData.profile.department || "",
      });
    }
  }, [userData?.id, reset]);

  // Update dial code when country changes
  useEffect(() => {
    const selectedCountry = countryCodes.find((c) => c.code === currentCountryCode);
    if (selectedCountry && currentDialCode !== selectedCountry.dialCode) {
      setValue("dialCode", selectedCountry.dialCode, { shouldDirty: true });
    }
  }, [currentCountryCode, currentDialCode, setValue]);

  if (userInfo.status === "pending") return <div>Loading...</div>;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const submissionData: Record<string, string> = {};

      const fullPhoneNumber = `${data.dialCode}${data.phone}`;
      const parsedOriginalPhone = parsePhoneNumber(userData?.phone);

      const fieldMapping = {
        firstName: userData?.profile?.firstName || "",
        lastName: userData?.profile?.lastName || "",
        gender: userData?.profile?.gender || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        countryCode: parsedOriginalPhone.countryCode,
        dialCode: parsedOriginalPhone.dialCode,
        address: userData?.profile?.address || "",
        state: userData?.profile?.state || "",
        country: userData?.profile?.country || "",
        nationality: userData?.profile?.nationality || "",
        dob: formatDate(userData?.profile?.dob) || "",
        jobTitle: userData?.profile?.jobTitle || "",
        department: userData?.profile?.department || "",
      };

      Object.keys(fieldMapping).forEach((field) => {
        const key = field as keyof FormData;
        if (field === "phone") {
          submissionData[field] = dirtyFields.phone || dirtyFields.countryCode || dirtyFields.dialCode ? fullPhoneNumber : fieldMapping[key];
        } else if (field === "dob") {
          submissionData[field] = data.dob ? new Date(data.dob).toISOString() : "";
        } else {
          submissionData[field] = dirtyFields[key] ? data[key] : fieldMapping[key];
        }
      });

      const formData = new FormData();
      Object.entries(submissionData).forEach(([key, value]) => formData.append(key, value));

      const result = await updateEmployee({ data: formData }).unwrap();

      if (result?.success) {
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#10B981",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to update profile. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#EF4444",
        });
      }

      userInfo.refetch();
      setReadOnly(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update profile. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  return (
    <div className="mx-auto p-6 min-h-screen mt-4">
      <div className="flex items-center justify-between pb-4 mb-4">
        <h1 className="text-2xl font-semibold text-primary">My Profile</h1>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between space-x-6 mb-8">
        <div className="flex items-center gap-6">
          <img
            src={
              userData?.profile?.profileUrl ||
              "https://ui-avatars.com/api/?name=" + encodeURIComponent(userData?.profile?.firstName + " " + userData?.profile?.lastName)
            }
            alt="User Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {userData?.profile?.firstName + " " + userData?.profile?.lastName || "Leslie Alexander"}
            </h2>
            <p className="text-gray-600">{userData?.profile?.jobTitle?.replace(/_/g, " ") || "Not Available"}</p>
          </div>
        </div>
        <button
          onClick={() => setReadOnly(false)}
          className="bg-primary flex gap-2 items-center text-white py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          <BiEditAlt size={24} />
          Edit
        </button>
      </div>

      {/* Section Title */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-2">Personal Information</h3>
        <hr className="border-b-2 border-primary mb-6" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* First & Last Name */}
        <div>
          <label className="block text-sm mb-1 text-[#484848]">First name</label>
          <input {...register("firstName")} readOnly={readOnly} className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Last name</label>
          <input {...register("lastName")} readOnly={readOnly} className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Gender</label>
          <select {...register("gender")} disabled={readOnly} className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2 bg-white">
            <option value="">Select Gender</option>
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Email ID</label>
          <input {...register("email")} readOnly className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Phone Number</label>
          <div className="flex items-center border-2 border-gray-200 rounded-lg">
            <select
              {...register("countryCode")}
              disabled={readOnly}
              className="bg-white outline-none pl-3 pr-1 py-2 min-w-fit border-r border-gray-300 text-gray-500"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code}
                </option>
              ))}
            </select>
            <span className="text-gray-500 px-2 whitespace-nowrap">{currentDialCode}</span>
            <input
              {...register("phone")}
              readOnly={readOnly}
              className="flex-1 min-w-0 outline-none py-2 pr-3 text-gray-500"
              placeholder="e.g., 4454545"
            />
          </div>
        </div>

        {/* Address, State, Country, Nationality */}
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Address</label>
          <input {...register("address")} readOnly={readOnly} className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">State</label>
          <input {...register("state")} readOnly={readOnly} className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Country</label>
          <div className="flex justify-between w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2">
            <input {...register("country")} readOnly={readOnly} className="min-w-sm focus:outline-0" />
            <img src={distance} alt="" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Nationality</label>
          <input {...register("nationality")} readOnly={readOnly} className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of birth</label>
          <input
            type="date"
            {...register("dob")}
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
          <input
            {...register("jobTitle")}
            readOnly={readOnly}
            placeholder="Enter job title here"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select {...register("department")} disabled={readOnly} className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2 bg-white">
            <option value="">Select Department</option>
            {departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </form>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isUpdating || readOnly}
          className={`text-white px-5 py-2 rounded-lg flex items-center gap-2 ${
            isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
          }`}
        >
          {isUpdating && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          {isUpdating ? "Updating..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default UserPageProfile;
