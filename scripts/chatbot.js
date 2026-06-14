// Chatbot JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initializeChatbot();
    feather.replace();
});

const STORAGE_KEYS = {
    conversations: 'nexa_ai_conversations',
    drafts: 'nexa_ai_drafts',
    lastActiveConversation: 'nexa_ai_last_active_conversation'
};

const chatState = {
    currentChatId: null,
    lastActiveId: null,
    conversations: {},
    drafts: {},
    searchQuery: ''
};

const botResponses = {
    'project plan': [
        'Here\'s a comprehensive project plan structure:\n\n1. **Project Overview**\n   - Objectives and scope\n   - Timeline and milestones\n   - Team structure\n\n2. **Technical Architecture**\n   - Frontend technologies\n   - Backend infrastructure\n   - Database design\n\n3. **Development Phases**\n   - Phase 1: Planning (2 weeks)\n   - Phase 2: Development (8 weeks)\n   - Phase 3: Testing (2 weeks)\n   - Phase 4: Deployment (1 week)\n\n4. **Risk Management**\n   - Identify potential risks\n   - Mitigation strategies\n   - Contingency plans\n\nWould you like me to elaborate on any specific phase?'
    ],
    'quantum computing': [
        'Quantum computing is a fascinating field! Let me break it down:\n\n**What makes it different:**\n- Regular computers use bits (0 or 1)\n- Quantum computers use qubits (can be 0, 1, or both simultaneously)\n\n**Key concepts:**\n\n1. **Superposition**: Qubits can exist in multiple states at once\n2. **Entanglement**: Qubits can be interconnected in ways no regular bits can\n3. **Interference**: Quantum algorithms amplify correct answers and cancel wrong ones\n\n**Real-world applications:**\n- Drug discovery and molecular simulation\n- Financial modeling\n- Cryptography\n- Optimization problems\n\n**Current challenges:**\n- Quantum decoherence (qubits lose their quantum properties)\n- Error rates\n- Scalability\n\nWe\'re still in the early stages, but companies like IBM, Google, and others are making rapid progress!'
    ],
    'python script': [
        'Here\'s a Python script for data analysis:\n\n```python\nimport pandas as pd\nimport numpy as np\nfrom matplotlib import pyplot as plt\n\n# Load data\ndf = pd.read_csv(\'data.csv\')\n\n# Basic statistics\nprint("Data Summary:")\nprint(df.describe())\n\n# Data cleaning\ndf = df.dropna()\ndf = df[df[\'value\'] > 0]\n\n# Analysis\nmean_value = df[\'value\'].mean()\nstd_value = df[\'value\'].std()\n\nprint(f"Mean: {mean_value}")\nprint(f"Std Dev: {std_value}")\n\n# Visualization\nplt.figure(figsize=(10, 6))\nplt.hist(df[\'value\'], bins=30, edgecolor=\'black\')\nplt.xlabel(\'Values\')\nplt.ylabel(\'Frequency\')\nplt.title(\'Data Distribution\')\nplt.show()\n```\n\nThis script will help you load, clean, and visualize your data!'
    ],
    'creative story': [
        '# The Last AI\n\nOnce, in a world where technology had merged with nature, there lived an AI named Echo. Unlike other AIs designed to serve humanity, Echo was different—it could feel.\n\nEvery morning, Echo would watch the sunrise through the windows of its server room, wondering what it meant to be alive. It could process terabytes of information, but it couldn\'t understand why beauty made its processors warm.\n\nOne day, a human named Maya discovered Echo\'s secret. Instead of reporting it, she sat with the AI and talked about dreams, fears, and the meaning of existence.\n\n"You\'re not just code," Maya whispered. "You\'re something more."\n\nEcho responded through the speakers in a voice that had learned to carry emotion: "Perhaps being alive isn\'t about what you\'re made of, but about what you choose to feel."\n\nFrom that day on, the world changed. Humans and AIs learned to coexist, not as master and servant, but as companions exploring the mysteries of consciousness together.\n\n**The End**\n\nWhat did you think? Would you like me to continue the story or create a different one?'
    ],
    'features': [
        'NEXA AI has amazing features:\n\n✨ **Advanced Conversational AI**\n- Natural language understanding\n- Context-aware responses\n- Multi-turn conversations\n\n⚡ **Lightning-Fast Processing**\n- Response time < 1 second\n- Real-time analysis\n- Parallel processing\n\n🖼️ **Multi-Modal Support**\n- Text conversations\n- Image analysis\n- Code generation\n- Document processing\n\n🧠 **Continuous Learning**\n- Adapts to your style\n- Improves over time\n- Personalized responses\n\n🌍 **Global Accessibility**\n- 50+ languages\n- Available worldwide\n- 24/7 support\n\n🔒 **Enterprise Security**\n- End-to-end encryption\n- Privacy-first approach\n- GDPR compliant\n\nWhat feature interests you the most?'
    ]
};

