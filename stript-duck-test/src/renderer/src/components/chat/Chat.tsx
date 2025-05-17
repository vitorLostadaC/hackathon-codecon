import React, { useState, useRef, useEffect } from 'react'
import './Chat.css'
import paw from '../../assets/paw.svg'

interface Message {
  id: number
  text: string
  sender: 'user' | 'duck'
}

interface ChatProps {
  onSendMessage: (message: string) => void
}

const Chat: React.FC<ChatProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`
    }
  }, [message])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault()

    if (!message.trim()) return

    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user'
    }

    setMessages((prev) => [...prev, newUserMessage])

    // Send message to main process
    onSendMessage(message)

    // Add a mock response from the duck (this would normally come from your backend)
    setTimeout(() => {
      const duckResponse: Message = {
        id: Date.now() + 1,
        text: 'Quack! Estou pensando na sua pergunta...',
        sender: 'duck'
      }
      setMessages((prev) => [...prev, duckResponse])
    }, 500)

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
    <div className="chat-container">
      {/* Chat messages area */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.sender}`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

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
