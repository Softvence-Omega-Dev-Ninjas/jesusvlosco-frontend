

import React from 'react';

// Header component for the dashboard
const Header: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white shadow-sm rounded-md mb-4">
      <div className="text-xl font-bold text-gray-800 mb-2 md:mb-0">Employee Satisfaction Survey Response</div>
      <div className="text-sm text-gray-500 text-center md:text-left mb-2 md:mb-0 md:flex-1 md:mx-4">
        View and manage all surveys currently active. Monitor participation and status at a glance
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 w-full sm:w-auto">
          View Responses
        </button>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50 w-full sm:w-auto">
          Delete survey
        </button>
      </div>
    </div>
  );
};



// Component to display participation statistics with a circular progress bar
interface ParticipationCardProps {
  percentage: number;
  completed: number;
  total: number;
  label: string;
  bgColor: string;
  textColor: string;
    strokeWidth?: number;

}

const ParticipationCard: React.FC<ParticipationCardProps> = ({
  percentage,
  completed,
  total,
  label,
  bgColor,
 
    strokeWidth = 10,
  textColor = "text-blue-500",
}) => {
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`flex items-center p-4 rounded-md shadow-sm ${bgColor}`}>
      <div className="relative w-48 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="24"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="24"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
            className={textColor} // Use textColor for the stroke color
          />
        </svg>
        <div className="absolute text-xl font-bold">{percentage}%</div>
      </div>
      <div className="">
        <div className={`text-lg font-medium ${textColor}`}>{completed} / {total} users</div>
        <div className={`text-sm ${textColor}`}>{label}</div>
      </div>
    </div>
  );
};

// Component for displaying participation by department with a donut chart
interface DepartmentParticipationCardProps {
  data: { label: string; value: number; color: string }[];
}

const DepartmentParticipationCard: React.FC<DepartmentParticipationCardProps> = ({ data }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="text-md font-semibold text-gray-800 mb-4">Participation by department</div>
      <div className="flex items-center space-x-4">
        <div className="relative w-48 h-36">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="24"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            {data.map((item, index) => {
              const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
              const offset = circumference - currentOffset;
              currentOffset += (item.value / 100) * circumference;
              return (
                <circle
                  key={index}
                  className={item.color}
                  strokeWidth="24"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                  style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                />
              );
            })}
          </svg>
        </div>
        <div className="flex-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center mb-1">
              <span className={`w-3 h-3 rounded-full ${item.color.replace('text-', 'bg-')} mr-2`}></span> {/* Use bg- for dots */}
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="ml-auto font-medium text-gray-800">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// Component for displaying Donut chart questions
interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
  question: string;
}

