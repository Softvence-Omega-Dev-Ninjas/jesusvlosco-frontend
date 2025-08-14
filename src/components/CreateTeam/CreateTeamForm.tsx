import React, { useEffect, useRef, useState } from "react";
import { useForm, DefaultValues } from "react-hook-form";

export type FormValues = {
  name: string;
  description: string;
  department: "IT" | "DEVELOPMENT" | "HR" | "FINANCE" | "MARKETING" | "SEALS";
  image?: FileList | null;
};

const departmentOptions: FormValues["department"][] = [
  "IT",
  "DEVELOPMENT",
  "HR",
  "FINANCE",
  "MARKETING",
  "SEALS",
];

interface CreateTeamFormProps {
  onSubmit: (data: FormValues) => Promise<void> | void;
  defaultValues?: Partial<FormValues>;
}

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({
  onSubmit,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: defaultValues as DefaultValues<FormValues> | undefined,
    mode: "onTouched",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const internalOnSubmit = async () => {
    // ensure we pass freshest values (including FileList set by setValue)
    const values = getValues();
    console.debug("[CreateTeamForm] submit getValues:", values);
    await onSubmit(values as FormValues);
    reset();
    // clear preview and DOM file input
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedFileName(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.debug("[CreateTeamForm] handleImageChange files:", files);
    // update RHF value and mark dirty/validated so it appears in getValues()
    setValue("image", files as FileList, {
      shouldDirty: true,
      shouldValidate: true,
    });
    const after = getValues();
    console.debug(
      "[CreateTeamForm] after setValue getValues.image:",
      after.image
    );
    if (!files || files.length === 0) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setSelectedFileName(null);
      return;
    }
    const file = files[0];
    // revoke previous preview URL to avoid leaks
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setSelectedFileName(file.name);
    console.debug("[CreateTeamForm] preview url:", url);
  };

  return (
    <form
      onSubmit={handleSubmit(internalOnSubmit)}
      className="space-y-6 min-w-md"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Team Image Preview
        </label>
        {/* Preview */}
        {preview ? (
          <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
            <img
              src={preview}
              alt="Team preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg
                className="w-8 h-8 text-gray-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-gray-400 mt-1">No image</p>
            </div>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Team Name
        </label>
        <input
          type="text"
          placeholder="e.g. Backend Engineers"
          className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
            errors.name ? "border-red-400" : "border-gray-200"
          }`}
          {...register("name", {
            required: "Team name is required",
            minLength: { value: 2, message: "Too short" },
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          placeholder="Brief description about the team"
          className={`w-full border rounded-md px-4 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
            errors.description ? "border-red-400" : "border-gray-200"
          }`}
          {...register("description", {
            required: "Description is required",
            minLength: { value: 10, message: "Write at least 10 characters" },
          })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.department ? "border-red-400" : "border-gray-200"
            }`}
            defaultValue={"IT"}
            {...register("department", { required: "Select a department" })}
          >
            {departmentOptions.map((d) => (
              <option key={d} value={d} className="capitalize">
                {d.replace("_", " ")}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">
              {errors.department.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Image
          </label>
          <div className="flex flex-col items-start gap-4">
            {/* File input button */}
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              <input
                ref={(e) => {
                  fileInputRef.current = e;
                }}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Choose File
            </label>
          </div>
          {selectedFileName && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: {selectedFileName}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            reset();
            setPreview(null);
          }}
          className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium shadow hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Create Team"}
        </button>
      </div>
    </form>
  );
};

export default CreateTeamForm;
