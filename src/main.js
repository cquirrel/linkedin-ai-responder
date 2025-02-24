import 'dotenv/config'
import {agent_call} from "./agent.js";
import {get_browser, close_browser} from "./browser.js";
import {send_notification} from "./notifier.js";

const browser = await get_browser()
const page = await browser.newPage();

while (true) {
    await page.goto('https://www.linkedin.com/messaging');

    // search for unread messages
    console.log("Looking for unread messages.")
    const unreadMessage = await page.locator('[aria-label*="unread message"]');
    const firstUnreadMessage = await unreadMessage.first()
    if (!await firstUnreadMessage.isVisible()) {
        console.log("No unread messages found.");
        await close_browser(browser)
        break
    }

    await firstUnreadMessage.click();

    console.log("Looking for messages.")
    const chat_history = await page.locator('.message-body').allTextContents();

    const [action, content] = await agent_call(chat_history)
    if (action === "send_mail") {
        console.log("Sending email.");
        await send_notification(JSON.stringify(content))
        continue
    }

    if (action !== "respond_chat") {
        // something unexpected
        process.exit(1)
    }

    console.log('Filling the reply textarea.');
    await page.locator('#messaging-reply').fill(content);

    console.log('Clicking the send button.');
    await page.locator('.message-send').first().click();
}

console.log("Exiting.");