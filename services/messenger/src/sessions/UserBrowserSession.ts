import {UserBrowserPersistence} from "./UserBrowserPersistence";
import * as puppeteer from "puppeteer";
import {Browser, Page} from "puppeteer";

export class UserBrowserSession {

    private readonly persistence: UserBrowserPersistence;
    private browser?: Browser;

    private pages = new Map<string, Page>();

    constructor(private readonly user: string) {
        this.persistence = new UserBrowserPersistence(user);
    }

    async ensureLoaded() {
        if (!this.browser) {

            await this.persistence.tryLoad();

            this.browser = await puppeteer.launch({
                product: "chrome",
                headless: false,
                // Save cookies and session information.
                userDataDir: this.persistence.userDataDir,
                executablePath: process.env.CHROME_EXECUTABLE_PATH,
                args: [
                    // Required for Docker version of Puppeteer
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    // This will write shared memory files into /tmp instead of /dev/shm,
                    // because Docker’s default for /dev/shm is 64MB
                    // '--disable-dev-shm-usage'
                ]
            });
        }
    }

    async getPage(id: string) {
        await this.ensureLoaded();
        const browser = this.browser!;

        const [firstPage] = await browser.pages();

        if (!this.pages.has(id)) {

            if (this.pages.size == 0) {
                this.pages.set(id, firstPage);
                return firstPage;
            }
            const newPage = await browser.newPage();
            this.pages.set(id, newPage)
            return newPage;
        }

        return this.pages.get(id)!;
    }

    async persist() {
        await this.persistence.save();
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = undefined;

            if(process.env.NODE_ENV == 'development') {
                await this.persistence.save();
                await this.persistence.clear();
            }
        }
    }
}