import {INavigator} from "../navigator";

class BrowserWindow implements INavigator {
    async init(messages_url: string): Promise<void> {
        return Promise.resolve();
    }

    async getMessages(): Promise<string[] | null> {
        const tabId = await this.getTabId();
        const a = await chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: () => {
                return [...document.getElementsByClassName("msg-s-event-listitem__body")].map(el => el.textContent)
            }
        })

        return a[0].result
    }

    async respondToChat(message: string): Promise<void> {
        const tabId = await this.getTabId();
        await chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: () => {
                const textArea = document.getElementsByClassName("msg-form__contenteditable")[0]
                textArea.textContent = message
            }
        })
    }

    async closeSession(): Promise<void> {
        return Promise.resolve()
    }

    async getTabId(): Promise<number | null> {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true})
        if (tabs.length <= 0) {
            return null
        }
        return tabs[0].id
    }
}

export {BrowserWindow};