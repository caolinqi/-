<template>
  <div class="ai-tutor-container">
    <!-- CRT SCANLINE & GLOW -->
    <div class="crt-overlay"></div>
    
    <!-- HEADER -->
    <div class="terminal-header">
        <div class="status-light" :class="{ blink: isAiTyping }"></div>
        <div class="header-title">ARCH-MIND [KIMI]</div>
        <div class="chips-row">
            <button class="chip" @click="sendChip('安藤忠雄是谁？')">#安藤</button>
            <button class="chip" @click="sendChip('什么是代谢派？')">#代谢派</button>
            <button class="chip" @click="sendChip('东京有哪些著名建筑？')">#东京</button>
        </div>
    </div>

    <!-- CHAT AREA -->
    <div class="chat-viewport" ref="chatContainer">
        <div 
            v-for="msg in messages" 
            :key="msg.id" 
            class="msg-line"
            :class="[msg.role, { error: msg.isError }]"
        >
            <span class="prompt">{{ msg.role === 'user' ? '>' : '#' }}</span>
            <!-- Render Markdown-like links -->
            <span class="content" v-html="parseLinks(msg.content)"></span>
            <span v-if="msg.isTyping" class="cursor-block">█</span>
        </div>
    </div>

    <!-- INPUT AREA -->
    <div class="input-line">
        <span class="input-prompt">></span>
        <input 
            type="text" 
            v-model="userInput" 
            @keyup.enter="handleSend"
            placeholder="ACCESS ARCHIVE..." 
            :disabled="isAiTyping"
            ref="inputRef"
            autofocus
        />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDeepSeek } from '@/composables/useDeepSeek'

const { messages, isAiTyping, processQuery, bootSequence } = useDeepSeek()
const userInput = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const router = useRouter()

const parseLinks = (text: string) => {
    let safeText = text // Text is coming from trusted AI or User input. Basic validation only.
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/\n/g, '<br>')
    
    // Replace [Text](Link) with specific span
    return safeText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
        return `<a href="${url}" class="terminal-link" onclick="event.preventDefault(); window.navigateSpa('${url}')">${label}</a>`
    })
}

onMounted(() => {
    (window as any).navigateSpa = (path: string) => {
        router.push(path)
    }
    bootSequence()
})

const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}

watch(messages, () => {
    scrollToBottom()
}, { deep: true })

const handleSend = () => {
    if (!userInput.value.trim() || isAiTyping.value) return
    processQuery(userInput.value)
    userInput.value = ''
    scrollToBottom()
}

const sendChip = (text: string) => {
    if(isAiTyping.value) return
    processQuery(text)
}

</script>

<style lang="scss">
/* Not scoped to allow global anchor styling from v-html */
.terminal-link {
    color: #fff;
    text-decoration: underline;
    font-weight: bold;
    cursor: pointer;
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;

    &:hover {
        background: #fff;
        color: #000;
        box-shadow: 0 0 10px #fff;
    }
}
</style>

<style scoped lang="scss">
.ai-tutor-container {
    height: 100%;
    background: #000;
    color: #00ff00; /* Classic Terminal Green */
    font-family: 'JetBrains Mono', monospace; 
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    border: 1px solid #333;
}

/* CRT EFFECTS */
.crt-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 50;
    opacity: 0.3;
}

.terminal-header {
    background: #111;
    padding: 10px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #333;
    gap: 15px;
}

.status-light {
    width: 10px;
    height: 10px;
    background: #00ff00;
    border-radius: 50%;
    &.blink { animation: blink 0.5s infinite; }
}

@keyframes blink {
    50% { opacity: 0; }
}

.header-title {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: #00ff00;
}

.chips-row {
    margin-left: auto;
    display: flex;
    gap: 8px;
}

.chip {
    background: #222;
    border: 1px solid #444;
    color: #888;
    font-family: inherit;
    font-size: 0.7rem;
    padding: 2px 8px;
    cursor: pointer;
    text-transform: uppercase;
    &:hover { background: #00ff00; color: #000; }
}

.chat-viewport {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    font-size: 0.9rem;
    /* Custom Scrollbar */
    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-thumb { background: #333; }
}

.msg-line {
    margin-bottom: 15px;
    line-height: 1.6;
    display: flex;
    gap: 10px;
    
    .prompt {
        opacity: 0.5;
        flex-shrink: 0;
    }

    &.user { color: #fff; }
    &.assistant { color: #00ff00; text-shadow: 0 0 5px rgba(0,255,0,0.4); }
    &.error { color: #ff0000; }
}

.cursor-block {
    display: inline-block;
    animation: blink 1s step-end infinite;
}

.input-line {
    display: flex;
    align-items: center;
    padding: 15px;
    border-top: 1px solid #333;
    background: #050505;
    
    .input-prompt { margin-right: 10px; color: #00ff00; animation: blink 2s infinite; }
    
    input {
        flex: 1;
        background: transparent;
        border: none;
        color: #fff;
        font-family: inherit;
        font-size: 1rem;
        outline: none;
        
        &::placeholder { color: #333; font-style: italic; }
        &:disabled { cursor: wait; opacity: 0.5; }
    }
}
</style>