const DonutChartCard: React.FC<DonutChartProps> = ({ data, title, question }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="text-md font-semibold text-gray-800">{title}</div>
      <div className="text-sm text-gray-600 mb-4">{question}</div>
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            {data.map((item, index) => {
              const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
              const offset = circumference - currentOffset;
              currentOffset += (item.value / 100) * circumference;
              return (
                <circle
                  key={index}
                  className={item.color}
                  strokeWidth="10"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                  style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                />
              );
            })}
          </svg>
        </div>
        <div className="flex-1 w-full"> {/* Added w-full for better small screen layout */}
          {data.map((item, index) => (
            <div key={index} className="flex items-center mb-1">
              <span className={`w-3 h-3 rounded-full ${item.color.replace('text-', 'bg-')} mr-2`}></span> {/* Use bg- for dots */}
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="ml-auto font-medium text-gray-800">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component for displaying text response questions
interface TextResponseCardProps {
  title: string;
  question: string;
  responses: string[];
}

const TextResponseCard: React.FC<TextResponseCardProps> = ({ title, question, responses }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="text-md font-semibold text-gray-800">{title}</div>
      <div className="text-sm text-gray-600 mb-4">{question}</div>
      <div className="text-sm text-gray-700">
        <div className="font-medium mb-2">Answer: Most Common Words from Responses</div>
        <ul className="list-disc list-inside space-y-1">
          {responses.map((response, index) => (
            <li key={index}>{response}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Main Dashboard component
const SurveyResponse: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
       

        <ParticipationCard
          percentage={33}
          completed={80}
          total={200}
          label="completed"
          bgColor="bg-green-50" // Lighter green background
          textColor="text-green-700"
        />
        <ParticipationCard
          percentage={67}
          completed={120}
          total={200}
          label="Not started"
          bgColor="bg-red-50" // Lighter red background
          textColor="text-red-700"
        />
        <DepartmentParticipationCard
          data={[
            { label: 'Sales', value: 30, color: 'text-blue-500' },
            { label: 'HR', value: 25, color: 'text-green-500' },
            { label: 'IT', value: 20, color: 'text-yellow-500' },
            { label: 'Marketing', value: 25, color: 'text-red-500' },
          ]}
        />
      </div>

      <div className="px-0 text-xl font-bold text-gray-800 mb-4">Questions</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DonutChartCard
          title="Question 1 : How satisfied are you with your current job?"
          question="Answer:"
          data={[
            { label: 'Very Satisfied', value: 55, color: 'text-green-500' },
            { label: 'Satisfied', value: 20, color: 'text-blue-500' },
            { label: 'Neutral', value: 10, color: 'text-yellow-500' },
            { label: 'Dissatisfied', value: 10, color: 'text-red-500' },
            { label: 'Very dissatisfied', value: 5, color: 'text-purple-500' },
          ]}
        />
        <DonutChartCard
          title="Question 2 : How often do you receive recognition for your work?"
          question="Answer:"
          data={[
            { label: 'Very Satisfied', value: 55, color: 'text-green-500' },
            { label: 'Satisfied', value: 20, color: 'text-blue-500' },
            { label: 'Neutral', value: 10, color: 'text-yellow-500' },
            { label: 'Dissatisfied', value: 10, color: 'text-red-500' },
            { label: 'Very dissatisfied', value: 5, color: 'text-purple-500' },
          ]}
        />
        <DonutChartCard
          title="Question 3 : How supportive is your manager in helping you achieve your goals?"
          question="Answer:"
          data={[
            { label: 'Very Satisfied', value: 40, color: 'text-green-500' },
            { label: 'Satisfied', value: 30, color: 'text-blue-500' },
            { label: 'Neutral', value: 15, color: 'text-yellow-500' },
            { label: 'Dissatisfied', value: 10, color: 'text-red-500' },
            { label: 'Very dissatisfied', value: 5, color: 'text-purple-500' },
          ]}
        />
        <DonutChartCard
          title="Question 4 : Do you feel you have a good work-life balance?"
          question="Answer:"
          data={[
            { label: 'Very Satisfied', value: 85, color: 'text-green-500' },
            { label: 'Satisfied', value: 15, color: 'text-blue-500' },
          ]}
        />
        <DonutChartCard
          title="Question 5 : How satisfied are you with your compensation and benefits?"
          question="Answer:"
          data={[
            { label: 'Very Satisfied', value: 85, color: 'text-green-500' },
            { label: 'Satisfied', value: 15, color: 'text-blue-500' },
          ]}
        />
        <DonutChartCard
          title="Question 6 : Do you believe there are opportunities for career growth within the company?"
          question="Answer:"
          data={[
            { label: 'Very Satisfied', value: 15, color: 'text-green-500' },
            { label: 'Satisfied', value: 40, color: 'text-blue-500' },
            { label: 'Neutral', value: 25, color: 'text-yellow-500' },
            { label: 'Dissatisfied', value: 15, color: 'text-red-500' },
            { label: 'Very dissatisfied', value: 5, color: 'text-purple-500' },
          ]}
        />
        <TextResponseCard
          title="Question 7 : What do you like most about your current job?"
          question="Answer:"
          responses={[
            'Team collaboration',
            'Flexible working hour',
            'Opportunities for growth',
            'Supportive leadership',
            'Positive working culture',
          ]}
        />
        <TextResponseCard
          title="Question 8 : What improvements would you suggest for the company?"
          question="Answer:"
          responses={[
            'Communication',
            'Resources',
            'Training',
            'Recognition',
            'Working procedures',
          ]}
        />
        <DonutChartCard
          title="Question 9 : Do you feel safe in your workplace?"
          question="Answer:"
          data={[
            { label: 'Very Satisfied', value: 85, color: 'text-green-500' },
            { label: 'Satisfied', value: 15, color: 'text-blue-500' },
          ]}
        />
        <TextResponseCard
          title="Question 10 : How can management improve communication with employees?"
          question="Answer:"
          responses={[
            'Transparency',
            'Meetings',
            'Feedback',
            'Regular updates',
            'Openness',
          ]}
        />
      </div>
    </div>
  );
};

export default SurveyResponse;
