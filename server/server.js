import express from 'express'
import dotenv from 'dotenv'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { buildSystemPrompt } from './systemPrompt.js'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())

// Resolve dist path
const distPath = resolve(__dirname, '..', 'dist')
const cwdDistPath = resolve(process.cwd(), 'dist')
const finalDistPath = existsSync(distPath) ? distPath : cwdDistPath

console.log('Using dist path:', finalDistPath, '| exists:', existsSync(finalDistPath))

// Serve built frontend in production
app.use(express.static(finalDistPath))

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in .env')
  process.exit(1)
}

/**
 * Convert our chat messages to Gemini's format.
 * Our format:  [{ role: 'user'|'assistant', content: string }]
 * Gemini format: [{ role: 'user'|'model', parts: [{ text: string }] }]
 */
function toGeminiMessages(messages) {
  return messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))
}

app.post('/api/chat', async (req, res) => {
  const { messages, currentBuild } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  if (!currentBuild || typeof currentBuild !== 'object') {
    return res.status(400).json({ error: 'currentBuild object is required' })
  }

  const systemPrompt = buildSystemPrompt(currentBuild)

  const geminiBody = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: toGeminiMessages(messages),
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 8192,
    },
  }

  try {
    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    })

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text()
      console.error('Gemini API error:', geminiRes.status, errorText)
      return res.status(geminiRes.status).json({
        error: 'Gemini API error',
        details: errorText,
      })
    }

    // Stream the SSE response back to the client
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

    const reader = geminiRes.body.getReader()
    const decoder = new TextDecoder()

    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Process complete SSE lines from the buffer
      const lines = buffer.split('\n')
      // Keep the last potentially incomplete line in the buffer
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()

        // Skip empty lines and non-data lines
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        const dataStr = trimmed.slice(6) // Remove "data: " prefix

        // Skip "[DONE]" sentinel
        if (dataStr === '[DONE]') continue

        try {
          const parsed = JSON.parse(dataStr)
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text

          if (text) {
            // Forward as SSE to the client
            res.write(`data: ${JSON.stringify({ text })}\n\n`)
          }
        } catch {
          // Ignore malformed JSON chunks — partial data is normal in SSE
        }
      }
    }

    // Signal end of stream
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    console.error('Server error:', err)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' })
    } else {
      res.end()
    }
  }
})

// SPA fallback — all non-API routes serve the React app
app.get('/{*path}', (req, res) => {
  const indexPath = join(finalDistPath, 'index.html')
  if (existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(500).send(
      `index.html not found at ${indexPath}\n` +
      `cwd: ${process.cwd()}\n` +
      `distPath exists: ${existsSync(distPath)}\n` +
      `cwdDistPath exists: ${existsSync(cwdDistPath)}`
    )
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`MyE46 API server running on http://localhost:${PORT}`)
})