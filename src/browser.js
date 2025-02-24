import {chromium} from "playwright";

const userDataDir = './chrome_profile'; // Change this to your Chrome profile path
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'; // macOS Chrome path

async function get_browser() {
    return await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        executablePath: chromePath, // Use system-installed Chrome
        viewport: { width: 500, height: 812 }, // Mobile-like viewport
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.77 Mobile Safari/537.36'
    });
}

async function close_browser(browser) {
    await browser.close();
}

export {get_browser, close_browser}