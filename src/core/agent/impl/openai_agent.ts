import {LLMAgent, LLMAgentResult} from "../llm_agent";

class OpenAIAgent implements LLMAgent {

    constructor(private apiKey: string, private systemMessage: string) {}

    async call(chatHistoryMessages: string[]): Promise<string> {
        // Join the messages with a separator
        const chat_history = chatHistoryMessages.join("\n=====\n");

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: this.systemMessage },
                    { role: "user", content: chat_history }
                ],
                temperature: 1,
                max_tokens: 2048,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            })
        });

        const json = await response.json();
        console.log(json);

        return json.choices[0].message.content
    }
}

export {OpenAIAgent}