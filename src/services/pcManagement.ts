import { SlavePc } from '../types'
import { mockSlavePcs, getRandomDelay } from './mockData'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_MOCK_DATA = true // Set this to false when you have a real API

const simulateApiCall = async <T>(data: T): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, getRandomDelay(500, 1500)))
  return data
}

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  const response = await fetch(url, { ...options, signal: controller.signal })
  clearTimeout(id)
  return response
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'An error occurred')
  }
  return response.json()
}

export const fetchSlavePcs = async (): Promise<SlavePc[]> => {
  if (USE_MOCK_DATA) {
    return simulateApiCall(mockSlavePcs)
  }

  try {
    const response = await fetchWithTimeout(`${API_URL}/pcs`)
    return handleResponse(response)
  } catch (error) {
    console.error('Error fetching slave PCs:', error)
    throw new Error('Failed to fetch slave PCs. Please try again.')
  }
}

export const updatePc = async (pcId: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    try {
      await simulateApiCall({ success: true })
      console.log(`Mock PC ${pcId} updated with new automation features`)
    } catch (error) {
      console.error('Error updating mock PC:', error)
      throw new Error('Failed to update PC features. Please try again.')
    }
    return
  }

  try {
    const response = await fetchWithTimeout(`${API_URL}/pcs/${pcId}/update-features`, {
      method: 'POST',
    })
    await handleResponse(response)
  } catch (error) {
    console.error('Error updating PC features:', error)
    throw new Error('Failed to update PC features. Please try again.')
  }
}

export const updateAllPcs = async (): Promise<void> => {
  if (USE_MOCK_DATA) {
    try {
      await simulateApiCall({ success: true })
      console.log('All mock PCs updated with new automation features')
    } catch (error) {
      console.error('Error updating all mock PCs:', error)
      throw new Error('Failed to update all PCs features. Please try again.')
    }
    return
  }

  try {
    const response = await fetchWithTimeout(`${API_URL}/pcs/update-all-features`, {
      method: 'POST',
    })
    await handleResponse(response)
  } catch (error) {
    console.error('Error updating all PCs features:', error)
    throw new Error('Failed to update all PCs features. Please try again.')
  }
}

export const rebootPc = async (pcId: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    try {
      await simulateApiCall({ success: true })
      console.log(`Mock PC ${pcId} rebooted`)
    } catch (error) {
      console.error('Error rebooting mock PC:', error)
      throw new Error('Failed to reboot PC. Please try again.')
    }
    return
  }

  try {
    const response = await fetchWithTimeout(`${API_URL}/pcs/${pcId}/reboot`, {
      method: 'POST',
    })
    await handleResponse(response)
  } catch (error) {
    console.error('Error rebooting PC:', error)
    throw new Error('Failed to reboot PC. Please try again.')
  }
}

export const sendTask = async (pcId: string, task: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    try {
      await simulateApiCall({ success: true })
      console.log(`Mock task sent to PC ${pcId}: ${task}`)
    } catch (error) {
      console.error('Error sending mock task:', error)
      throw new Error('Failed to send task. Please try again.')
    }
    return
  }

  try {
    const response = await fetchWithTimeout(`${API_URL}/pcs/${pcId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    })
    await handleResponse(response)
  } catch (error) {
    console.error('Error sending task:', error)
    throw new Error('Failed to send task. Please try again.')
  }
}