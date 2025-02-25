interface LLMAgent {
    init(systemPrompt: string): Promise<void>;
    call(chatHistoryMessages: string[]): Promise<LLMAgentResult>
}

interface LLMAgentResult {
    action: "message" | "function_call"
    message: string
    functionCalls: {
        name: string,
        arguments: string // must be json parsed
    }[]
}

export {LLMAgent, LLMAgentResult}