
// // export default function PublishSurvey() {
// //     return (
// //         <div>PublishSurvey</div>
// //     )
// // }



// import React, { useState } from 'react';
// import { X } from 'lucide-react';
// import SurveyTemplate from './PollComponents/ServeyTemplate';

// interface SurveyWizardProps {
//     isOpen: boolean;
//     onClose: () => void;
// }

// interface WizardStep {
//     id: string;
//     title: string;
//     completed: boolean;
//     active: boolean;
// }

// const PublishSurvey: React.FC<SurveyWizardProps> = ({ isOpen, onClose }) => {
//     const [currentStep, setCurrentStep] = useState(0);
//     const [selectedAssignment, setSelectedAssignment] = useState<'all' | 'select' | null>('all');

//     const steps: WizardStep[] = [
//         { id: 'assign', title: 'Assign by', completed: false, active: currentStep === 0 },
//         { id: 'recipients', title: 'Recipients', completed: false, active: currentStep === 1 },
//         { id: 'publish', title: 'Publish settings', completed: false, active: currentStep === 2 },
//         { id: 'summary', title: 'Summary', completed: false, active: currentStep === 3 }
//     ];

//     const handleNext = () => {
//         if (currentStep < steps.length - 1) {
//             setCurrentStep(currentStep + 1);
//         }
//     };

//     const handleCancel = () => {
//         setCurrentStep(0);
//         setSelectedAssignment('all');
//         onClose();
//     };

//     const renderStepContent = () => {
//         switch (currentStep) {
//             case 0:
//                 return (
//                     <div className="flex-1 flex items-center justify-center">
//                         <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
//                             <button
//                                 onClick={() => setSelectedAssignment('all')}
//                                 className={`flex-1 py-4 px-6 rounded-lg border-2 transition-all font-medium ${selectedAssignment === 'all'
//                                     ? 'bg-[rgba(78,83,177,1)] text-white border-indigo-600'
//                                     : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
//                                     }`}
//                             >
//                                 All
//                             </button>
//                             <button
//                                 onClick={() => setSelectedAssignment('select')}
//                                 className={`flex-1 py-4 px-6 rounded-lg border-2 transition-all font-medium ${selectedAssignment === 'select'
//                                     ? 'bg-indigo-600 text-white border-indigo-600'
//                                     : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
//                                     }`}
//                             >
//                                 Select user
//                             </button>
//                         </div>
//                     </div>
//                 );
//             case 1:
//                 return (
//                     <div className="flex-1 flex items-center justify-center">
//                         <div className="text-center text-gray-500">
//                             <p className="text-lg mb-2">Recipients Configuration</p>
//                             <p className="text-sm">Configure who will receive this survey</p>
//                         </div>

//                     </div>
//                 );
//             case 2:
//                 return (
//                     <div className="flex-1 flex items-center justify-center">
//                         <div className="text-center text-gray-500">
//                             <p className="text-lg mb-2">Publish Settings</p>
//                             <p className="text-sm">Set up publishing options and schedule</p>
//                         </div>
//                     </div>
//                 );
//             case 3:
//                 return (
//                     <div className="flex-1 flex items-center justify-center">
//                         <div className="text-center text-gray-500">
//                             <p className="text-lg mb-2">Summary</p>
//                             <p className="text-sm">Review your survey configuration</p>
//                         </div>
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0   flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl">
//                 {/* Header */}
//                 <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                     <div>
//                         <h1 className="text-2xl font-bold text-[rgba(78,83,177,1)] mb-1">
//                             Create New Survey & Poll
//                         </h1>
//                         <p className="text-gray-600 text-sm">
//                             Design your survey or poll by adding questions, choosing response types, and setting audience and scheduling options
//                         </p>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                         <X size={20} className="text-gray-500" />
//                     </button>
//                 </div>

