import React, { useState, useRef, useEffect } from 'react'
import './Chat.css'
import paw from '../../assets/paw.svg'

const Chat: React.FC = () => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`
    }
  }, [message])

  // Resize window when content changes
  useEffect(() => {
    if (chatContainerRef.current && window.electron) {
      // We've set min/max height constraints in the main process,
      // so we don't need to do anything else here
      // If we wanted to implement explicit resizing:
      // const chatHeight = chatContainerRef.current.scrollHeight
      // window.electron.ipcRenderer.send('resize-chat-window', chatHeight)
    }
  }, [message])

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault()

    if (!message.trim()) return

    // Clear input field
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="chat-container" ref={chatContainerRef}>
      {/* Input area with button on the right */}
      <div className="prompt-field-container">
        <div className="prompt-field">
          <textarea
            ref={textareaRef}
            placeholder="Converse com o Pato..."
            className="prompt-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
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
              aria-label="Enviar mensagem"
            >
              <img src={paw} alt="Enviar" className="send-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
