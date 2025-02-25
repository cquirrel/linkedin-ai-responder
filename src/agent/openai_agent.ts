import OpenAI from "openai";
import {LLMAgent, LLMAgentResult} from "./llm_agent";

class OpenAIAgent implements LLMAgent {
    private openai: OpenAI;
    private systemMessage: string

    async init(systemMessage: string) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.systemMessage = systemMessage
    }

    async call(chatHistoryMessages: string[]): Promise<LLMAgentResult> {
        // Join the messages with a separator
        const chat_history = chatHistoryMessages.join("\n=====\n");

        const response = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {role: "system", content: this.systemMessage},
                {role: "user", content: chat_history},
            ],
            response_format: {
                "type": "text"
            },
            tools: [{
                type: "function",
                function: {
                    description: "Schedule an online meeting/chat to continue the with interviewing process.",
                    name: "book_meeting",
                    parameters: {
                        type: "object",
                        properties: {
                            recruiter_name: {
                                type: "string",
                                description: "Name of the IT recruiter"
                            },
                            company_name: {
                                type: "string",
                                description: "Name of the company of the IT recruiter"
                            }
                        }
                    }
                }
            }],
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        const choice = response.choices[0]
        switch (choice.finish_reason) {
            case "stop":
                return {
                    action: "respond_chat",
                    message: choice.message.content
                }
            case "tool_calls":
                return {
                    action: "send_notification",
                    message: "",
                    interview_params: {} //TODO
                }
            default:
                console.error("No stop/tool_calls finish reason")
                console.error(JSON.stringify(chatHistoryMessages, null, 4))
                console.error(JSON.stringify(response, null, 4));
                throw new Error("Unsupported finish_reason")
        }
    }
}

export {OpenAIAgent}