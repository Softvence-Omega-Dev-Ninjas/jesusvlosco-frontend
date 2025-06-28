import { Award } from "lucide-react";
import React from "react";
import { Recognition } from "./dashboard";

export const RecognitionTable: React.FC<{ recognitions: Recognition[] }> = ({
  recognitions,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Recognition</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">Sent to</th>
              <th className="text-left py-3 px-2">Type</th>
              <th className="text-left py-3 px-2">Message</th>
              <th className="text-left py-3 px-2">Viewer</th>
              <th className="text-left py-3 px-2">Reaction</th>
            </tr>
          </thead>
          <tbody>
            {recognitions.map((recognition) => (
              <tr key={recognition.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-orange-700">
                        {recognition.avatar}
                      </span>
                    </div>
                    <span className="text-sm">{recognition.from}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className="flex items-center gap-1 text-orange-600">
                    <Award className="w-4 h-4" />
                    {recognition.type}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm">{recognition.message}</td>
                <td className="py-3 px-2 text-sm">{recognition.viewer}</td>
                <td className="py-3 px-2">
                  <div className="flex gap-1">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      👍
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      💬
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