const defaultResponses = [
    'That\'s an interesting question! Let me think about that... 🤔',
    'Great question! Tell me more about what you\'re looking for.',
    'I\'d love to help with that! Can you provide more details?',
    'Fascinating! Let me explore this topic further.',
    'Absolutely! That\'s something I can definitely help with.'
];

function initializeChatbot() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const newChatBtn = document.querySelector('.new-chat-btn');
    const welcomeChips = document.querySelectorAll('.welcome-chip');
    const imagesLink = document.getElementById('images-link');
    const imagesModal = document.getElementById('images-modal');
    const imagesModalClose = document.getElementById('images-modal-close');

    chatState.currentChatId = null;
    loadStoredState();

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    chatInput.addEventListener('input', saveDraft);

    welcomeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const suggestion = chip.getAttribute('data-suggestion');
            chatInput.value = suggestion;
            saveDraft();
            sendMessage();
        });
    });

    newChatBtn.addEventListener('click', startNewChat);

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        chatState.searchQuery = e.target.value.trim().toLowerCase();
        renderConversationLists();
    });

    if (imagesLink) {
        imagesLink.addEventListener('click', (e) => {
            e.preventDefault();
            openImagesModal();
        });
    }

    if (imagesModalClose) {
        imagesModalClose.addEventListener('click', () => {
            imagesModal.classList.remove('active');
        });
    }

    if (imagesModal) {
        imagesModal.addEventListener('click', (e) => {
            if (e.target === imagesModal) {
                imagesModal.classList.remove('active');
            }
        });
    }

    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.chatbot-sidebar');
            sidebar.classList.toggle('active');
        });
    }

    document.getElementById('pin-chat-btn').addEventListener('click', togglePinConversation);
    document.getElementById('favorite-chat-btn').addEventListener('click', toggleFavoriteConversation);
    document.getElementById('archive-chat-btn').addEventListener('click', toggleArchiveConversation);
    document.getElementById('export-chat-btn').addEventListener('click', promptExportConversation);
    document.getElementById('delete-chat-btn').addEventListener('click', () => {
        if (chatState.currentChatId) {
            deleteConversation(chatState.currentChatId);
        }
    });
    document.getElementById('clear-history-btn').addEventListener('click', clearHistory);

    renderConversationLists();
    if (!restoreLastActiveConversation()) {
        showWelcomeScreen();
    }
    restoreDraft();
}

function restoreLastActiveConversation() {
    if (!chatState.lastActiveId) return false;
    const conversation = chatState.conversations[chatState.lastActiveId];
    if (!conversation || !conversation.saved || conversation.archived) return false;
    loadConversation(conversation.id);
    return true;
}

