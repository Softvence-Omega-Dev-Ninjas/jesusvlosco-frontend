import { useAppSelector } from "@/hooks/useRedux";
import { useUpdateProfileMutation } from "@/store/api/auth/authApi";
import { selectUser } from "@/store/Slices/AuthSlice/authSlice";
import { useState } from "react";
import { toast } from "sonner";

export default function UpdateProfileModal() {
  const [openModal, setOpenModal] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [file, setFile] = useState<File | null>();
  const user = useAppSelector(selectUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  console.log({ user });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    console.log("Updated profileUrl:", profileUrl);
    try {
      const formData = new FormData();
      formData.append("profileUrl", file!);
      const result = await updateProfile({ formData, id: user?.id }).unwrap();
      if (result?.success) {
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.message || "Something went wrong");
    }
    // API call or state update here
    setOpenModal(false);
  };

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Update Profile
      </button>

      <div
        onClick={() => setOpenModal(false)}
        className={`fixed z-[100] w-screen ${
          openModal ? "visible opacity-100" : "invisible opacity-0"
        } inset-0 grid place-items-center bg-black/20 backdrop-blur-sm duration-100`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute max-w-md w-full rounded-lg bg-white p-6 drop-shadow-lg ${
            openModal
              ? "opacity-100 duration-300"
              : "scale-110 opacity-0 duration-150"
          }`}
        >
          <svg
            onClick={() => setOpenModal(false)}
            className="absolute right-3 top-3 w-6 cursor-pointer fill-zinc-600"
            viewBox="0 0 24 24"
          >
            <path d="M6.99 7.01a1 1 0 0 0 0 1.41L10.58 12l-3.59 3.59a1 1 0 0 0 1.41 1.41L12 13.41l3.59 3.59a1 1 0 0 0 1.41-1.41L13.41 12l3.59-3.59a1 1 0 0 0-1.41-1.41L12 10.59 8.41 7a1 1 0 0 0-1.42.01z" />
          </svg>

          <h1 className="mb-4 text-xl font-semibold">Update Profile Picture</h1>

          <div className="flex  flex-col items-center gap-3 mb-4">
            {profileUrl ? (
              <img
                src={profileUrl}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border"
              />
            ) : (
              <div className="w-24 border h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm py-3 px-3 border-gray-300 rounded-md border"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="rounded-md bg-emerald-600 px-6 py-[6px] text-white hover:bg-emerald-700"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setOpenModal(false)}
              className="rounded-md border border-rose-600 px-6 py-[6px] text-rose-600 hover:bg-rose-600 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
