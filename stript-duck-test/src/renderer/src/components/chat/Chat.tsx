import React, { useState } from 'react'
import './Chat.css'

interface ChatProps {
  onSendMessage: (message: string) => void
}

const Chat: React.FC<ChatProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('')

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault()

    if (!message.trim()) return

    // Send message to main process
    onSendMessage(message)

    // Clear input field
    setMessage('')
  }

  return (
    <div className="chat-container">
      <div className="prompt-field-container">
        <div className="prompt-field">
          <textarea
            placeholder="Ask Duck..."
            className="prompt-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
          />

          <div className="prompt-actions">
            <button
              className={`icon-button ${!message.trim() ? 'disabled' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                if (message.trim()) handleSendMessage(e as React.FormEvent)
              }}
              disabled={!message.trim()}
            >
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
