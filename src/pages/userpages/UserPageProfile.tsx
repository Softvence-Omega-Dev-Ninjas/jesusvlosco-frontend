import distance from "../../assets/distance.png";
import calendar from "../../assets/calendar_month (1).png";
import { BiEditAlt } from "react-icons/bi";
import { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGetUserProfileQuery } from "@/store/api/auth/authApi";
import { useUpdateEmployeeMutation } from "@/store/api/admin/user/userApi";
import Swal from "sweetalert2";

const formatDate = (isoDate?: string) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const UserPageProfile = () => {
  const [readOnly, setReadOnly] = useState(true);
  const userInfo = useGetUserProfileQuery({});
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();
  const dobInputRef = useRef<HTMLInputElement>(null);

  // Always call hooks before any conditional return
  const userData = userInfo?.data?.data || {};

  // Define form data type
  type FormData = {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    state: string;
    country: string;
    nationality: string;
    dateOfBirth: string;
  };

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { dirtyFields },
  } = useForm<FormData>({
    defaultValues: {
      firstName: userData?.profile?.firstName || "",
      lastName: userData?.profile?.lastName || "",
      gender: userData?.profile?.gender || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      address: userData?.profile?.address || "",
      state: userData?.profile?.state || "",
      country: userData?.profile?.country || "",
      nationality: userData?.profile?.nationality || "",
      dateOfBirth: formatDate(userData?.profile?.dob) || "",
    },
  });

  // Watch the dateOfBirth field
  const dateOfBirth = watch("dateOfBirth");

  // console.log(userInfo);
  if (userInfo.status === "pending") {
    return <div>Loading...</div>;
  }
  // console.log(userData, "User Data in Profile Page");

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // Create submission data - use form values for dirty fields, userData for unchanged fields
      const submissionData: Record<string, string> = {};

      // For each field, check if it was edited (dirty) or use original userData
      const fieldMapping = {
        firstName: userData?.profile?.firstName || "",
        lastName: userData?.profile?.lastName || "",
        gender: userData?.profile?.gender || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        address: userData?.profile?.address || "",
        state: userData?.profile?.state || "",
        country: userData?.profile?.country || "",
        nationality: userData?.profile?.nationality || "",
        dateOfBirth: formatDate(userData?.profile?.dob) || "",
      };

      // Use edited values if field is dirty, otherwise use original userData values
      Object.keys(fieldMapping).forEach((field) => {
        const fieldKey = field as keyof FormData;
        if (dirtyFields[fieldKey]) {
          // Field was edited, use form value
          submissionData[field] = data[fieldKey];
        } else {
          // Field was not edited, use original userData value
          submissionData[field] = fieldMapping[fieldKey];
        }
      });

      // Convert to FormData
      const formData = new FormData();
      Object.entries(submissionData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // console.log("Submitted data:", submissionData);
      // console.log("Dirty fields:", dirtyFields);

      // Send data to API
      const result = await updateEmployee({ data: formData }).unwrap();

      if (result?.success) {
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#10B981",
        });
      }else{
        Swal.fire({
          title: "Error!",
          text: "Failed to update profile. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#EF4444",
        });
      }
      // console.log("Update result:", result);
      // Refetch user profile data to get updated information
      userInfo.refetch();

      // Show success message
      await // Set back to readonly after saving
      setReadOnly(true);
    } catch (error) {
      console.error("Error updating profile:", error);

      // Show error message
      await Swal.fire({
        title: "Error!",
        text: "Failed to update profile. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleSaveSettings = () => {
    handleSubmit(onSubmit)();
  };

  const handleDobIconClick = () => {
    if (!readOnly) {
      dobInputRef.current?.showPicker();
    }
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("dateOfBirth", e.target.value);
  };
  return (
    <>
      <div className=" mx-auto p-6 min-h-screen mt-4">
        <div className="flex items-center justify-between pb-4 mb-4">
          <h1 className="text-2xl font-semibold text-primary">My Profile</h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between space-x-6 mb-8">
          <div className="flex   items-center gap-6">
            <img
              src={
                userData?.profile?.profileUrl ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(
                    userData?.profile?.firstName +
                      " " +
                      userData?.profile?.lastName
                  )
              }
              alt="User Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {userData?.profile?.firstName +
                  " " +
                  userData?.profile?.lastName || "Leslie Alexander"}
              </h2>
              <p className="text-gray-600">
                {userData?.profile?.jobTitle?.replace(/_/g, " ") ||
                  "Not Available"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setReadOnly(false)}
            className="  bg-primary flex gap-2 items-center text-white py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            <BiEditAlt size={24} />
            Edit
          </button>
        </div>

        {/* Section Title */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            Personal Information
          </h3>
          <hr className="border-b-2 border-primary mb-6" />
        </div>

        {/* Form Grid */}
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm mb-1 text-[#484848]">
              First name
            </label>
            <input
              {...register("firstName")}
              readOnly={readOnly}
              className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#484848]">
              Last name
            </label>
            <input
              {...register("lastName")}
              readOnly={readOnly}
              className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#484848]">Gender</label>
            <input
              {...register("gender")}
              readOnly={readOnly}
              className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2"
            />
          </div>
          {/* ...other fields... */}
          <div>
            <label className="block text-sm mb-1 text-[#484848]">
              Email ID
            </label>
            <input
              {...register("email")}
              readOnly={true}
              className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#484848]">
              Phone Number
            </label>
            <input
              {...register("phone")}
              readOnly={readOnly}
              className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2"
            />
          </div>
          <div className="">
            <label className="block text-sm mb-1 text-[#484848]">Address</label>
            <input
              {...register("address")}
              readOnly={readOnly}
              className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#484848]">State</label>
            <input
              {...register("state")}
              readOnly={readOnly}
              className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#484848]">Country</label>
            <div className="flex justify-between w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2">
              <input
                {...register("country")}
                readOnly={readOnly}
                className="min-w-sm focus:outline-0"
              />
              <img src={distance} alt="" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#484848]">
              Nationality
            </label>
            <input
              {...register("nationality")}
              readOnly={readOnly}
              className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#484848]">
              Date of Birth
            </label>
            <div className="relative w-full">
              <input
                type="text"
                value={dateOfBirth}
                readOnly
                className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2 pr-10"
              />
              <img
                src={calendar}
                alt="calendar icon"
                onClick={handleDobIconClick}
                className={`w-6 h-6 absolute right-3 top-2.5 ${
                  readOnly ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
              />
              <input
                {...register("dateOfBirth", {
                  onChange: handleDobChange,
                })}
                ref={dobInputRef}
                type="date"
                disabled={readOnly}
                className="absolute inset-0 left-16 md:left-[275px] md:right-0 opacity-0 cursor-pointer"
                style={{ pointerEvents: readOnly ? "none" : "auto" }}
              />
            </div>
          </div>
        </form>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isUpdating || readOnly}
            className={`text-white px-5 py-2 rounded-lg cursor-pointer flex items-center gap-2 ${
              isUpdating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isUpdating && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {isUpdating ? "Updating..." : "Save Settings"}
          </button>
        </div>
      </div>
    </>
  );
};

export default UserPageProfile;
