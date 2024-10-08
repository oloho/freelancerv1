import React, { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Power, List, X, Send, AlertTriangle, Download } from 'lucide-react'
import { SlavePc } from './types'
import { fetchSlavePcs, updatePc, updateAllPcs, rebootPc, sendTask } from './services/pcManagement'
import ErrorBoundary from './components/ErrorBoundary'
import LogViewer from './components/LogViewer'

function App() {
  const [slavePcs, setSlavePcs] = useState<SlavePc[]>([])
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPcId, setSelectedPcId] = useState<string | null>(null)
  const [logs, setLogs] = useState<{ [key: string]: string[] }>({})

  const addLog = (pcId: string, message: string) => {
    setLogs(prevLogs => ({
      ...prevLogs,
      [pcId]: [...(prevLogs[pcId] || []), message]
    }))
  }

  const loadSlavePcs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const pcs = await fetchSlavePcs()
      setSlavePcs(pcs)
    } catch (err) {
      setError('Failed to fetch slave PCs. Please try again.')
      console.error('Error fetching slave PCs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSlavePcs()
  }, [loadSlavePcs])

  const handleUpdateAll = async () => {
    setUpdating('all')
    try {
      await updateAllPcs()
      addLog('all', 'All PCs updated with new automation features')
    } catch (error) {
      addLog('all', `Failed to update all PCs: ${error}`)
    }
    setUpdating(null)
  }

  const handleUpdatePc = async (pcId: string) => {
    setUpdating(pcId)
    try {
      await updatePc(pcId)
      addLog(pcId, 'PC updated with new automation features')
    } catch (error) {
      addLog(pcId, `Failed to update PC: ${error}`)
    }
    setUpdating(null)
  }

  const handleRebootPc = async (pcId: string) => {
    try {
      await rebootPc(pcId)
      addLog(pcId, 'PC rebooted successfully')
    } catch (error) {
      addLog(pcId, `Failed to reboot PC: ${error}`)
    }
  }

  const handleCreateGmail = async (pcId: string) => {
    try {
      await sendTask(pcId, 'create_gmail')
      addLog(pcId, 'Started Gmail creation task')
    } catch (error) {
      addLog(pcId, `Failed to start Gmail creation task: ${error}`)
    }
  }

  const handleShowLogs = (pcId: string) => {
    setSelectedPcId(prevId => prevId === pcId ? null : pcId)
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Slave PC Management</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={loadSlavePcs}
            disabled={loading}
            title="Fetch the latest status of all PCs"
          >
            <RefreshCw className="inline-block mr-1" size={16} />
            {loading ? 'Refreshing...' : 'Refresh Status'}
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleUpdateAll}
            disabled={loading || updating === 'all' || slavePcs.length === 0}
            title="Update all PCs with new automation features"
          >
            <Download className="inline-block mr-1" size={16} />
            {updating === 'all' ? 'Updating All...' : 'Update All PC Features'}
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {slavePcs.map((pc) => (
                <li key={pc.id} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="w-full flex items-center justify-between p-6 space-x-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-gray-900 text-sm font-medium truncate">{pc.name}</h3>
                        <span className={`flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                          pc.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {pc.status}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-500 text-sm truncate">Last update: {new Date(pc.lastUpdate).toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <div className="-mt-px flex divide-x divide-gray-200">
                      <div className="w-0 flex-1 flex">
                        <button
                          onClick={() => handleUpdatePc(pc.id)}
                          className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                          disabled={updating === pc.id}
                          title="Update this PC with new automation features"
                        >
                          <Download className="w-5 h-5 text-gray-400" aria-hidden="true" />
                          <span className="ml-3">{updating === pc.id ? 'Updating...' : 'Update Features'}</span>
                        </button>
                      </div>
                      <div className="-ml-px w-0 flex-1 flex">
                        <button
                          onClick={() => handleRebootPc(pc.id)}
                          className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                        >
                          <Power className="w-5 h-5 text-gray-400" aria-hidden="true" />
                          <span className="ml-3">Reboot</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-4 sm:px-6 flex justify-between">
                    <button
                      onClick={() => handleCreateGmail(pc.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Create Gmail
                    </button>
                    <button
                      onClick={() => handleShowLogs(pc.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                      {selectedPcId === pc.id ? 'Hide Logs' : 'Show Logs'}
                    </button>
                  </div>
                  {selectedPcId === pc.id && (
                    <div className="px-4 py-4 sm:px-6">
                      <LogViewer logs={logs[pc.id] || []} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App