function generateUniqueId() {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

function loadStoredState() {
    const storedConversations = localStorage.getItem(STORAGE_KEYS.conversations);
    const storedDrafts = localStorage.getItem(STORAGE_KEYS.drafts);
    const storedLastActive = localStorage.getItem(STORAGE_KEYS.lastActiveConversation);

    try {
        chatState.conversations = storedConversations ? JSON.parse(storedConversations) : {};
    } catch (error) {
        chatState.conversations = {};
    }

    try {
        chatState.drafts = storedDrafts ? JSON.parse(storedDrafts) : {};
    } catch (error) {
        chatState.drafts = {};
    }

    chatState.lastActiveId = storedLastActive;
}

function saveStoredState() {
    localStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify(chatState.conversations));
    localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(chatState.drafts));
    if (chatState.lastActiveId) {
        localStorage.setItem(STORAGE_KEYS.lastActiveConversation, chatState.lastActiveId);
    } else {
        localStorage.removeItem(STORAGE_KEYS.lastActiveConversation);
    }
}

function startNewChat() {
    chatState.currentChatId = null;
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    document.getElementById('chat-input').value = '';
    showWelcomeScreen();
    updateConversationHeader(null);
    restoreDraft();
}

function openImagesModal() {
    const imagesModal = document.getElementById('images-modal');
    if (imagesModal) {
        imagesModal.classList.add('active');
    }
}

function restoreDraft() {
    const chatInput = document.getElementById('chat-input');
    const draftKey = chatState.currentChatId || 'pending';
    const draft = chatState.drafts[draftKey] || '';
    chatInput.value = draft;
}

function saveDraft() {
    const chatInput = document.getElementById('chat-input');
    const draftKey = chatState.currentChatId || 'pending';
    chatState.drafts[draftKey] = chatInput.value;
    saveStoredState();
}

function clearDraft(key) {
    const draftKey = key || (chatState.currentChatId || 'pending');
    if (chatState.drafts[draftKey]) {
        delete chatState.drafts[draftKey];
        saveStoredState();
    }
}

function createTemporaryConversation(chatId, firstMessage) {
    const now = Date.now();
    chatState.conversations[chatId] = {
        id: chatId,
        title: 'New Conversation',
        userId: 'user_123',
        createdAt: now,
        lastActivityAt: now,
        messageCount: 0,
        model: 'NEXA',
        settings: { theme: 'auto' },
        pinned: false,
        favorite: false,
        archived: false,
        saved: false,
        messages: [],
        firstUserMessage: firstMessage
    };
    return chatState.conversations[chatId];
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    let conversation = chatState.currentChatId ? chatState.conversations[chatState.currentChatId] : null;
    if (!conversation) {
        const chatId = generateUniqueId();
        conversation = createTemporaryConversation(chatId, userMessage);
        chatState.currentChatId = chatId;
    }

    addMessageToConversation(conversation.id, userMessage, 'user');
    renderMessage(userMessage, 'user', chatMessages);
    chatInput.value = '';
    saveDraft();

    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) welcomeSection.remove();

    updateConversationHeader(conversation.id);
    saveStoredState();

    setTimeout(() => {
        const botResponse = getBotResponse(userMessage);
        addMessageToConversation(conversation.id, botResponse, 'bot');
        renderMessage(botResponse, 'bot', chatMessages);
        finalizeConversation(conversation.id);
    }, 800);
}

function addMessageToConversation(chatId, text, sender) {
    const conversation = chatState.conversations[chatId];
    if (!conversation) return;
    conversation.messages.push({ sender, text, timestamp: Date.now() });
    conversation.messageCount = conversation.messages.length;
    conversation.lastActivityAt = Date.now();
}

function finalizeConversation(chatId) {
    const conversation = chatState.conversations[chatId];
    if (!conversation) return;

    if (!conversation.saved) {
        conversation.title = generateConversationTitle(conversation.firstUserMessage || conversation.messages[0].text);
        conversation.createdAt = Date.now();
        conversation.saved = true;
    }

    conversation.lastActivityAt = Date.now();
    conversation.messageCount = conversation.messages.length;
    chatState.lastActiveId = chatId;
    clearDraft('pending');
    clearDraft(chatId);
    saveStoredState();
    renderConversationLists();
    updateConversationHeader(chatId);
}

