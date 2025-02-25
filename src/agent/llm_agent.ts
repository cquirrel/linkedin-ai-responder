interface LLMAgent {
    init(systemPrompt: string): Promise<void>;
    call(chatHistoryMessages: string[]): Promise<LLMAgentResult>
}

interface LLMAgentResult {
    action: "respond_chat" | "send_notification"
    message: string
    interview_params?: {
        recruiter_name?: string,
        recruiter_hiring_company?: string
    }
}

export {LLMAgent, LLMAgentResult}