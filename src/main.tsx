import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'

console.log('main.tsx: Script started')

// Add global error handlers
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

const rootElement = document.getElementById('root')
console.log('main.tsx: Root element:', rootElement)

if (rootElement) {
  try {
    console.log('main.tsx: Attempting to render App')
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    )
    console.log('main.tsx: App rendered successfully')
  } catch (error) {
    console.error('Error rendering the app:', error)
    rootElement.innerHTML = '<div style="color: red; padding: 20px;">An error occurred while rendering the app. Please check the console for more details.</div>'
  }
} else {
  console.error('Root element not found')
}

console.log('main.tsx: Script finished')