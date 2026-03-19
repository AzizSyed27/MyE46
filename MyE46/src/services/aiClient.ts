export interface AIChatPayload {
    messages: { role: 'user' | 'assistant'; content: string }[]
    currentBuild: Record<string, string | number>
}

export interface StreamCallbacks {
    onChunk: (text: string) => void
    onError: (error: string) => void
    onDone: (fullText: string) => void
}

/**
 * Send a chat request to the server and stream the response.
 * Returns an abort controller so the caller can cancel the stream.
 */
export function streamChat(
    payload: AIChatPayload,
    callbacks: StreamCallbacks
): AbortController {
    const controller = new AbortController()

    ;(async () => {
        let accumulated = ''

        try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal,
        })

        if (!res.ok) {
            const errorBody = await res.text()
            callbacks.onError(`Server error (${res.status}): ${errorBody}`)
            return
        }

        if (!res.body) {
            callbacks.onError('No response body received')
            return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })

            // Process complete SSE lines
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
            const trimmed = line.trim()

            if (!trimmed || !trimmed.startsWith('data: ')) continue

            const dataStr = trimmed.slice(6)

            if (dataStr === '[DONE]') continue

            try {
                const parsed = JSON.parse(dataStr)
                if (parsed.text) {
                accumulated += parsed.text
                callbacks.onChunk(parsed.text)
                }
            } catch {
                // Partial or malformed chunk — skip
            }
            }
        }

        callbacks.onDone(accumulated)
        } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') {
            callbacks.onDone(accumulated)
            return
        }
        callbacks.onError((err as Error).message || 'Unknown error')
        }
    })()

    return controller
}