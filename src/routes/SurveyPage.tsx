
import { useState } from "react";
import { FileText, Star, Trash2, X } from "lucide-react";

import Modal from "@/components/Servey-poll/Modal";
import DropdownFieldModal from "@/components/Servey-poll/DropdownFieldModal";
import OpenEndedFieldModal from "@/components/Servey-poll/OpenEndedFieldModal";
import RatingFieldModal from "@/components/Servey-poll/RatingFieldModal";
import { useNavigate } from "react-router-dom";

interface DropdownFieldData {
  question: string;
  description: string;
  options: string[];
  required: boolean;
  locationStampCapture: boolean;
  multipleSelection: boolean;
}

interface OpenEndedFieldData {
  question: string;
  description: string;
  placeholder: string;
  required: boolean;
  locationStampCapture: boolean;
}

interface RatingFieldData {
  question: string;
  description: string;
  minLabel: string;
  maxLabel: string;
  scale: number;
  required: boolean;
  locationStampCapture: boolean;
}

export default function SurveyPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const [fields, setFields] = useState<string[]>([]);
  const [tempDescription, setTempDescription] = useState("");
  const [showDescInput, setShowDescInput] = useState(false);

  const [showDropdownModal, setShowDropdownModal] = useState(false);
  const [dropdownFields, setDropdownFields] = useState<DropdownFieldData[]>([]);

  const [showOpenModal, setShowOpenModal] = useState(false);

  const [openEndedFields, setOpenEndedFields] = useState<OpenEndedFieldData[]>([]);


  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingFields, setRatingFields] = useState<RatingFieldData[]>([]);
  const addField = (type: string) => {
    if (type === "description") {
      setShowDescInput(true);
    } else if (type === "dropdown") {
      setShowDropdownModal(true);
    } else if (type === "open") {
      setShowOpenModal(true);
    } else if (type === "rating") {
      setShowRatingModal(true);
    } else {
      setFields((prev) => [...prev, type]);
    }
  };

  const confirmDescription = () => {
    if (tempDescription.trim() !== "") {
      setFields((prev) => [...prev, tempDescription]);
      setTempDescription("");
      setShowDescInput(false);
    }
  };

  const handleSaveDropdown = (data: DropdownFieldData) => {
    setDropdownFields((prev) => [...prev, data]);
  };

  const handleSaveOpenEnded = (data: OpenEndedFieldData) => {
    setOpenEndedFields((prev) => [...prev, data])
    console.log(data);
  };

  const handleSaveRatingField = (data: RatingFieldData) => {
    setRatingFields((prev) => [...prev, data]);

    console.log(data);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };
  const [title, settile] = useState("");
  const [description, setdescription] = useState("");

  const handlePublish = () => {
    const surveyTitle = {
      title: title,
      description: description,
    };
    const combinedQuestions = [
      ...dropdownFields.map((field, index) => ({
        question: field.question,
        description: field.description,
        type: "SELECT",
        order: index + 1,
        isRequired: field.required,
        captureLocation: field.locationStampCapture,
        multiSelect: field.multipleSelection,
        options: field.options,
      })),
      ...openEndedFields.map((field, index) => ({
        question: field.question,
        description: field.description,
        type: "OPEN_ENDED",
        order: dropdownFields.length + index + 1,
        isRequired: field.required,
        captureLocation: field.locationStampCapture,
      })),
      ...ratingFields.map((field, index) => ({
        question: field.question,
        description: field.description,
        type: "RANGE",
        order: dropdownFields.length + openEndedFields.length + index + 1,
        isRequired: field.required,
        captureLocation: field.locationStampCapture,
        rangeStart: 1,
        rangeEnd: field.scale,
      })),
    ];
    // Before navigate
    localStorage.setItem("surveyData", JSON.stringify(combinedQuestions));
    localStorage.setItem("surveyTitle", JSON.stringify(surveyTitle));
    navigate("/admin/publish-survey?flag=survey");
  };

  return (
    <div className="min-h-screen font-inter">
      <div className={`relative z-10 ${showModal ? "blur-[1px] pointer-events-none" : ""}`}>
        <div className="max-w-8xl mx-auto py-8">
          <div className="bg-white border border-gray-300 rounded-md ">
            <div className="border-t-[10px] border-[rgba(78,83,177,1)] rounded-t-md"></div>

            <div className="grid grid-cols-1 max-w-2xl  sm:grid-cols-2 lg:grid-cols-1 gap-4 p-6">
              <div className="flex gap-4">
                <label className="text-lg mt-3 font-medium text-[rgba(78,83,177,1)] min-w-max">Survey Title</label>
                <input
                  onChange={(e) => settile(e.target.value)}

                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 lg:ml-10 text-sm"
                />
              </div>
              <div className="flex gap-4">
                <label className="text-lg mt-3  text-[rgba(78,83,177,1)]">Description</label>
                <input
                  onChange={(e) => setdescription(e.target.value)}
                  className="w-full mt-1 border border-gray-300 lg:ml-10 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 min-h-[600px] sm:min-h-[700px] md:min-h-[700px] lg:min-h-[800px]	 md:grid-cols-4 gap-0 border-gray-300 border-t">
              <div className="bg-gray-50 p-4  border-gray-300 border-r">
                <p className="text-sm text-center font-semibold mt-3 mb-4">Add a field</p>
                <div className="space-y-3  ">
                  <div className="flex gap-2">
                    <button
                      onClick={() => addField("dropdown")}
                      className="flex items-center bg-gray-50 justify-center gap-2 text-sm w-full border border-gray-300 px-3 py-4 rounded-md  hover:bg-gray-100"
                    >
                      <img src="../src/assets/checkbox.png" alt="Edit" className="w-5 h-5  " />
                      Dropdown
                    </button>
                    <button
                      onClick={() => addField("open")}
                      className="flex items-center justify-center gap-2 text-sm w-full border border-gray-300 px-3 py-4 rounded-md bg-gray-50 hover:bg-gray-100"
                    >
                      {/* <Type size={16} />  */}
                      <img src="../src/assets/subject.png" alt="Edit" className="w-5 h-5  " />
                      Open ended
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => addField("rating")}
                      className="flex items-center justify-center gap-2 text-sm w-full border border-gray-300 px-3 py-4 rounded-md bg-gray-50 hover:bg-gray-100"
                    >
                      <Star size={16} /> Rating
                    </button>
                  </div>
                  <h1 className="border-b border-gray-300 mt-6"></h1>

                  {showDescInput && (
                    <div className="mt-4 space-y-2">
                      <textarea
                        placeholder="Write description..."
                        value={tempDescription}
                        onChange={(e) => setTempDescription(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring"
                        rows={3}
                      ></textarea>
                      <button
                        onClick={confirmDescription}
                        className="w-full bg-[rgba(78,83,177,1)] text-white text-sm py-2 rounded-md hover:bg-indigo-700"
                      >
                        Confirm Description
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-3  border-gray-300 bg-gray-50  p-4">
                <div className="flex items-center -mt-4 justify-between p-4   border-b border-gray-300">
                  <h1 className="text-lg font-medium text-gray-900">Survey title</h1>
                  <button onClick={() => setShowModal(true)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* right side filled */}

                {fields.map((field, i) => (
                  <div
                    key={i}
                    className="bg-white mt-4 px-4 py-3 min-h-[60px] rounded-md border border-gray-300 mb-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                      {/* <FileText size={16} className="text-gray-400" /> */}
                      <img src="../src/assets/article.png" alt="Edit" className="w-5 h-5  " />
                      {field}
                    </div>
                    <button onClick={() => removeField(i)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {dropdownFields.map((dropdown, i) => (
                  <div
                    key={`dropdown-${i}`}
                    className="bg-white px-4 py-3 min-h-[60px] rounded-md border border-gray-200 mb-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                      {/* <List size={16} className="text-gray-400" /> */}
                      <img src="../src/assets/checkbox.png" alt="Edit" className="w-5 h-5  " />
                      {dropdown.question}
                    </div>
                    <button
                      onClick={() => setDropdownFields((prev) => prev.filter((_, index) => index !== i))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {openEndedFields.map((open, i) => (
                  <div
                    key={`open-${i}`}
                    className="bg-white px-4 py-3 min-h-[60px] rounded-md border border-gray-200 mb-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                      {/* <Type size={16} className="text-gray-400" /> */}
                      <img src="../src/assets/subject.png" alt="Edit" className="w-5 h-5  " />
                      {open.question}
                    </div>
                    <button
                      onClick={() => setOpenEndedFields((prev) => prev.filter((_, index) => index !== i))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {ratingFields.map((rating, i) => (
                  <div
                    key={`rating-${i}`}
                    className="bg-white px-4 py-3 min-h-[60px] rounded-md border border-gray-200 mb-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                      <Star size={16} className="" />
                      {rating.question}
                    </div>
                    <button
                      onClick={() => setRatingFields((prev) => prev.filter((_, index) => index !== i))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-300 px-6 py-4 bg-gray-50 rounded-b-md">
              <button className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100">Save as template</button>
              <button onClick={handlePublish} className="bg-[rgba(78,83,177,1)] text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                Publish Survey
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Templates tab */}
      <div className="fixed top-160 right-0 h-34 w-10 sm:w-10 md:w-12 lg:w-14 bg-[rgba(78,83,177,1)] text-white text-[20px] font-semibold flex items-center justify-center cursor-pointer rounded-l-md">
        <span className="transform -rotate-90 whitespace-nowrap">Templates</span>
      </div>

      {/* Initial Option Modal */}
      <Modal isOpen={showModal}>
        <h2 className="text-lg font-semibold mb-6 text-center">Choose an Option</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 py-10 bg-[rgba(78,83,177,1)] text-white rounded-lg flex flex-col items-center hover:bg-indigo-700"
          >
            <img src="../src/assets/FrameCreate.png" alt="Edit" className="w-6 h-6 mb-1" />
            Create a new
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 py-10 bg-white text-gray-800 rounded-lg border border-gray-300 flex flex-col items-center hover:bg-gray-100"
          >
            <FileText size={24} className="mb-1" />
            Use a template
          </button>
        </div>
      </Modal>

      {/* Modals */}
      <DropdownFieldModal isOpen={showDropdownModal} onClose={() => setShowDropdownModal(false)} onSave={handleSaveDropdown} />
      <OpenEndedFieldModal isOpen={showOpenModal} onClose={() => setShowOpenModal(false)} onSave={handleSaveOpenEnded} />
      <RatingFieldModal isOpen={showRatingModal} onClose={() => setShowRatingModal(false)} onSave={handleSaveRatingField} />
    </div>
  );
}
