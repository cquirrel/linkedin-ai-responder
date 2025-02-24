import OpenAI from "openai";
import {readFileSync} from 'fs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const system_message = load_system_prompt()
    .replace("JOB_OFFER_VALUE_IN_EUROS", process.env.JOB_OFFER_VALUE_IN_EUROS || "70000")
    .replace("JOB_OFFER_VALUE_IN_EUROSK", process.env.JOB_OFFER_VALUE_IN_EUROSK || "70")

const agent_call = async function (chat_history_messages) {
    // Join the messages with a separator
    const chat_history = chat_history_messages.join("\n=====\n");

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {role: "system", content: system_message},
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
                        string_1: {
                            type: "string",
                            description: "Name of the IT recruiter"
                        },
                        number_2: {
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
            return ["respond_chat", choice.message.content]
        case "tool_calls":
            return ["send_mail", choice.message.tool_calls]
        default:
            return ["unknown", null]
    }
}

function load_system_prompt() {
    try {
        return readFileSync("system_prompt.txt", 'utf8');
    } catch (err) {
        console.error('Error reading the file:', err);
        process.exit(1)
    }
}

export {agent_call}