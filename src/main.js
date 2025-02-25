import 'dotenv/config';
import { agent_call } from "./agent.js";
import { get_browser, close_browser } from "./browser.js";
import { send_notification } from "./notifier.js";
async function main() {
    const browser = await get_browser();
    const page = await browser.newPage();
    while (true) {
        await page.goto('https://www.linkedin.com/messaging');
        // search for unread messages
        console.log("Looking for unread messages.");
        const unreadMessage = page.locator('[aria-label*="unread message"]');
        const firstUnreadMessage = unreadMessage.first();
        if (!await firstUnreadMessage.isVisible()) {
            console.log("No unread messages found.");
            await close_browser(browser);
            break;
        }
        await firstUnreadMessage.click();
        console.log("Looking for messages.");
        const chat_history = await page.locator('.message-body').allTextContents();
        const result = await agent_call(chat_history);
        if (result.action === "function_call" && result.function_calls.length <= 0) {
            console.error("No function_calls found.");
            process.exit(1);
        }
        if (result.action === "function_call" && result.function_calls.length > 0 && result.function_calls[0].name === "book_meeting") {
            console.log("Sending notification.");
            await send_notification(JSON.stringify(""));
            continue;
        }
        if (result.action === "respond") {
            console.log('Filling the reply textarea.');
            await page.locator('#messaging-reply').fill(result.message);
            console.log('Clicking the send button.');
            //await page.locator('.message-send').first().click();
        }
    }
}
(async () => { await main(); console.log("Exiting."); })();
