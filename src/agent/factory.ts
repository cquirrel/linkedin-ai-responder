import {LLMAgent} from "./llm_agent";
import {OpenAIAgent} from "./openai_agent";

function getLLMAgent(type: "openai"): LLMAgent {
    switch (type) {
        case "openai":
            return new OpenAIAgent()
        default:
            throw new Error("Navigator not supported")
    }
}

export {getLLMAgent}