import {INavigator} from "../navigator";

class BrowserWindow implements INavigator {

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

    async getTabId(): Promise<number | null> {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true})
        if (tabs.length <= 0) {
            return null
        }
        return tabs[0].id
    }
}

export {BrowserWindow};