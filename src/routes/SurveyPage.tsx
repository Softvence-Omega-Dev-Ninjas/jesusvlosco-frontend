
// SurveyPage.tsx
import { useState } from 'react';
import {
    Pencil, FileText, LayoutPanelTop, List, Star, Trash2, Type,
    PlusCircle,
} from 'lucide-react';

import Modal from '@/components/Servey-poll/Modal';
import DropdownFieldModal from '@/components/Servey-poll/DropdownFieldModal';
import OpenEndedFieldModal from '@/components/Servey-poll/OpenEndedFieldModal';
import RatingFieldModal from '@/components/Servey-poll/RatingFieldModal'; // ✅ Import rating modal
import { NavLink } from 'react-router-dom';

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
    const [showModal, setShowModal] = useState(true);
    const [fields, setFields] = useState<string[]>([]);
    const [tempDescription, setTempDescription] = useState('');
    const [showDescInput, setShowDescInput] = useState(false);

    const [showDropdownModal, setShowDropdownModal] = useState(false);
    const [dropdownFields, setDropdownFields] = useState<DropdownFieldData[]>([]);

    const [showOpenModal, setShowOpenModal] = useState(false);
    const [openEndedFields, setOpenEndedFields] = useState<OpenEndedFieldData[]>([]);

    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingFields, setRatingFields] = useState<RatingFieldData[]>([]);

    const addField = (type: string) => {
        if (type === 'description') {
            setShowDescInput(true);
        } else if (type === 'dropdown') {
            setShowDropdownModal(true);
        } else if (type === 'open') {
            setShowOpenModal(true);
        } else if (type === 'rating') {
            setShowRatingModal(true);
        } else {
            setFields((prev) => [...prev, type]);
        }
    };

    const confirmDescription = () => {
        if (tempDescription.trim() !== '') {
            setFields((prev) => [...prev, tempDescription]);
            setTempDescription('');
            setShowDescInput(false);
        }
    };

    const handleSaveDropdown = (data: DropdownFieldData) => {
        setDropdownFields((prev) => [...prev, data]);
    };

    const handleSaveOpenEnded = (data: OpenEndedFieldData) => {
        setOpenEndedFields((prev) => [...prev, data]);
    };

    const handleSaveRatingField = (data: RatingFieldData) => {
        setRatingFields((prev) => [...prev, data]);
    };

    const removeField = (index: number) => {
        setFields((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen font-inter">
            <div className={`relative z-10 ${showModal ? 'blur-[1px] pointer-events-none' : ''}`}>
                <div className="max-w-8xl mx-auto py-8">
                    <div className="bg-white border border-gray-300 rounded-md shadow-sm">
                        <div className="border-t-[6px] border-indigo-600 rounded-t-md"></div>

                        <div className="grid grid-cols-1 max-w-2xl  sm:grid-cols-2 lg:grid-cols-1 gap-4 p-6">
                            <div className='flex gap-4'>
                                <label className="text-lg mt-3 font-medium text-[rgba(78,83,177,1)] min-w-max">Survey Title</label>
                                <input className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 lg:ml-10 text-sm" />
                            </div>
                            <div className='flex gap-4'>
                                <label className="text-lg mt-3 font-medium text-[rgba(78,83,177,1)]">Description</label>
                                <input className="w-full mt-1 border border-gray-300 lg:ml-10 rounded-md px-3 py-2 text-sm" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 min-h-[600px] sm:min-h-[700px] md:min-h-[700px] lg:min-h-[800px]	 md:grid-cols-4 gap-0 border-gray-300 border-t">
                            <div className="bg-gray-50 p-4 border-gray-300 border-r">
                                <p className="text-sm text-center font-semibold mb-4">Add a field</p>
                                <div className="space-y-3">
                                    <button onClick={() => addField('description')} className="flex items-center  gap-2 text-sm w-full border border-gray-300 px-3 py-4 rounded-md bg-white hover:bg-gray-100">
                                        <LayoutPanelTop size={16} /> Description
                                    </button>
                                    <div className="flex gap-2">
                                        <button onClick={() => addField('dropdown')} className="flex items-center justify-center gap-2 text-sm w-full border border-gray-300 px-3 py-4 rounded-md bg-white hover:bg-gray-100">
                                            <List size={16} /> Dropdown
                                        </button>
                                        <button onClick={() => addField('open')} className="flex items-center justify-center gap-2 text-sm w-full border border-gray-300 px-3 py-4 rounded-md bg-white hover:bg-gray-100">
                                            <Type size={16} /> Open ended
                                        </button>
                                    </div>
                                    
                                    <div className='flex gap-3'>
                                        <button onClick={() => addField('rating')} className="flex items-center justify-center gap-2 text-sm w-full border border-gray-300 px-3 py-4 rounded-md bg-white hover:bg-gray-100">
                                            <Star size={16} /> Rating
                                        </button>
                                        <button  className="flex items-center justify-center gap-2 text-sm w-full border border-gray-300 px-3 py-2 rounded-md bg-white hover:bg-gray-100">
                                            <PlusCircle size={16} /> Poll
                                        </button>
                                    </div>


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
                                                className="w-full bg-indigo-600 text-white text-sm py-2 rounded-md hover:bg-indigo-700"
                                            >
                                                Confirm Description
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-3 border-b border-gray-300 bg-gray-50 p-4">
                                <h1 className='mb-6 w-full'>Survey Preview</h1>

                                {fields.map((field, i) => (
                                    <div key={i} className="bg-white p-4 rounded-md shadow-sm mb-4 flex justify-between items-center">
                                        <p className="text-sm font-medium text-gray-700 capitalize">{field} field</p>
                                        <button onClick={() => removeField(i)} className="text-gray-500 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                {dropdownFields.map((dropdown, i) => (
                                    <div key={`dropdown-${i}`} className="bg-white p-4 rounded-md shadow-sm mb-4 flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">{dropdown.question}</p>
                                            <p className="text-sm text-gray-500 mb-2">{dropdown.description}</p>
                                            <ul className="list-disc list-inside text-sm text-gray-700">
                                                {dropdown.options.map((opt, j) => <li key={j}>{opt}</li>)}
                                            </ul>
                                        </div>
                                        <button onClick={() => setDropdownFields((prev) => prev.filter((_, index) => index !== i))} className="text-gray-500 hover:text-red-600 ml-4 mt-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                {openEndedFields.map((open, i) => (
                                    <div key={`open-${i}`} className="bg-white p-4 rounded-md shadow-sm mb-4 flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">{open.question}</p>
                                            <p className="text-sm text-gray-500 mb-2">{open.description}</p>
                                            <p className="text-sm italic text-gray-400">Placeholder: {open.placeholder}</p>
                                        </div>
                                        <button onClick={() => setOpenEndedFields((prev) => prev.filter((_, index) => index !== i))} className="text-gray-500 hover:text-red-600 ml-4 mt-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                {ratingFields.map((rating, i) => (
                                    <div key={`rating-${i}`} className="bg-white p-4 rounded-md shadow-sm mb-4 flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">{rating.question}</p>
                                            <p className="text-sm text-gray-500 mb-1">{rating.description}</p>
                                            <p className="text-sm text-gray-500 italic mb-2">{rating.minLabel} → {rating.maxLabel}</p>
                                            <div className="flex gap-1 text-yellow-500">
                                                {[...Array(rating.scale)].map((_, index) => <Star key={index} size={16} />)}
                                            </div>
                                        </div>
                                        <button onClick={() => setRatingFields((prev) => prev.filter((_, index) => index !== i))} className="text-gray-500 hover:text-red-600 ml-4 mt-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-gray-300 px-6 py-4 bg-white rounded-b-md">
                            <button className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100">Save as template</button>
                            <NavLink to={'/publish-survey'} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">Publish Survey</NavLink>
                        </div>
                    </div>
                </div>
            </div>

            {/* Initial Option Modal */}
            <Modal isOpen={showModal}>
                <h2 className="text-lg font-semibold mb-6 text-center">Choose an Option</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setShowModal(false)} className="flex-1 py-10 bg-[rgba(78,83,177,1)] text-white rounded-lg flex flex-col items-center hover:bg-indigo-700">
                        <Pencil size={24} className="mb-1" />
                        Create a new
                    </button>
                    <button onClick={() => setShowModal(false)} className="flex-1 py-10 bg-white text-gray-800 rounded-lg border border-gray-300 flex flex-col items-center hover:bg-gray-100">
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

