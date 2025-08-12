import React from 'react';

// Helper component for the doughnut chart
interface DoughnutChartProps {
  data: { label: string; percentage: number; color: string }[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  let currentAngle = 0;
  const gradientParts = data
    .map((item) => {
      const startAngle = currentAngle;
      const endAngle = currentAngle + (item.percentage / 100) * 360;
      currentAngle = endAngle;
      return `${item.color} ${startAngle}deg ${endAngle}deg`;
    })
    .join(', ');

  return (
    <div className="flex items-center justify-center space-x-6">
      <div className="w-32 h-32 relative flex items-center justify-center">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `conic-gradient(${gradientParts})`,
          }}
        ></div>
        {/* Inner circle to create the doughnut effect */}
        <div className="absolute bg-white w-16 h-16 rounded-full"></div>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="text-primary text-sm font-semibold mb-2">Answer</span>
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span
              className="w-2.5 h-2.5 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-gray-700 text-sm">{item.label}</span>
            <span className="ml-2 text-gray-500 text-sm font-medium">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for a single survey question card
interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  answerContent:
    | { type: 'chart'; data: { label: string; percentage: number; color: string }[] }
    | { type: 'text'; responses: string[] };
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber,
  questionText,
  answerContent,
}) => {

  const isCentered = [7, 8, 10].includes(questionNumber);

  return (
    <div className={`p-6  border border-[#C5C5C5] rounded-lg ${isCentered ? "text-center" : "text-left"}`}>
      <h3 className="text-base  text-gray-800 mb-2">
        Question {questionNumber} : {questionText}
      </h3>

      {/* Show "Answer:" except for question 7, 8, and 10 */}
      {![7, 8, 10].includes(questionNumber) && (
        <p className=" text-sm mb-4">Answer:</p>
      )}

      <div>
        {answerContent.type === 'chart' && <DoughnutChart data={answerContent.data} />}
        {answerContent.type === 'text' && (
          <div className="text-sm">
            <p className="text-sm  mb-2">
              Answer: Most Common Words from Responses
            </p>
            <ul className="list-none p-0 m-0">
              {answerContent.responses.map((response, index) => (
                <li key={index} className="mb-1">
                  {response}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};




// Main dashboard component
const SurveyQuestionCard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary my-8 ">Questions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Question 1 */}
        <QuestionCard
          questionNumber={1}
          questionText="How satisfied are you with your current job?"
          answerContent={{
            type: 'chart',
            data: [
              { label: 'Very Satisfied', percentage: 15, color: '#22C55E' }, // Green
              { label: 'Satisfied', percentage: 40, color: '#F97316' }, // Orange
              { label: 'Neutral', percentage: 25, color: '#FBBD23' }, // Yellow
              { label: 'Dissatisfied', percentage: 15, color: '#EF4444' }, // Red
              { label: 'Very Dissatisfied', percentage: 5, color: '#9CA3AF' }, // Gray
            ],
          }}
        />

        {/* Question 2 */}
        <QuestionCard
          questionNumber={2}
          questionText="How often do you receive recognition for your work?"
          answerContent={{
            type: 'chart',
            data: [
              { label: 'Very Satisfied', percentage: 15, color: '#22C55E' },
              { label: 'Satisfied', percentage: 40, color: '#F97316' },
              { label: 'Neutral', percentage: 25, color: '#FBBD23' },
              { label: 'Dissatisfied', percentage: 15, color: '#EF4444' },
              { label: 'Very Dissatisfied', percentage: 5, color: '#9CA3AF' },
            ],
          }}
        />

        {/* Question 3 */}
        <QuestionCard
          questionNumber={3}
          questionText="How supportive is your manager in helping you achieve your goals?"
          answerContent={{
            type: 'chart',
            data: [
              { label: 'Very Satisfied', percentage: 15, color: '#22C55E' },
              { label: 'Satisfied', percentage: 40, color: '#F97316' },
              { label: 'Neutral', percentage: 20, color: '#FBBD23' },
              { label: 'Dissatisfied', percentage: 20, color: '#EF4444' },
              { label: 'Very Dissatisfied', percentage: 5, color: '#9CA3AF' },
            ],
          }}
        />

        {/* Question 4 */}
        <QuestionCard
          questionNumber={4}
          questionText="Do you feel you have a good work-life balance?"
          answerContent={{
            type: 'chart',
            data: [
              { label: 'Very Satisfied', percentage: 85, color: '#EF4444' }, // Red dominant
              { label: 'Satisfied', percentage: 15, color: '#22C55E' }, // Green
            ],
          }}
        />

        {/* Question 5 */}
        <QuestionCard
          questionNumber={5}
          questionText="How satisfied are you with your compensation and benefits?"
          answerContent={{
            type: 'chart',
            data: [
              { label: 'Very Satisfied', percentage: 85, color: '#22C55E' },
              { label: 'Satisfied', percentage: 15, color: '#EF4444' },
            ],
          }}
        />

        {/* Question 6 */}
        <QuestionCard
          questionNumber={6}
          questionText="Do you believe there are opportunities for career growth within the company?"
          answerContent={{
            type: 'chart',
            data: [
              { label: 'Very Satisfied', percentage: 15, color: '#22C55E' },
              { label: 'Satisfied', percentage: 40, color: '#F97316' },
              { label: 'Neutral', percentage: 25, color: '#FBBD23' },
              { label: 'Dissatisfied', percentage: 15, color: '#EF4444' },
              { label: 'Very Dissatisfied', percentage: 5, color: '#9CA3AF' },
            ],
          }}
        />

        {/* Question 7 */}
        <QuestionCard
          questionNumber={7}
          questionText="What do you like most about your current job?"
          answerContent={{
            type: 'text',
            responses: [
              'Team collaboration',
              'Flexible working hour',
              'Opportunities for growth',
              'Supportive leadership',
              'Positive working culture',
            ],
          }}
        />

        {/* Question 8 */}
        <QuestionCard
          questionNumber={8}
          questionText="What Improvements would you suggest for the company?"
          answerContent={{
            type: 'text',
            responses: ['Communication', 'Resources', 'Training', 'Recognition', 'Working procedures'],
          }}
        />

        {/* Question 9 */}
        <QuestionCard
          questionNumber={9}
          questionText="Do you feel safe in your workplace?"
          answerContent={{
            type: 'chart',
            data: [
              { label: 'Very Satisfied', percentage: 85, color: '#22C55E' },
              { label: 'Satisfied', percentage: 15, color: '#EF4444' },
            ],
          }}
        />

        {/* Question 10 */}
        <QuestionCard
          questionNumber={10}
          questionText="How can management improve communication with employees?"
          answerContent={{
            type: 'text',
            responses: ['Transparency', 'Meetings', 'Feedback', 'Regular updates', 'Openness'],
          }}
        />
      </div>
    </div>
  );
};

export default SurveyQuestionCard;
