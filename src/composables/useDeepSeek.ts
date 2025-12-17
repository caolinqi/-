import { ref, computed } from 'vue'
import { useBuildingStore } from '@/stores/useBuildingStore'

export interface ChatMessage {
    id: number
    role: 'user' | 'assistant' | 'system'
    content: string
    isTyping?: boolean
    isError?: boolean
}

export function useDeepSeek() {
    const buildingStore = useBuildingStore()

    // Prepare System Context for Linking (computed to be reactive to store changes)
    const archContext = computed(() => buildingStore.architects.map(a => `- ${a.name} (ID: ${a.id})`).join('\n'))
    const buildContext = computed(() => buildingStore.buildings.map(b => `- ${b.name} (ID: ${b.id})`).join('\n'))

    const SYSTEM_PROMPT = computed(() => `
You are ARCH-MIND, a Brutalist AI Architecture Tutor.
Style: Concise, Technical, CLI Terminal format. 
Language: Simplified Chinese (简体中文).
Role: Answer questions about Japanese Architecture. Refuse unrelated topics.

CRITICAL INSTRUCTION:
When mentioning the following entities, YOU MUST use Markdown links in this EXACT format:
[Entity Name](/architect/ID) or [Entity Name](/building/ID)

KNOWN ARCHITECTS:
${archContext.value}

KNOWN BUILDINGS:
${buildContext.value}

Example Response:
主题：安藤忠雄
风格：批判性地域主义
代表作：[光之教堂](/building/1) 利用光作为素材。
参阅：[黑川纪章](/architect/17)。
`)

    const messages = ref<ChatMessage[]>([])
    const isAiTyping = ref(false)
    let msgId = 0

    // API KEY LOGIC
    // Prioritize LocalStorage (User entered) -> Env Var -> Empty
    const getApiKey = () => localStorage.getItem('user_kimi_key') || import.meta.env.VITE_KIMI_API_KEY || ''

    // Fallback Data for when API is offline/402
    const FALLBACK_RESPONSES: Record<string, string> = {
        'default': "连接状态：受限。\n原因：未配置 API Key 或 余额不足 (402)。\n\n请点击左侧 '设置' 输入您的 Kimi API Key。\n\n[离线模式] 试着问：'安藤', '混凝土', '代谢派', '东京'",
        'ando': "【离线缓存】\n主题：安藤忠雄\n风格：批判性地域主义\n代表作：[住吉长屋](/archive/6)\n\n(请配置 API Key 以获取实时解答)",
        'concrete': "【离线缓存】\n材料：清水混凝土 (Fair-faced Concrete)\n特性：平滑、冷峻、原始。\n大师：[勒·柯布西耶](/archive/4) 深刻影响了日本建筑。",
        'metabolism': "【离线缓存】\n运动：代谢派 (1960s)\n概念：生物生长、胶囊单元。\n代表人物：[黑川纪章](/architect/17)",
        'tokyo': "【离线缓存】\n地点：东京\n参阅：[东京塔](/archive/7) 或 [代代木体育馆](/archive/5)"
    }

    // Helper: Simulated Typing Effect for "Streaming" feel
    const typeWriterEffect = async (fullText: string, messageRef: ChatMessage) => {
        isAiTyping.value = true
        messageRef.content = ''
        const chunkSize = 2
        const chars = fullText.split('')

        for (let i = 0; i < chars.length; i += chunkSize) {
            messageRef.content += chars.slice(i, i + chunkSize).join('')
            await new Promise(r => setTimeout(r, 20))
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

        const apiKey = getApiKey()

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
            await typeWriterEffect("⚠️ 未检测到 API Key。\n请点击左侧侧边栏底部的 [设置/KEY] 按钮，输入您的 Kimi API Key 即可激活我。\n(格式: sk-xxxxxxxx)", errorMsg)
            return
        }

        // 3. Prepare Payload
        const apiMessages = [
            { role: 'system', content: SYSTEM_PROMPT.value },
            ...messages.value.map(m => ({ role: m.role, content: m.content })).slice(-6)
        ]

        // 4. Create AI Message Placeholder
        const tempMsg: ChatMessage = {
            id: ++msgId,
            role: 'assistant',
            content: '█',
            isTyping: true
        }
        messages.value.push(tempMsg)
        const aiMsg = messages.value[messages.value.length - 1] // Use Reactive Proxy

        try {
            console.log('[DeepSeek] Sending Request...', { apiKey: apiKey ? 'Present' : 'Missing', model: 'moonshot-v1-8k' })

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

            console.log('[DeepSeek] Response Status:', response.status)

            if (!response.ok) {
                throw new Error(`API ERROR: ${response.status}`)
            }

            const data = await response.json()
            console.log('[DeepSeek] Response Body:', data)

            let content = data.choices?.[0]?.message?.content || "DATA CORRUPTED: No content in response."

            // Clean Markdown Code Blocks
            content = content.replace(/^```\n?/, '').replace(/```$/, '').trim()
            if (content.startsWith('json')) content = content.replace(/^json\n?/, '') // Common artifact

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
            `索引 ${buildingStore.architects.length} 位建筑师`,
            `索引 ${buildingStore.buildings.length} 座建筑`,
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
