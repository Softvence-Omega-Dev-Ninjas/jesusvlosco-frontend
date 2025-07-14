

interface VisibilityToggleProps {
      selected: 'everyone' | 'only-me';
      onSelect: (scope: 'everyone' | 'only-me') => void;
}

export default function VisibilityToggle({ selected, onSelect }: VisibilityToggleProps) {
      return (
            <div className="">
                  <div className="flex gap-10">
                        <button
                              onClick={() => onSelect('everyone')}
                              className={`px-6 py-3 text-sm font-medium ml-auto lg:ml-6 rounded-md transition-all duration-200 ${selected === 'everyone'
                                          ? 'bg-blue-600 text-white shadow-sm'
                                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                        >
                              Everyone
                        </button>
                        <button
                              onClick={() => onSelect('only-me')}
                              className={`px-6 py-3 text-sm font-medium rounded-md min-w-max transition-all duration-200 ${selected === 'only-me'
                                          ? 'bg-blue-600 text-white shadow-sm'
                                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                        >
                              Only me
                        </button>
                  </div>
            </div>
      );
}