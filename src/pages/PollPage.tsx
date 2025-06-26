import { useState, useEffect } from 'react';
import { Plus, X, Pencil, FileText, Trash2 } from 'lucide-react';

// Define interfaces for your data structures
interface Question {
    id: number;
    text: string;
    options: string[]; // Options are simple strings
}

export default function PollPage() {
    const [pollTitle, setPollTitle] = useState<string>('');
    const [pollDescription, setPollDescription] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            text: '',
            options: ['', '', '', ''] // Initial 4 options
        }
    ]);
    const [showModal, setShowModal] = useState<boolean>(true); // Show modal initially

    // 🆕 Effect to control horizontal scroll
useEffect(() => {
  if (showModal) {
    document.body.style.overflow = 'hidden'; // Disable vertical scrolling
  } else {
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  return () => {
    document.body.style.overflow = '';
  };
}, [showModal]);


    const handleAddOption = (questionIndex: number) => {
        const newQuestions = [...questions];
        if (newQuestions[questionIndex]) {
            newQuestions[questionIndex].options.push('');
            setQuestions(newQuestions);
        }
    };

    const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
        const newQuestions = [...questions];
        if (newQuestions[questionIndex] && newQuestions[questionIndex].options[optionIndex] !== undefined) {
            newQuestions[questionIndex].options[optionIndex] = value;
            setQuestions(newQuestions);
        }
    };

    const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
        const newQuestions = [...questions];
        if (newQuestions[questionIndex]) {
            newQuestions[questionIndex].options.splice(optionIndex, 1);
            setQuestions(newQuestions);
        }
    };

    const handleQuestionTextChange = (questionIndex: number, value: string) => {
        const newQuestions = [...questions];
        if (newQuestions[questionIndex]) {
            newQuestions[questionIndex].text = value;
            setQuestions(newQuestions);
        }
    };

    const handlePublishPoll = () => {
        console.log('Publish Poll clicked', { pollTitle, pollDescription, questions });
    };

    const handleCancelPoll = () => {
        console.log('Cancel Poll clicked');
        setPollTitle('');
        setPollDescription('');
        setQuestions([
            {
                id: 1,
                text: '',
                options: ['', '', '', '']
            }
        ]);
        setShowModal(true);
    };

    const handleCreateNewPoll = () => {
        setShowModal(false);
    };

    const handleUseTemplate = () => {
        console.log('Use a template clicked');
        setShowModal(false);
    };

    const blurClass = showModal ? 'filter blur-sm pointer-events-none' : '';

    return (
        <div className="min-h-screen relative font-inter">
            <div className={`relative z-10 flex flex-col items-center min-h-screen bg-gray-100 ${blurClass} transition-all duration-300`}>
                <div className="flex w-full justify-center relative flex-grow">
                    <div className="flex flex-col lg:flex-row w-full max-w-5xl my-8 mx-4 md:mx-auto gap-6">
                        <div className="flex-grow flex flex-col items-center gap-6">
                            <div className="relative bg-white pt-6 pb-6 px-8 rounded shadow-lg border-t-[20px] border-blue-500 w-full max-w-5xl">
                                <div className="mb-6">
                                    <label htmlFor="pollTitle" className="block text-blue-700 text-sm font-semibold mb-2">Poll Title</label>
                                    <input
                                        type="text"
                                        id="pollTitle"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 transition duration-200"
                                        value={pollTitle}
                                        onChange={(e) => setPollTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="pollDescription" className="block text-blue-700 text-sm font-semibold mb-2">Description</label>
                                    <textarea
                                        id="pollDescription"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 transition duration-200 h-24 resize-none"
                                        value={pollDescription}
                                        onChange={(e) => setPollDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl relative w-full max-w-2xl">
                                <h3 className="text-xl font-semibold text-blue-700 mb-6 pb-4 border-b border-gray-200">Poll details</h3>

                                {questions.map((question, qIndex) => (
                                    <div key={question.id} className="mb-8 last:mb-0">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="block text-blue-700 text-base font-medium">
                                                {qIndex + 1}. Question
                                            </label>
                                            <button className="text-gray-500 hover:text-gray-700 focus:outline-none p-1">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                                            value={question.text}
                                            onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                                            placeholder="Enter your question"
                                        />
                                        <div className="space-y-3">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center space-x-2">
                                                    <input
                                                        type="text"
                                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                        placeholder={`Option ${oIndex + 1}`}
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveOption(qIndex, oIndex)}
                                                        className="p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleAddOption(qIndex)}
                                            className="mt-4 cursor-pointer flex items-center space-x-2 border text-blue-700 hover:text-purple-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg px-3 py-2 transition duration-200"
                                        >
                                            <Plus size={20} />
                                            <span>Add option</span>
                                        </button>
                                    </div>
                                ))}

                                <div className="flex justify-center space-x-4 mt-8">
                                    <button
                                        onClick={handlePublishPoll}
                                        className="px-8 py-3 bg-blue-700 cursor-pointer text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 transform hover:scale-105"
                                    >
                                        Publish
                                    </button>
                                    <button
                                        onClick={handleCancelPoll}
                                        className="px-8 py-3 bg-white text-gray-800 cursor-pointer font-semibold rounded-lg shadow-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 transform hover:scale-105"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fixed right-0  top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-32 bg-blue-700 text-white rounded-l-xl shadow-lg transform -translate-x-0 cursor-pointer z-20">
                    <span className="transform -rotate-90 text-sm font-semibold tracking-wider whitespace-nowrap">Templates</span>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-6 max-w-sm w-full border border-purple-200">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Choose an Option</h4>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center">
                            <button
                                onClick={handleCreateNewPoll}
                                className="flex flex-col items-center justify-center p-6 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 transform hover:scale-105 w-full sm:w-1/2"
                            >
                                <Pencil size={32} className="mb-2" />
                                <span>Create a new</span>
                            </button>
                            <button
                                onClick={handleUseTemplate}
                                className="flex flex-col items-center justify-center p-6 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 transform hover:scale-105 w-full sm:w-1/2"
                            >
                                <FileText size={32} className="mb-2" />
                                <span>Use a template</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
