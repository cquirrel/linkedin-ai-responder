import {LLMAgent} from "./llm_agent";
import {OpenAIAgent} from "./openai_agent";
import {readFileSync} from "fs";

function getLLMAgent(type: "openai"): LLMAgent {
    switch (type) {
        case "openai":
            return new OpenAIAgent()
        default:
            throw new Error("Navigator not supported")
    }
}

function getSystemPrompt(): string {
    if (!process.env.JOB_OFFER_VALUE_IN_EUROS || !process.env.JOB_OFFER_VALUE_IN_EUROS) {
        throw new Error("Missing environment variables")
    }

    try {
        return readFileSync("system_prompt.txt", 'utf8')
            .replace("JOB_OFFER_VALUE_IN_EUROS", process.env.JOB_OFFER_VALUE_IN_EUROS)
            .replace("JOB_OFFER_VALUE_IN_EUROS_K", process.env.JOB_OFFER_VALUE_IN_EUROS);
    } catch (err) {
        throw new Error("Error reading the file")
    }
}

export {getLLMAgent, getSystemPrompt}