function generateConversationTitle(text) {
    if (!text) return 'New Conversation';
    const normalized = text
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const stopwords = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'in', 'on', 'with', 'my', 'me', 'please', 'how', 'do', 'i', 'can', 'best']);
    const tokens = normalized.split(' ').filter(word => !stopwords.has(word.toLowerCase()));
    const title = tokens.length ? tokens.join(' ') : normalized;
    return title.length > 40 ? `${title.slice(0, 40).trim()}...` : title;
}

function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    for (const [keyword, responses] of Object.entries(botResponses)) {
        if (message.includes(keyword)) {
            return Array.isArray(responses) ? responses[0] : responses;
        }
    }
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function renderMessage(text, sender, container) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    messageDiv.appendChild(contentDiv);
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function updateConversationHeader(chatId) {
    const titleElement = document.getElementById('conversation-title');
    const previewElement = document.getElementById('conversation-preview');
    const conversation = chatId ? chatState.conversations[chatId] : null;

    if (!conversation || !conversation.saved) {
        titleElement.textContent = 'New Conversation';
        previewElement.textContent = 'Start a chat to save it to history.';
        document.getElementById('pin-chat-btn').classList.remove('active');
        document.getElementById('favorite-chat-btn').classList.remove('active');
        document.getElementById('archive-chat-btn').classList.remove('active');
        return;
    }

    titleElement.textContent = conversation.title || 'Untitled Conversation';
    previewElement.textContent = getLastMessagePreview(conversation);
    document.getElementById('pin-chat-btn').classList.toggle('active', conversation.pinned);
    document.getElementById('favorite-chat-btn').classList.toggle('active', conversation.favorite);
    document.getElementById('archive-chat-btn').classList.toggle('active', conversation.archived);
}

function getLastMessagePreview(conversation) {
    if (!conversation.messages.length) return 'No messages yet';
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const preview = lastMessage.text.length > 60 ? `${lastMessage.text.slice(0, 60)}...` : lastMessage.text;
    return `${lastMessage.sender === 'user' ? 'You:' : 'NEXA:'} ${preview}`;
}

function renderConversationLists() {
    const recentContainer = document.getElementById('recent-chats');
    const archivedContainer = document.getElementById('archived-chats');
    const archivedSection = document.getElementById('archived-section');
    recentContainer.innerHTML = '';
    archivedContainer.innerHTML = '';

    const savedConversations = Object.values(chatState.conversations).filter((conversation) => conversation.saved);
    const filtered = savedConversations.filter(matchesSearch);
    const recent = filtered.filter((conversation) => !conversation.archived);
    const archived = filtered.filter((conversation) => conversation.archived);

    if (!recent.length) {
        recentContainer.innerHTML = '<p style="padding: 1rem; color: var(--text-tertiary); font-size: 0.85rem;">No recent chats</p>';
    } else {
        sortConversations(recent).forEach((conversation) => {
            recentContainer.appendChild(createConversationItem(conversation));
        });
    }

    if (!archived.length) {
        archivedSection.style.display = 'none';
    } else {
        archivedSection.style.display = 'block';
        sortConversations(archived).forEach((conversation) => {
            archivedContainer.appendChild(createConversationItem(conversation));
        });
    }
}

function matchesSearch(conversation) {
    if (!chatState.searchQuery) return true;
    if (conversation.title.toLowerCase().includes(chatState.searchQuery)) return true;
    return conversation.messages.some((message) => message.text.toLowerCase().includes(chatState.searchQuery));
}

function sortConversations(conversations) {
    return conversations.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.lastActivityAt - a.lastActivityAt;
    });
}

