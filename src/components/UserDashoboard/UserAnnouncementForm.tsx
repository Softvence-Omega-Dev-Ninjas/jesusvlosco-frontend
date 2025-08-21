import React, { useState } from "react";
// import CategoryDropdown from "../CompanyUpdate/CategoryDropdown";
// import DateTimePicker from "../CompanyUpdate/dateTimeform";
const UserAnnouncementForm: React.FC = () => {
  // const [publishNow, setPublishNow] = useState(true);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto p-4 sm:p-6 md:p-10 bg-white rounded-md shadow">
      <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-2">Create New announcement</h2>
      <p className="text-sm text-gray-500 mb-6">Fill out the form below to create a new company announcement.</p>

      {/* Title */}
      <label className="block mb-2 text-sm font-medium text-gray-700">Announcement Title*</label>
      <input type="text" placeholder="Enter announcement title here" className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200" />

      {/* Description */}
      <label className="block mb-2 text-sm font-medium text-gray-700">Description*</label>
      <div className="border border-gray-300  rounded-md mb-4">
        <div className="flex gap-2 p-2 border-b border-gray-300  bg-gray-50">
          <button className="text-sm font-medium">B</button>
          <button className="text-sm italic">I</button>
          <button className="text-sm underline">U</button>
          <button className="text-sm">•</button>
          <button className="text-sm">1.</button>
          <button className="text-sm">🔗</button>
        </div>
        <textarea rows={5} className="w-full p-2 text-sm rounded-b-md focus:outline-none" placeholder="Write your announcement..."></textarea>
      </div>

      {/* Category and Audience */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Category*</label>
          {/* <select className="w-full p-2 border border-gray-300  rounded-md text-sm">
            <option>Select category</option>
          </select> */}
          {/* <CategoryDropdown /> */}
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Audience*</label>
          <select className="w-full p-2 border border-gray-300  rounded-md text-sm">
            <option>Select category</option>
          </select>
        </div>
      </div>

      {/* Publish Options */}
      {/* <div className="flex flex-wrap gap-4 mb-4 items-center">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="publish"
            checked={publishNow}
            onChange={() => setPublishNow(true)}
          />
          Publish now
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="publish"
            checked={!publishNow}
            onChange={() => setPublishNow(false)}
          />
          Select date & time
        </label>
        {!publishNow && (
          <input type="datetime-local" className="p-1 border border-gray-300  rounded-md text-sm" />
        )}
      </div> */}

      {/* <DateTimePicker /> */}

      {/* Attachment */}
      <div className="mb-4 p-4 border border-gray-300  rounded-md text-center text-sm text-gray-500 bg-gray-50">
        <input type="file" id="file" className="hidden" onChange={handleFileChange} />
        <label htmlFor="file" className="cursor-pointer flex flex-col items-center justify-center">
          <div className="text-2xl mb-2">📁</div>
          {fileName ? (
            <p>{fileName}</p>
          ) : (
            <>
              <p>Click to upload files or drag and drop</p>
              <p className="text-xs mt-1">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
            </>
          )}
        </label>
      </div>

      {/* Notification Settings */}
      <div className="mb-4 space-y-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Send email notifications to recipients
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Enable read receipt tracking
        </label>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mt-6 justify-end">
        <button className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-50">Preview</button>
        <button className="px-4 py-2 text-white text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Publish
        </button>
        <button className="px-4 py-2 text-sm border border-gray-300  rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
      </div>
    </div>
  );
};

export default UserAnnouncementForm;
