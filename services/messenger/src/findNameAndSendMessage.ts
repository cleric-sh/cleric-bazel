import * as puppeteer from "puppeteer";

export async function findNameAndSendMessage(page: puppeteer.Page, search: puppeteer.ElementHandle, name: string, message: string) {

    const send = false;

    await search.click({ clickCount: 3});
    await search.type(name);

    const conversation = await page.waitForSelector(`span[title="${name}" i]`);
    if (!conversation) throw `Couldn't find conversation element.`
    await conversation.click();

    const prompt = await page.waitForSelector('#main footer div[contentEditable="true"]');
    if (!prompt) throw `Couldn't find prompt element.`

    await prompt.type(message);
    if(send) await prompt.press("Enter");

    let sent = true;
    
    while (!sent) {
        await new Promise(resolve => setTimeout(resolve, 50));

        const last = await page.waitForSelector('div[aria-label^="Message list."] > div:last-child');
        if (!last) throw `Couldn't find last message element.`
        const messageSpan = await last.$('span.selectable-text span');
        const lastMessage = await messageSpan?.evaluate(el => el.textContent);

        if (lastMessage === message) sent = true;
    }

    if(!send) {
        await prompt.click({ clickCount: 3});
        await prompt.press('Backspace');
    }
}