import './AIChatMessage.css'

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    config?: Record<string, string | number> | null
    isStreaming?: boolean
    isApplied?: boolean
    isReverted?: boolean
}

interface AIChatMessageProps {
    message: ChatMessage
    onApply?: () => void
    onRevert?: () => void
}

export default function AIChatMessage({ message, onApply, onRevert }: AIChatMessageProps) {
    const isUser = message.role === 'user'

    return (
        <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
        {!isUser && (
            <div className="chat-message-avatar">AI</div>
        )}

        <div className="chat-message-body">
            <div className="chat-message-content">
            {message.content}
            {message.isStreaming && (
                <span className="chat-message-cursor" />
            )}
            </div>

            {!isUser && message.config && !message.isStreaming && (
            <div className="chat-message-actions">
                {!message.isReverted && !message.isApplied && (
                <>
                    <span className="chat-message-applied-badge chat-message-applied-badge--auto">
                    Auto-applied
                    </span>
                    <button
                    className="chat-message-action-btn chat-message-action-btn--revert"
                    onClick={onRevert}
                    >
                    Revert
                    </button>
                </>
                )}
                {message.isReverted && (
                <>
                    <span className="chat-message-reverted-badge">Reverted</span>
                    <button
                    className="chat-message-action-btn chat-message-action-btn--apply"
                    onClick={onApply}
                    >
                    Re-apply
                    </button>
                </>
                )}
                {message.isApplied && (
                <span className="chat-message-applied-badge">Applied</span>
                )}
            </div>
            )}
        </div>
        </div>
    )
}