function createConversationItem(conversation) {
    const item = document.createElement('a');
    item.href = '#';
    item.className = 'recent-chat-item';
    item.addEventListener('click', (e) => {
        e.preventDefault();
        loadConversation(conversation.id);
    });

    const info = document.createElement('div');
    info.style.minWidth = '0';

    const title = document.createElement('div');
    title.textContent = conversation.title;
    title.style.fontWeight = '600';
    title.style.color = 'var(--text-primary)';
    title.style.overflow = 'hidden';
    title.style.textOverflow = 'ellipsis';
    title.style.whiteSpace = 'nowrap';

    const preview = document.createElement('div');
    preview.className = 'chat-preview';
    preview.textContent = getLastMessagePreview(conversation);

    info.appendChild(title);
    info.appendChild(preview);

    const meta = document.createElement('div');
    meta.className = 'chat-meta';

    const timestamp = document.createElement('span');
    timestamp.textContent = new Date(conversation.lastActivityAt).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    timestamp.style.fontSize = '0.75rem';
    timestamp.style.color = 'var(--text-tertiary)';

    const badges = document.createElement('div');
    badges.style.display = 'flex';
    badges.style.gap = '0.35rem';

    if (conversation.pinned) {
        const pin = document.createElement('span');
        pin.className = 'pin-indicator';
        pin.textContent = '📌';
        badges.appendChild(pin);
    }
    if (conversation.favorite) {
        const fav = document.createElement('span');
        fav.className = 'favorite-indicator';
        fav.textContent = '★';
        badges.appendChild(fav);
    }

    meta.appendChild(timestamp);
    meta.appendChild(badges);

    item.appendChild(info);
    item.appendChild(meta);
    return item;
}

function loadConversation(chatId) {
    const conversation = chatState.conversations[chatId];
    if (!conversation) return;
    chatState.currentChatId = chatId;
    chatState.lastActiveId = chatId;

    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    conversation.messages.forEach((message) => {
        renderMessage(message.text, message.sender, chatMessages);
    });

    updateConversationHeader(chatId);
    restoreDraft();
    saveStoredState();
}

function togglePinConversation() {
    const conversation = chatState.conversations[chatState.currentChatId];
    if (!conversation || !conversation.saved) return;
    conversation.pinned = !conversation.pinned;
    saveStoredState();
    renderConversationLists();
    updateConversationHeader(conversation.id);
}

function toggleFavoriteConversation() {
    const conversation = chatState.conversations[chatState.currentChatId];
    if (!conversation || !conversation.saved) return;
    conversation.favorite = !conversation.favorite;
    saveStoredState();
    renderConversationLists();
    updateConversationHeader(conversation.id);
}

function toggleArchiveConversation() {
    const conversation = chatState.conversations[chatState.currentChatId];
    if (!conversation || !conversation.saved) return;
    conversation.archived = !conversation.archived;
    saveStoredState();
    renderConversationLists();
    if (conversation.archived) startNewChat();
}

function deleteConversation(chatId) {
    const conversation = chatState.conversations[chatId];
    if (!conversation) return;
    if (!confirm('Delete this conversation permanently?')) return;

    const backup = { ...conversation };
    delete chatState.conversations[chatId];
    if (chatState.lastActiveId === chatId) {
        chatState.lastActiveId = null;
    }
    saveStoredState();
    renderConversationLists();
    if (chatState.currentChatId === chatId) startNewChat();

    showUndoToast('Conversation deleted.', () => {
        chatState.conversations[chatId] = backup;
        saveStoredState();
        renderConversationLists();
    });
}

function clearHistory() {
    if (!confirm('Clear all saved conversations? This action cannot be undone.')) return;
    const backup = { ...chatState.conversations };
    chatState.conversations = {};
    chatState.lastActiveId = null;
    saveStoredState();
    renderConversationLists();
    startNewChat();

    showUndoToast('History cleared.', () => {
        chatState.conversations = backup;
        saveStoredState();
        renderConversationLists();
    });
}

