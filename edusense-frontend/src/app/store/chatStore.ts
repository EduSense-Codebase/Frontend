import { create } from 'zustand';

interface ChatState {
    isChatOpen: boolean;
    chatPrompt: string;
    openChat: () => void;
    closeChat: () => void;
    setChatPrompt: (prompt: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    isChatOpen: false,
    chatPrompt: '',
    openChat: () => set({ isChatOpen: true }),
    closeChat: () => set({ isChatOpen: false }),
    setChatPrompt: (prompt) => set({ chatPrompt: prompt, isChatOpen: true }),
}));
