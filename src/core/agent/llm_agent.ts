interface LLMAgent {
    call(chatHistoryMessages: string[]): Promise<String>
}

export {LLMAgent}