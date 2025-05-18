import { useState, useEffect } from 'react'
import Duck from './components/duck/duck'
import Chat from './components/chat/chat'
import './assets/main.css'

function App(): React.JSX.Element {
  const [isChat, setIsChat] = useState(false)

  useEffect(() => {
    // Check if this window should display the chat interface
    // based on the URL hash (#chat)
    const checkIfChatMode = (): void => {
      setIsChat(window.location.hash === '#chat')
    }

    // Check initially
    checkIfChatMode()

    // Listen for hash changes (though not needed in this specific implementation)
    window.addEventListener('hashchange', checkIfChatMode)

    return () => window.removeEventListener('hashchange', checkIfChatMode)
  }, [])

  // Render either the chat interface or the duck based on the mode
  return isChat ? (
    <Chat />
  ) : (
    <div className="app-container">
      <Duck />
    </div>
  )
}

export default App
