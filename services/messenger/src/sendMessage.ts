import {findNameAndSendMessage} from "./findNameAndSendMessage";
import {race} from "./utils/race";
import {Page} from "puppeteer";
import {NETWORK_PRESETS} from "./utils/NETWORK_PRESETS";
import {UserBrowserSession} from "./sessions/UserBrowserSession";

async function ensureUrl(page: Page, url: string) {
    const _url = url.replace(/\/$/, '');
    const currentUrl = page.url().replace(/\/$/, '');
    if(currentUrl !== _url) {
        console.log('Navigating to:', url);
        await page?.goto(url, { waitUntil: "networkidle2" })
    };
}

export async function sendMessage(session: UserBrowserSession, name: string, message: string) {

    const page = await session.getPage('whatsapp');

    const simulateLag = false;

    if (simulateLag) {
        // Connect to Chrome DevTools
        const client = await page.target().createCDPSession();

        // Set throttling property
        await client.send('Network.emulateNetworkConditions', NETWORK_PRESETS.GPRS);
    }

    await ensureUrl(page, 'https://web.whatsapp.com');

    const [index, selector] = await race([
        page.waitForSelector(`#side div[contentEditable="true"]`),
        page.waitForSelector(`canvas[aria-label="Scan me!"]`),
    ]);

    if (!selector) throw 'Unable to initialized WhatsApp in browser before timing out. Timeout is 30s.';

    if (index === 0) {
        await findNameAndSendMessage(page, selector, name, message);
        return {
            outcome: 'Success'
        }
    }

    if (index === 1) {
        const qr = await selector.screenshot({
            encoding: 'base64',
            type: 'jpeg',
        });

        await new Promise(resolve => setTimeout(resolve, 5000));

        return {
            outcome: 'NeedAuthentication',
            qr
        }
    }
}

