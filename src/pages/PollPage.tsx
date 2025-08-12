import { useState, useEffect } from 'react'
import { Plus, X, Pencil, FileText, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

interface Question {
  id: number
  text: string
  options: string[]
}

export default function PollPage() {
  const [pollTitle, setPollTitle] = useState('')
  const [pollDescription, setPollDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: '', options: ['', '', '', ''] },
  ])
  const [showModal, setShowModal] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [showModal])

  const handleCreateNewPoll = () => setShowModal(false)
  const handleUseTemplate = () => {
    setShowModal(false)
    navigate('/admin/poll-template')
  }


  const handlePublishPoll = () => {
    console.log('Publish Poll clicked', {
      pollTitle,
      pollDescription,
      questions,
    })
  }


  const handleCancelPoll = () => {
    setPollTitle('')
    setPollDescription('')
    setQuestions([{ id: 1, text: '', options: ['', '', '', ''] }])
    setShowModal(true)
  }


  const handleAddOption = (qIdx: number) => {
    const newQuestions = [...questions]
    newQuestions[qIdx].options.push('')
    setQuestions(newQuestions)
  }
  const handleRemoveOption = (qIdx: number, oIdx: number) => {
    const newQuestions = [...questions]
    newQuestions[qIdx].options.splice(oIdx, 1)
    setQuestions(newQuestions)
  }
  
  const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[qIdx].options[oIdx] = value
    setQuestions(newQuestions)
  }
  const handleQuestionTextChange = (qIdx: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[qIdx].text = value
    setQuestions(newQuestions)
  }

  const blurClass = showModal ? 'filter blur-sm pointer-events-none' : ''

  return (
    <div className="min-h-screen relative font-inter overflow-x-hidden">
      {/* Rotated Templates Label */}
      <div className="fixed top-1/2 right-0 -translate-y-1/2 z-50">
        <div className="bg-[#4E53B1] text-white px-5 py-3 rounded-md shadow transform -rotate-90 origin-bottom-right">
          Templates
        </div>
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
                  <label className="block text-[#4E53B1] text-sm font-semibold mb-2">
                    Poll Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
                    value={pollTitle}
                    onChange={(e) => setPollTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[#4E53B1] text-sm font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-200 h-24 resize-none"
                    value={pollDescription}
                    onChange={(e) => setPollDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Poll Details Section */}
              <div className='p-8 border border-[#C5C5C5] rounded-xl bg-[#FAFBFF]'>
                <div className="bg-[#FAFBFF] border border-[#C5C5C5] p-6 rounded-xl w-full max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-[#4E53B1] mb-6 pb-4 border-b border-[#C5C5C5]">
                  Poll details
                </h3>

                {questions.map((q, qIdx) => (
                  <div key={q.id} className="mb-8 last:mb-0">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-[#4E53B1] text-base font-medium">
                        {qIdx + 1}. Question
                      </label>
                      <button className="text-gray-500 hover:text-gray-700 p-1">
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="w-full px-6 py-4 mb-10 border border-gray-300 rounded-lg"
                      value={q.text}
                      onChange={(e) =>
                        handleQuestionTextChange(qIdx, e.target.value)
                      }
                      placeholder="Enter your question"
                    />

                    {/* Options */}
                    <div className="space-y-3">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="relative w-full">
                          <input
                            type="text"
                            className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(qIdx, oIdx, e.target.value)
                            }
                            placeholder={`Option ${oIdx + 1}`}
                          />
                          <button
                            onClick={() => handleRemoveOption(qIdx, oIdx)}
                            className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-gray-800"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleAddOption(qIdx)}
                      className="mt-4 flex items-center space-x-2 text-[#4E53B1] border border-[#4E53B1] px-3 py-2 font-bold rounded hover:bg-[#4E53B1] hover:text-white transition"
                    >
                      <Plus size={20} />
                      <span>Add option</span>
                    </button>
                  </div>
                ))}

                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8 w-full">
                  <button
                    onClick={handlePublishPoll}
                    className="w-full rounded md:w-80 px-6 py-3 bg-white text-gray-800 cursor-pointer font-semibold border"
                  >
                    Edit
                  </button>
                  <Link to="/admin/publish-poll">
                    <button
                    onClick={handleCancelPoll}
                    className="w-full cursor-pointer rounded md:w-80 px-6 py-3 bg-[#4E53B1] text-white font-semibold"
                   
                  >
                    Publsih
                  </button>
                  </Link>
                  
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
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              Choose an Option
            </h4>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center">
              <button
                onClick={handleCreateNewPoll}
                className="flex flex-col items-center justify-center p-6 bg-[#4E53B1] text-white font-semibold rounded-lg w-full sm:w-1/2"
              >
                <Pencil size={32} className="mb-2" />
                <span>Create a new</span>
              </button>
              <button
                onClick={handleUseTemplate}
                className="flex flex-col items-center justify-center p-6 bg-white text-gray-800 font-semibold rounded-lg border w-full sm:w-1/2"
              >
                <FileText size={32} className="mb-2" />
                <span>Use a template</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
