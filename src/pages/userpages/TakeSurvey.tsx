import React, { useState, useEffect } from 'react';
import {  Link, useNavigate,} from 'react-router-dom';
import profile from "../../assets/person.png";
import calendar from "../../assets/calendar_month.png";

const totalQuestions = 5;

const TakeSurvey: React.FC = () => {
  const navigate = useNavigate();
 
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [progress, setProgress] = useState((1 / totalQuestions) * 100);

  useEffect(() => {
    setSelectedOption(answers[currentQuestion] || null);
    setProgress((currentQuestion / totalQuestions) * 100);
  }, [currentQuestion, answers]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.value;
    setSelectedOption(selected);
    setAnswers(prev => ({ ...prev, [currentQuestion]: selected }));
  };

  const handleNextClick = () => {
    if (!selectedOption) {
      alert("Please select an option before continuing.");
      return;
    }
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousClick = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitClick = () => {
    if (!selectedOption) {
      alert("Please select an option before submitting.");
      return;
    }
    setAnswers(prev => ({ ...prev, [currentQuestion]: selectedOption }));
    alert('Survey submitted!');
    console.log("Submitted answers:", answers);
    navigate('/user/poll');
  };

  // Dummy question set
  const getQuestionData = (id: number) => {
    const questions = [
      {
        id: 1,
        text: `How satisfied are you with the current safety protocols on-site?`,
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'],
      },
      {
        id: 2,
        text: `How satisfied are you with the current safety protocols on-site?`,
        options:  ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'],
      },
      {
        id: 3,
        text: `How satisfied are you with the current safety protocols on-site?`,
        options:  ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'],
      },
      {
        id: 4,
        text:`How satisfied are you with the current safety protocols on-site?`,
        options:  ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'],
      },
      {
        id: 5,
        text: `How satisfied are you with the current safety protocols on-site?`,
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'],
      }
    ];
    return questions[id - 1];
  };

  const question = getQuestionData(currentQuestion);
  const isProgressBarFull = progress === 100;

  return (
    <div className="my-6 container mx-auto">
      <div>
        {/* Header */}
        <div className="flex flex-wrap gap-2 items-center mb-6 text-sm text-gray-600">
          <h1 className="text-2xl font-semibold text-primary w-full mb-2">
            Employee Satisfaction Survey
          </h1>
          <div className="flex gap-4 items-center flex-wrap">
            <span className="flex gap-1 items-center">
              <img src={profile} alt="Owner" className="w-5 h-5" />
              Owner: Admin
            </span>
            <span className="flex gap-1 items-center">
              <img src={calendar} alt="Calendar" className="w-5 h-5" />
              Duration: May 1 - May 15, 2025
            </span>
            <span className="font-medium">
              Status: <span className="font-medium text-green-600">Active</span>
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6">
          This survey gathers feedback on employee satisfaction with current workplace practices.
          Your responses will help us improve our work environment and <br /> address any concerns.
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {currentQuestion} of {totalQuestions} questions ({Math.round(progress)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="flex items-center my-4">
          <button className="font-bold text-white mr-3 border px-4 rounded-md py-2 bg-primary">
            {currentQuestion}
          </button>
          <div>
            <p className="text-gray-900 font-semibold mb-2">{question.text}</p>
            <p className="text-sm text-gray-600">
              Please select one option that best represents your opinion
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                selectedOption === option
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                className="form-radio h-5 w-5 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-4 text-gray-800">{option}</span>
            </label>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            className="px-6 py-2 border border-gray-300 rounded-md text-white bg-primary cursor-pointer"
            onClick={handlePreviousClick}
            disabled={currentQuestion === 1}
          >
            Previous
          </button>

          {isProgressBarFull ? (
           <Link to={"/user/poll"}>
            <button
              className="px-6 py-2 rounded-md text-white bg-green-600 cursor-pointer"
              onClick={handleSubmitClick}
            >
              Submit
            </button>
           </Link>
          ) : (
            <button
              className="px-6 py-2 rounded-md text-white bg-primary cursor-pointer"
              onClick={handleNextClick}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeSurvey;