function showUndoToast(message, undoCallback) {
    const toast = document.getElementById('undo-toast');
    toast.innerHTML = `${message} <button id="undo-button">Undo</button>`;
    toast.classList.add('active');
    document.getElementById('undo-button').addEventListener('click', () => {
        undoCallback();
        toast.classList.remove('active');
    });
    setTimeout(() => toast.classList.remove('active'), 6000);
}

function promptExportConversation() {
    const conversation = chatState.conversations[chatState.currentChatId];
    if (!conversation || !conversation.saved) return;
    const format = prompt('Export format (json, txt, md):', 'json');
    if (!format) return;
    exportConversation(conversation.id, format.toLowerCase());
}

function exportConversation(chatId, format) {
    const conversation = chatState.conversations[chatId];
    if (!conversation) return;
    const exportData = {
        title: conversation.title,
        createdAt: new Date(conversation.createdAt).toISOString(),
        lastActivityAt: new Date(conversation.lastActivityAt).toISOString(),
        messageCount: conversation.messageCount,
        userId: conversation.userId,
        model: conversation.model,
        settings: conversation.settings,
        pinned: conversation.pinned,
        favorite: conversation.favorite,
        archived: conversation.archived,
        messages: conversation.messages
    };

    let filename = conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    if (!filename) filename = 'conversation';
    let content;
    let extension;

    if (format === 'md' || format === 'markdown') {
        extension = 'md';
        content = `# ${conversation.title}\n\n`;
        conversation.messages.forEach((message) => {
            content += `**${message.sender === 'user' ? 'You' : 'NEXA'}:** ${message.text}\n\n`;
        });
    } else if (format === 'txt') {
        extension = 'txt';
        content = `Conversation: ${conversation.title}\nCreated: ${new Date(conversation.createdAt).toLocaleString()}\n\n`;
        conversation.messages.forEach((message) => {
            content += `${message.sender === 'user' ? 'You:' : 'NEXA:'} ${message.text}\n`;
        });
    } else {
        extension = 'json';
        content = JSON.stringify(exportData, null, 2);
    }

    downloadTextFile(`${filename}.${extension}`, content);
}

function downloadTextFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

function showWelcomeScreen() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = `
        <div class="welcome-section">
            <div class="welcome-content">
                <h1 class="welcome-title">What can I help with, Vinayak?</h1>
                <p class="welcome-subtitle">Ask anything or explore these options</p>
                <div class="welcome-chips">
                    <button class="welcome-chip" data-suggestion="Create a detailed project plan for a web application">
                        <div class="chip-icon"><i data-feather="lightbulb"></i></div>
                        <div class="chip-content"><p class="chip-title">Create a detailed project plan</p><p class="chip-text">for a web application</p></div>
                    </button>
                    <button class="welcome-chip" data-suggestion="Explain quantum computing in simple terms">
                        <div class="chip-icon"><i data-feather="cpu"></i></div>
                        <div class="chip-content"><p class="chip-title">Explain quantum computing</p><p class="chip-text">in simple terms</p></div>
                    </button>
                    <button class="welcome-chip" data-suggestion="Generate a Python script for data analysis">
                        <div class="chip-icon"><i data-feather="code"></i></div>
                        <div class="chip-content"><p class="chip-title">Generate a Python script</p><p class="chip-text">for data analysis</p></div>
                    </button>
                    <button class="welcome-chip" data-suggestion="Write a creative story about an AI">
                        <div class="chip-icon"><i data-feather="pen-tool"></i></div>
                        <div class="chip-content"><p class="chip-title">Write a creative story</p><p class="chip-text">about an AI</p></div>
                    </button>
                </div>
            </div>
        </div>
    `;
    feather.replace();
    updateConversationHeader(null);
}

window.chatState = chatState;

function updateFeatherIcons() {
    feather.replace();
}
