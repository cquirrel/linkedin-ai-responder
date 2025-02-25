import 'dotenv/config'
import {sendNotification} from "./notification/notifier.js";
import {getNavigator} from "./navigator/factory";
import {getLLMAgent, getSystemPrompt} from "./agent/factory";

async function main() {
    const messagesUrl = 'https://www.linkedin.com/messaging'
    const navigator = getNavigator("playwright")
    await navigator.init(messagesUrl)

    const systemPrompt = getSystemPrompt();
    const llmAgent = getLLMAgent("openai")
    await llmAgent.init(systemPrompt)

    while (true) {
        console.log("Looking for unread messages.")
        const chat_history = await navigator.getMostRecentUnreadChatHistory()
        if (!chat_history?.length) {
            console.log("No unread messages found.")
            break
        }

        console.log("Calling LLM for next message")
        const result = await llmAgent.call(chat_history)
        switch (result.action) {
            case "respond_chat":
                console.log("=====\n","Responding to chat:\n", result.message, "\n=====")
                await navigator.respondToChat(result.message);
                break
            case "send_notification":
                console.log("Sending notification.")
                await sendNotification("New interview!");
                break
            default:
                throw new Error("Unsupported operation")
        }
    }

    await navigator.closeSession()
    console.log("Exiting.");
}

(async () => {
    await main();
})()