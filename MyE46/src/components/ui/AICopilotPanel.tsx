import { useState, useRef, useEffect } from 'react'
import AIChatMessage from './AIChatMessage'
import type { ChatMessage } from './AIChatMessage'
import './AICopilotPanel.css'

interface AICopilotPanelProps {
    isOpen: boolean
    onToggle: () => void
    messages: ChatMessage[]
    isLoading: boolean
    onSend: (message: string) => void
    onApply: (messageId: string) => void
    onRevert: (messageId: string) => void
}

const STARTER_PROMPTS = [
    'Build me an aggressive street car under $4000',
    'I want a clean OEM+ daily driver',
    'Make it track-ready with full M3 styling',
    'Give me a stealthy all-black build',
    'What would you change to make this more aggressive?',
    'Suggest a color combo that turns heads',
]

export default function AICopilotPanel({
    isOpen,
    onToggle,
    messages,
    isLoading,
    onSend,
    onApply,
    onRevert,
}: AICopilotPanelProps) {
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-scroll to bottom on new messages or streaming updates
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [isOpen])

    const handleSend = () => {
        const trimmed = input.trim()
        if (!trimmed || isLoading) return
        onSend(trimmed)
        setInput('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
        }
    }

    if (!isOpen) {
        return (
        <button className="ai-panel-toggle" onClick={onToggle} title="Open AI Garage">
            <span className="ai-panel-toggle-icon">AI</span>
        </button>
        )
    }

    return (
        <aside className="ai-panel">
        <header className="ai-panel-header">
            <div className="ai-panel-header-left">
            <span className="ai-panel-header-icon">AI</span>
            <div>
                <h2 className="ai-panel-title">AI Garage</h2>
                <p className="ai-panel-subtitle">Your E46 build advisor</p>
            </div>
            </div>
            <button className="ai-panel-close" onClick={onToggle} title="Close">
            ✕
            </button>
        </header>

        <div className="ai-panel-messages">
            {messages.length === 0 && !isLoading && (
            <div className="ai-panel-welcome">
                <p className="ai-panel-welcome-text">
                Describe the build you want and I'll configure it for you in real time.
                </p>
                <div className="ai-panel-starters">
                {STARTER_PROMPTS.map((prompt) => (
                    <button
                    key={prompt}
                    className="ai-panel-starter"
                    onClick={() => onSend(prompt)}
                    >
                    {prompt}
                    </button>
                ))}
                </div>
            </div>
            )}

            {messages.map((msg) => (
            <AIChatMessage
                key={msg.id}
                message={msg}
                onApply={() => onApply(msg.id)}
                onRevert={() => onRevert(msg.id)}
            />
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="ai-panel-thinking">
                <div className="ai-panel-thinking-avatar">AI</div>
                <div className="ai-panel-thinking-dots">
                <span /><span /><span />
                </div>
            </div>
            )}

            <div ref={messagesEndRef} />
        </div>

        <div className="ai-panel-input-area">
            <input
            ref={inputRef}
            className="ai-panel-input"
            placeholder={isLoading ? 'Thinking…' : 'Describe your dream build…'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            />
            <button
            className="ai-panel-send"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            >
            Send
            </button>
        </div>
        </aside>
    )
}