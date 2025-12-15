
import { ref } from 'vue'
import { architects } from '@/data/architects'
import { buildings } from '@/data/buildings'

export interface ChatMessage {
    id: number
    role: 'user' | 'assistant' | 'system'
    content: string
    isTyping?: boolean
    isError?: boolean
}

// Prepare System Context for Linking
const archContext = architects.map(a => `- ${a.name} (ID: ${a.id})`).join('\n')
const buildContext = buildings.map(b => `- ${b.name} (ID: ${b.id})`).join('\n')

const SYSTEM_PROMPT = `
You are ARCH-MIND, a Brutalist AI Architecture Tutor.
Style: Concise, Technical, CLI Terminal format. 
Language: Simplified Chinese (简体中文).
Role: Answer questions about Japanese Architecture. Refuse unrelated topics.

CRITICAL INSTRUCTION:
When mentioning the following entities, YOU MUST use Markdown links in this EXACT format:
[Entity Name](/architect/ID) or [Entity Name](/building/ID)

KNOWN ARCHITECTS:
${archContext}

KNOWN BUILDINGS:
${buildContext}

Example Response:
主题：安藤忠雄
风格：批判性地域主义
代表作：[光之教堂](/building/1) 利用光作为素材。
参阅：[黑川纪章](/architect/17)。
`

export function useDeepSeek() {
    const messages = ref<ChatMessage[]>([])
    const isAiTyping = ref(false)
    let msgId = 0
    // Use Kimi API Key
    const apiKey = import.meta.env.VITE_KIMI_API_KEY || ''

    // Fallback Data for when API is offline/402
    const FALLBACK_RESPONSES: Record<string, string> = {
        'default': "连接状态：受限。\nAPI错误：402 (余额不足)。\n\n切换至本地缓存模式...\n请尝试查询：'安藤', '混凝土', '代谢派', '东京'",
        'ando': "主题：安藤忠雄 (本地缓存)\n风格：批判性地域主义\n代表作：[住吉长屋](/archive/6)\n\n(API 配额耗尽 - 显示缓存条目)",
        'concrete': "材料：清水混凝土 (Fair-faced Concrete)\n特性：平滑、冷峻、原始。\n大师：[勒·柯布西耶](/archive/4) 深刻影响了日本建筑。",
        'metabolism': "运动：代谢派 (1960s)\n概念：生物生长、胶囊单元。\n代表人物：[黑川纪章](/architect/17)",
        'tokyo': "地点：东京\n参阅：[东京塔](/archive/7) 或 [代代木体育馆](/archive/5)"
    }

    // Helper: Simulated Typing Effect for "Streaming" feel
    const typeWriterEffect = async (fullText: string, messageRef: ChatMessage) => {
        isAiTyping.value = true
        messageRef.content = ''
        // Faster typing for AI
        const chunkSize = 2
        const chars = fullText.split('')

        for (let i = 0; i < chars.length; i += chunkSize) {
            messageRef.content += chars.slice(i, i + chunkSize).join('')
            await new Promise(r => setTimeout(r, 20)) // ~20ms delay
        }

        messageRef.isTyping = false
        isAiTyping.value = false
    }

    const processQuery = async (text: string) => {
        // 1. Add User Message
        messages.value.push({
            id: ++msgId,
            role: 'user',
            content: text
        })

        isAiTyping.value = true

        // 2. Check API Key
        if (!apiKey) {
            await new Promise(r => setTimeout(r, 1000))
            const errorMsg: ChatMessage = {
                id: ++msgId,
                role: 'assistant',
                content: '',
                isTyping: true,
                isError: true
            }
            messages.value.push(errorMsg)
            await typeWriterEffect("错误: 找不到 VITE_KIMI_API_KEY。\n请在 .env 文件中配置。\n系统正在切换到离线模式。", errorMsg)
            return
        }

        // 3. Prepare Payload
        const apiMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.value.map(m => ({ role: m.role, content: m.content })).slice(-6) // Keep context context small
        ]

        // 4. Create AI Message Placeholder
        const aiMsg: ChatMessage = {
            id: ++msgId,
            role: 'assistant',
            content: '█',
            isTyping: true
        }
        messages.value.push(aiMsg)

        try {
            // Using local proxy to avoid CORS (Kimi)
            const response = await fetch('/api/kimi/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'moonshot-v1-8k',
                    messages: apiMessages,
                    stream: false,
                    max_tokens: 500
                })
            })

            if (!response.ok) {
                throw new Error(`API ERROR: ${response.status}`)
            }

            const data = await response.json()
            const content = data.choices[0]?.message?.content || "DATA CORRUPTED."

            await typeWriterEffect(content, aiMsg)

        } catch (error: any) {
            // Graceful Fallback for 402 or Network Error
            console.error(error)

            let fallbackText = FALLBACK_RESPONSES['default']
            const lowerText = text.toLowerCase()

            if (lowerText.includes('ando') || lowerText.includes('安藤')) fallbackText = FALLBACK_RESPONSES['ando']
            else if (lowerText.includes('concrete') || lowerText.includes('混凝土')) fallbackText = FALLBACK_RESPONSES['concrete']
            else if (lowerText.includes('metabolism') || lowerText.includes('代谢')) fallbackText = FALLBACK_RESPONSES['metabolism']
            else if (lowerText.includes('tokyo') || lowerText.includes('东京')) fallbackText = FALLBACK_RESPONSES['tokyo']

            aiMsg.content = ""
            // Typing effect for fallback
            await typeWriterEffect(fallbackText, aiMsg)

            if (error.message.includes('402')) {
                aiMsg.isError = true // Keep it green but maybe warn? Or just standard text.
            }
        }
    }

    const bootSequence = async () => {
        isAiTyping.value = true
        const bootMsg: ChatMessage = {
            id: ++msgId,
            role: 'assistant',
            content: '',
            isTyping: true
        }
        messages.value.push(bootMsg)

        const lines = [
            '系统初始化...',
            '加载建筑数据库...',
            `索引 ${architects.length} 位建筑师`,
            `索引 ${buildings.length} 座建筑`,
            'ARCH-MIND 已上线。',
            '等待输入 >'
        ]

        for (const line of lines) {
            bootMsg.content += line + '\n'
            await new Promise(r => setTimeout(r, 200))
        }

        bootMsg.isTyping = false
        isAiTyping.value = false
    }

    return {
        messages,
        isAiTyping,
        processQuery,
        bootSequence
    }
}
