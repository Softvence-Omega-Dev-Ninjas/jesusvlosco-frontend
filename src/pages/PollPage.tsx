import { useState, useEffect } from 'react';
import { Plus, X, Pencil, FileText, Trash2 } from 'lucide-react';
import ServeyTemplate from './PollComponents/ServeyTemplate';

// Define interfaces for your data structures
interface Question {
    id: number;
    text: string;
    options: string[];
}

export default function PollPage() {
    const [pollTitle, setPollTitle] = useState('');
    const [pollDescription, setPollDescription] = useState('');
    const [questions, setQuestions] = useState<Question[]>([
        { id: 1, text: '', options: ['', '', '', ''] }
    ]);
    const [showModal, setShowModal] = useState(true);
    const [showTemplateSection, setShowTemplateSection] = useState(false);

    // Lock scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModal]);

    const handleCreateNewPoll = () => {
        setShowModal(false);
        setShowTemplateSection(false);
    };

    const handleUseTemplate = () => {
        setShowModal(false);
        setShowTemplateSection(true);
    };

    const handlePublishPoll = () => {
        console.log('Publish Poll clicked', { pollTitle, pollDescription, questions });
    };

    const handleCancelPoll = () => {
        setPollTitle('');
        setPollDescription('');
        setQuestions([{ id: 1, text: '', options: ['', '', '', ''] }]);
        setShowModal(true);
        setShowTemplateSection(false);
    };

    const handleAddOption = (qIdx: number) => {
        const newQuestions = [...questions];
        newQuestions[qIdx].options.push('');
        setQuestions(newQuestions);
    };

    const handleRemoveOption = (qIdx: number, oIdx: number) => {
        const newQuestions = [...questions];
        newQuestions[qIdx].options.splice(oIdx, 1);
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIdx].options[oIdx] = value;
        setQuestions(newQuestions);
    };

    const handleQuestionTextChange = (qIdx: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIdx].text = value;
        setQuestions(newQuestions);
    };

    const blurClass = showModal ? 'filter blur-sm pointer-events-none' : '';

    return (
        <div className="min-h-screen relative font-inter">
            {/* Main content (either Poll Form or Template Section) */}
            <div className={`relative z-10 flex flex-col items-center min-h-screen bg-gray-100 ${blurClass} transition-all duration-300`}>
                {!showTemplateSection ? (
                    // ========== Poll Form ==========
                    <div className="flex w-full justify-center relative flex-grow">
                        <div className="flex flex-col lg:flex-row w-full  my-8 mx-4 md:mx-auto gap-6">
                            <div className="flex-grow flex flex-col items-center gap-6">
                                <div className="relative bg-white pt-6 pb-6 px-8 rounded shadow-lg border-t-[20px] border-blue-500 w-full max-w-5xl">
                                    <div className="mb-6">
                                        <label className="block text-blue-700 text-sm font-semibold mb-2">Poll Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 transition duration-200"
                                            value={pollTitle}
                                            onChange={(e) => setPollTitle(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-blue-700 text-sm font-semibold mb-2">Description</label>
                                        <textarea
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 transition duration-200 h-24 resize-none"
                                            value={pollDescription}
                                            onChange={(e) => setPollDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl relative w-full max-w-2xl">
                                    <h3 className="text-xl font-semibold text-blue-700 mb-6 pb-4 border-b border-gray-200">Poll details</h3>

                                    {questions.map((q, qIdx) => (
                                        <div key={q.id} className="mb-8 last:mb-0">
                                            <div className="flex justify-between items-center mb-4">
                                                <label className="block text-blue-700 text-base font-medium">
                                                    {qIdx + 1}. Question
                                                </label>
                                                <button className="text-gray-500 hover:text-gray-700 focus:outline-none p-1">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                value={q.text}
                                                onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                                                placeholder="Enter your question"
                                            />
                                            <div className="space-y-3">
                                                {q.options.map((opt, oIdx) => (
                                                    <div key={oIdx} className="flex items-center space-x-2">
                                                        <input
                                                            type="text"
                                                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            value={opt}
                                                            onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                                            placeholder={`Option ${oIdx + 1}`}
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveOption(qIdx, oIdx)}
                                                            className="p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => handleAddOption(qIdx)}
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
                ) : (
                    // ========== Template Section ==========
                    <div className='w-full'>
                        <ServeyTemplate onBackToPollCreation={function (): void {
                                throw new Error('Function not implemented.');
                            } }/>
                        
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-[2px]">
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
