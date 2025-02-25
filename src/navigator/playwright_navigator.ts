import {BrowserContext, chromium, Locator, Page} from "playwright";
import {INavigator} from "./navigator";
import {selectors} from "./selectors";

const userDataDir = './chrome_profile'; // Change this to your Chrome profile path
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'; // macOS Chrome path

class PlaywrightNavigator implements INavigator {
    private browser: BrowserContext
    private page: Page
    private messages_url: string

    async init(messages_url: string) {
        this.browser = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            executablePath: chromePath, // Use system-installed Chrome
            viewport: { width: 500, height: 812 }, // Mobile-like viewport
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.77 Mobile Safari/537.36'
        })
        this.page = await this.browser.newPage()
        this.messages_url = messages_url
    }

    private async closeNavigator() {
        await this.browser.close()
    }

    private async navigateToMessages() {
        await this.page.goto(this.messages_url)
    }

    private async getUnreadMessageLocator(unread_message_locator: string): Promise<Locator | null> {
        // search for unread messages
        console.log("Looking for unread messages.")
        const unreadMessage = this.page.locator(unread_message_locator);
        const firstUnreadMessage = unreadMessage.first()

        if (await firstUnreadMessage.count() <= 0) {
            console.log("No unread messages found.");
            await this.closeNavigator()
            return null
        }

        return firstUnreadMessage
    }

    async getMostRecentUnreadChatHistory(): Promise<string[] | null> {
        await this.navigateToMessages();
        const locator = await this.getUnreadMessageLocator(selectors.UNREAD_MESSAGE_SELECTOR)
        if (!locator) {
            return null
        }
        await locator.click()
        return await this.page.locator(selectors.MESSAGE_BODY_SELECTOR).allTextContents()
    }

    async respondToChat(message: string): Promise<void> {
        console.log('Filling the reply textarea.');
        await this.page.locator(selectors.REPLY_TEXT_AREA).fill(message);

        console.log('Clicking the send button.');
        await this.page.locator(selectors.REPLY_BUTTON).first().click();
    }
}

export {PlaywrightNavigator};