//                 {/* Progress Steps */}
//                 <div className="px-6 py-8 border-b border-gray-200">
//                     <div className="flex items-center justify-center max-w-2xl mx-auto">
//                         {steps.map((step, index) => (
//                             <React.Fragment key={step.id}>
//                                 <div className="flex flex-col items-center">
//                                     <div
//                                         className={`w-4 h-4 rounded-full transition-all ${step.active
//                                             ? 'bg-[rgba(78,83,177,1)]'
//                                             : index < currentStep
//                                                 ? 'bg-[rgba(78,83,177,1)]'
//                                                 : 'bg-gray-300'
//                                             }`}
//                                     />
//                                     <span
//                                         className={`mt-2 text-sm font-medium transition-all ${step.active
//                                             ? 'text-[rgba(78,83,177,1)]'
//                                             : index < currentStep
//                                                 ? 'text-[rgba(78,83,177,1)]'
//                                                 : 'text-gray-500'
//                                             }`}
//                                     >
//                                         {step.title}
//                                     </span>
//                                 </div>
//                                 {index < steps.length - 1 && (
//                                     <div
//                                         className={`flex-1 h-0.5 mx-4 transition-all ${index < currentStep ? 'bg-[rgba(78,83,177,1)]' : 'bg-gray-300'
//                                             }`}
//                                         style={{ minWidth: '60px' }}
//                                     />
//                                 )}
//                             </React.Fragment>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Content Area */}
//                 <div className="flex-1 flex flex-col">
//                     {renderStepContent()}
//                 </div>

//                 {/* Footer */}
//                 <div className="flex items-center justify-end gap-3 p-6  ">
//                     <button
//                         onClick={handleCancel}
//                         className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleNext}
//                         disabled={currentStep === 0 && !selectedAssignment}
//                         className="px-6 py-2 bg-[rgba(78,83,177,1)] text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PublishSurvey;


import React, { useState } from 'react';
import { X } from 'lucide-react';
import SurveyTemplate from './PollComponents/ServeyTemplate';

interface SurveyWizardProps {
    onClose: () => void;
}
interface WizardStep {
    id: string;
    title: string;
    completed: boolean;
    active: boolean;
}

const PublishSurvey: React.FC<SurveyWizardProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAssignment, setSelectedAssignment] = useState<'all' | 'select' | null>('all');

    const steps: WizardStep[] = [
        { id: 'assign', title: 'Assign by', completed: false, active: currentStep === 0 },
        { id: 'recipients', title: 'Recipients', completed: false, active: currentStep === 1 },
        { id: 'publish', title: 'Publish settings', completed: false, active: currentStep === 2 },
        { id: 'summary', title: 'Summary', completed: false, active: currentStep === 3 }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleCancel = () => {
        setCurrentStep(0);
        setSelectedAssignment('all');
        onClose();
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                            <button
                                onClick={() => setSelectedAssignment('all')}
                                className={`flex-1 py-4 px-6 rounded-lg border-2 transition-all font-medium ${selectedAssignment === 'all'
                                    ? 'bg-[rgba(78,83,177,1)] text-white border-indigo-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setSelectedAssignment('select')}
                                className={`flex-1 py-4 px-6 rounded-lg border-2 transition-all font-medium ${selectedAssignment === 'select'
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                                    }`}
                            >
                                Select user
                            </button>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <p className="text-lg mb-2">Recipients Configuration</p>
                            <p className="text-sm">Configure who will receive this survey</p>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <p className="text-lg mb-2">Publish Settings</p>
                            <p className="text-sm">Set up publishing options and schedule</p>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <p className="text-lg mb-2">Summary</p>
                            <p className="text-sm">Review your survey configuration</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-8xl mx-auto bg-white rounded-xl shadow-md mt-10 mb-20 border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-[rgba(78,83,177,1)] mb-1">
                        Create New Survey & Poll
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Design your survey or poll by adding questions, choosing response types, and setting audience and scheduling options
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-8 border-b border-gray-200">
                <div className="flex items-center justify-center max-w-2xl mx-auto">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-4 h-4 rounded-full transition-all ${step.active
                                        ? 'bg-[rgba(78,83,177,1)]'
                                        : index < currentStep
                                            ? 'bg-[rgba(78,83,177,1)]'
                                            : 'bg-gray-300'
                                        }`}
                                />
                                <span
                                    className={`mt-2 text-sm font-medium transition-all ${step.active
                                        ? 'text-[rgba(78,83,177,1)]'
                                        : index < currentStep
                                            ? 'text-[rgba(78,83,177,1)]'
                                            : 'text-gray-500'
                                        }`}
                                >
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-4 transition-all ${index < currentStep ? 'bg-[rgba(78,83,177,1)]' : 'bg-gray-300'
                                        }`}
                                    style={{ minWidth: '60px' }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8">
                {renderStepContent()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentStep === 0 && !selectedAssignment}
                    className="px-6 py-2 bg-[rgba(78,83,177,1)] text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default PublishSurvey;

