interface LLMAgent {
    call(chatHistoryMessages: string[]): Promise<String>
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