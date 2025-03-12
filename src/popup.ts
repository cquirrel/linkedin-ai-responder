import {OpenAIAgent} from "./core/agent/impl/openai_agent";
import {BrowserWindow} from "./core/navigator/impl/window";

function saveSettings(settings: Record<string, any>) {
    chrome.storage.sync.set(settings, () => {
        if (chrome.runtime.lastError) {
            console.error("Error setting storage:", chrome.runtime.lastError);
        } else {
            console.log("Settings saved");
        }
    });
}

function loadSettings(callback: (settings: Record<string, any>) => void) {
    chrome.storage.sync.get(null, (items) => {
        if (chrome.runtime.lastError) {
            console.error("Error getting storage:", chrome.runtime.lastError);
        } else {
            callback(items);
        }
    });
}

function initSettings() {
    const settingsButton = document.getElementById("show-settings")
    const closeSettingsButton = document.getElementById("close-settings")
    const settingsContainer = document.getElementById("settings-container")
    const resultContainer = document.getElementById("result-container")

    settingsContainer.style.display = "none"

    settingsButton.addEventListener("click", () => {
        settingsContainer.style.display = 'flex';
        resultContainer.style.display = 'none';
    })

    closeSettingsButton.addEventListener("click", () => {
        settingsContainer.style.display = 'none';
        resultContainer.style.display = 'flex';
    })

    // listen for changes in form elements
    const openAIKey = document.getElementById("openai-key") as HTMLInputElement
    const systemPrompt = document.getElementById("system-prompt") as HTMLTextAreaElement

    openAIKey.addEventListener("change", () => {
        saveSettings({"key": openAIKey.value});
    })

    systemPrompt.addEventListener("change", () => {
        saveSettings({"prompt": systemPrompt.value});
    })

    loadSettings((items) => {
        openAIKey.value = items["key"]
        systemPrompt.innerText = items["prompt"] || ""
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const runButton = document.getElementById("run") as HTMLButtonElement
    const copyButton = document.getElementById("copy")

    const spinner = document.getElementById('spinner')
    const llmResult = document.getElementById("llm-result") as HTMLTextAreaElement

    initSettings();

    let llmApiKey = ""
    let systemPrompt = ""
    loadSettings((items) => {
        llmApiKey = items["key"]
        systemPrompt = items["prompt"] || ""
    })

    runButton.addEventListener("click", async () => {
        runButton.disabled = true;
        spinner.style.display = 'block';

        const agent = new OpenAIAgent(llmApiKey, systemPrompt)
        const navigator = new BrowserWindow()

        const chat_history = await navigator.getMessages()

        console.log("Calling LLM for next message")
        const result = await agent.call(chat_history)

        console.log("LLM result", result)
        llmResult.innerHTML = result

        runButton.disabled = false;
        spinner.style.display = 'none';
    })

    copyButton.addEventListener("click", async () => {
        console.log(llmResult.innerText)
        await navigator.clipboard.writeText(llmResult.value)
    })
});