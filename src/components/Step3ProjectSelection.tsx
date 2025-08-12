// src/components/Step3ProjectSelection.tsx
import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the interface for a Project object
interface Project {
    id: string;
    name: string;
}

// Define the interface for the component's props
interface Step3ProjectSelectionProps {
    onSelectProject: (project: Project) => void;
}

const projects: Project[] = [ // Explicitly type the projects array
    { id: '1', name: 'Project 1' },
    { id: '2', name: 'Project 2' },
    // Add more projects as needed
];

const Step3ProjectSelection: React.FC<Step3ProjectSelectionProps> = ({ onSelectProject }) => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState<string>(''); // Type searchTerm as string
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null); // Type selectedProjectId as string or null

    const filteredProjects: Project[] = projects.filter((project: Project) => // Type project in filter callback
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProjectClick = (project: Project) => { // Type project parameter
        setSelectedProjectId(project.id);
        onSelectProject(project); // Pass the selected project back to the parent
    };
    const handleClick = () => {
        navigate("/admin")
    }

    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">You're always keeping busy!</h2>
            <p className="text-gray-600 mb-6">
                We found that you have been assigned in multiple project. Please select the project you
                wish to log in to from the list.
            </p>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} // Type the event object
                />
                <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width="20"
                    height="20"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>
            <div className="space-y-2">
                {filteredProjects.map((project: Project) => ( // Type project in map callback
                    <button
                        key={project.id}
                        onClick={() => { handleProjectClick(project), handleClick() }}

                        className={`w-full flex items-center justify-between p-3 border rounded-md transition duration-200
              ${selectedProjectId === project.id ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                        <span className="font-medium">{project.name}</span>
                        <svg
                            className="text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width="20"
                            height="20"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Step3ProjectSelection;