import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

export default function PollPage() {
  const [pollTitle, setPollTitle] = useState("");
  const [pollDescription, setPollDescription] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [showModal, setShowModal] = useState(true);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    question: "",
    options: "",
  });
  const [, setTouched] = useState({
    title: false,
    description: false,
    question: false,
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const handleCreateNewPoll = () => setShowModal(false);

  // Validate function
  const validate = () => {
    const newErrors = { title: "", description: "", question: "", options: "" };
    let valid = true;

    if (!pollTitle.trim()) {
      newErrors.title = "Poll title is required.";
      valid = false;
    }

    if (!pollDescription.trim()) {
      newErrors.description = "Description is required.";
      valid = false;
    }

    if (!questionText.trim()) {
      newErrors.question = "Question is required.";
      valid = false;
    }

    const filledOptions = options.filter((opt) => opt.trim() !== "");
    if (isPublishing && filledOptions.length < 2) {
      newErrors.options = "At least 2 options are required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePublishPoll = () => {
    setIsPublishing(true);
    if (!validate()) return;

    const payload = {
      title: pollTitle.trim(),
      description: pollDescription.trim(),
      question: questionText.trim(),
      options: options.filter((opt) => opt.trim() !== ""),
    };

    console.log("Final Payload:", payload);
    navigate("/admin/publish-poll?flag=pool", { state: payload });
  };

  const handleAddOption = () => setOptions([...options, ""]);

  const handleRemoveOption = (oIdx: number) => {
    const newOptions = [...options];
    newOptions.splice(oIdx, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (oIdx: number, value: string) => {
    const newOptions = [...options];
    newOptions[oIdx] = value;
    setOptions(newOptions);
  };

  // Mark fields touched on blur
  const handleBlur = (field: "title" | "description" | "question") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    // Validate only touched fields (except options, only on publish)
    const newErrors = { ...errors };

    if (field === "title" && !pollTitle.trim()) newErrors.title = "Poll title is required.";
    else if (field === "title") newErrors.title = "";

    if (field === "description" && !pollDescription.trim()) newErrors.description = "Description is required.";
    else if (field === "description") newErrors.description = "";

    if (field === "question" && !questionText.trim()) newErrors.question = "Question is required.";
    else if (field === "question") newErrors.question = "";

    setErrors(newErrors);
  };

  const blurClass = showModal ? "filter blur-sm pointer-events-none" : "";

  return (
    <div className="min-h-screen relative font-inter overflow-x-hidden">
      {/* Rotated Templates Label */}
      <div className="fixed top-1/2 right-0 -translate-y-1/2 z-50">
        <div className="bg-[#4E53B1] text-white px-5 py-3 rounded-md shadow transform -rotate-90 origin-bottom-right">Templates</div>
      </div>

      {/* Main content */}
      <div
        className={`relative z-10 flex flex-col items-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-12 ${blurClass} transition-all duration-300`}
      >
        <div className="flex w-full justify-center relative flex-grow">
          <div className="flex flex-col lg:flex-row w-full my-8 mx-4 md:mx-auto gap-6">
            <div className="flex-grow flex flex-col items-center gap-6">
              {/* Poll Title Section */}
              <div className="relative bg-white pt-6 pb-6 px-8 rounded-2xl border-t-[20px] border-[#4E53B1] w-full">
                <div className="mb-6">
                  <label className="block text-[#4E53B1] text-sm font-semibold mb-2">Poll Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
                    value={pollTitle}
                    onChange={(e) => setPollTitle(e.target.value)}
                    onBlur={() => handleBlur("title")}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-[#4E53B1] text-sm font-semibold mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-200 h-24 resize-none"
                    value={pollDescription}
                    onChange={(e) => setPollDescription(e.target.value)}
                    onBlur={() => handleBlur("description")}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>

              {/* Poll Details Section */}
              <div className="p-8 border border-[#C5C5C5] rounded-xl bg-[#FAFBFF]">
                <div className="bg-[#FAFBFF] border border-[#C5C5C5] p-6 rounded-xl w-full max-w-3xl mx-auto">
                  <h3 className="text-xl font-semibold text-[#4E53B1] mb-6 pb-4 border-b border-[#C5C5C5]">Poll details</h3>

                  <div className="mb-8">
                    <label className="block text-[#4E53B1] text-base font-medium mb-4">Question</label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 mb-2 border border-gray-300 rounded-lg"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      onBlur={() => handleBlur("question")}
                      placeholder="Enter your question"
                    />
                    {errors.question && <p className="text-red-500 text-sm mb-4">{errors.question}</p>}

                    {/* Options */}
                    <div className="space-y-3">
                      {options.map((opt, oIdx) => (
                        <div key={oIdx} className="relative w-full">
                          <input
                            type="text"
                            className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
                            value={opt}
                            onChange={(e) => handleOptionChange(oIdx, e.target.value)}
                            placeholder={`Option ${oIdx + 1}`}
                          />
                          {options.length > 2 && (
                            <button
                              onClick={() => handleRemoveOption(oIdx)}
                              className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-gray-800"
                              type="button"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {errors.options && <p className="text-red-500 text-sm mt-2">{errors.options}</p>}

                    <button
                      onClick={handleAddOption}
                      className="mt-4 flex items-center space-x-2 text-[#4E53B1] border border-[#4E53B1] px-3 py-2 font-bold rounded hover:bg-[#4E53B1] hover:text-white transition"
                      type="button"
                    >
                      <Plus size={20} />
                      <span>Add option</span>
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row justify-end items-center gap-4 mt-8">
                    <button
                      onClick={handlePublishPoll}
                      className="cursor-pointer rounded md:w-80 px-6 py-3 bg-[#4E53B1] text-white font-semibold"
                      type="button"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-[2px]">
          <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-6 max-w-sm w-full border border-purple-200">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center">
              <button
                onClick={handleCreateNewPoll}
                className="flex flex-row gap-2 cursor-pointer items-center justify-center p-6 bg-[#4E53B1] hover:bg-[#474ed3] text-white font-semibold rounded-lg w-full"
                type="button"
              >
                <FaEdit size={20} />
                <span>Create a new</span>
              </button>
              {/* <button
                onClick={handleUseTemplate}
                className="flex flex-col items-center justify-center p-6 bg-white text-gray-800 font-semibold rounded-lg border w-full sm:w-1/2"
                type="button"
              >
                <FileText size={32} className="mb-2" />
                <span>Use a template</span>
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
