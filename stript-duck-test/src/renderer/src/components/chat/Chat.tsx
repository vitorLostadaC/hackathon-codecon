import React, { useState, useEffect, useRef } from 'react'
import './Chat.css'

interface ChatProps {
  onSendMessage: (message: string) => void
}

const Chat: React.FC<ChatProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'duck'; text: string }>>([
    { sender: 'duck', text: "Quack! I'm here to help. What's on your mind?" }
  ])
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault()

    if (!message.trim()) return

    // Add user message to chat history
    setChatHistory([...chatHistory, { sender: 'user', text: message }])

    // Send message to main process
    onSendMessage(message)

    // Clear input field
    setMessage('')

    // Simulate duck response (in a real app, this would come from the main process)
    setTimeout(() => {
      // Random duck response
      const responses = [
        "Quack! That's interesting!",
        "I'm thinking about it...",
        'Have you tried debugging that?',
        'Maybe you need a break - go for a walk!',
        'Quack quack! (That means I agree!)',
        'Let me help you think through this problem...'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatHistory((prev) => [...prev, { sender: 'duck', text: randomResponse }])
    }, 1000)
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src="../../assets/duck.gif" alt="Duck" className="chat-duck-icon" />
        <h2>Chat with Duck</h2>
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat
