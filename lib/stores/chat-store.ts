import { create } from 'zustand'

interface ChatState {}

const useChatStore = create<ChatState>((set) => ({}))

export default useChatStore
