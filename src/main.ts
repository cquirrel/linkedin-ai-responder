import 'dotenv/config'
import {sendNotification} from "./notification/notifier.js";
import {getNavigator} from "./navigator/factory";
import {readFileSync} from "fs";
import {getLLMAgent} from "./agent/factory";

function load_system_prompt() {
    try {
        return readFileSync("system_prompt.txt", 'utf8');
    } catch (err) {
        console.error('Error reading the file:', err);
        process.exit(1)
    }
}

function getSystemPrompt() {
    if (!process.env.JOB_OFFER_VALUE_IN_EUROS || !process.env.JOB_OFFER_VALUE_IN_EUROS) {
        console.error("Missing environment variables")
        process.exit(1)
    }

    return load_system_prompt()
        .replace("JOB_OFFER_VALUE_IN_EUROS", process.env.JOB_OFFER_VALUE_IN_EUROS)
        .replace("JOB_OFFER_VALUE_IN_EUROS_K", process.env.JOB_OFFER_VALUE_IN_EUROS);
}

async function main() {
    const messages_url = 'https://www.linkedin.com/messaging'
    const navigator = getNavigator("playwright")
    await navigator.init(messages_url)

    const system_message = getSystemPrompt();
    const llmAgent = getLLMAgent("openai")
    await llmAgent.init(system_message)

    while (true) {
        const chat_history = await navigator.getMostRecentUnreadChatHistory()
        if (!chat_history || chat_history.length === 0) {
            console.log("No unread messages found.")
            break
        }

        const result = await llmAgent.call(chat_history)
        switch (result.action) {
            case "respond_chat":
                await navigator.respondToChat(result.message); break
            case "send_notification":
                await sendNotification("New interview!"); break
            default:
                throw new Error("Unsupported operation")
        }
    }
}

(async () => {
    await main();
    console.log("Exiting.");
})()