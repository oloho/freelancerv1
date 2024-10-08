import React from 'react'
import { Clock } from 'lucide-react'

interface LogViewerProps {
  logs: string[]
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  if (logs.length === 0) {
    return <p className="text-gray-500">No logs available.</p>
  }

  return (
    <div className="bg-gray-100 rounded-md p-4 max-h-60 overflow-y-auto">
      <h4 className="text-lg font-semibold mb-2">Logs</h4>
      <ul className="space-y-2">
        {logs.map((log, index) => (
          <li key={index} className="flex items-start">
            <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" size={16} />
            <span className="text-sm text-gray-700">{log}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LogViewer