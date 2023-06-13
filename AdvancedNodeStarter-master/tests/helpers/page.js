const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    constructor(page) {
        this.page = page;
    }

    static async build () {
        const browser = await puppeteer.launch({
            headless: false,
        });

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function (target, property) {
                return customPage[property] || browser[property] || page[property];
            }
        });
    }

    async login () {
        // Given
        const user = await userFactory()
        const { session, sig } = sessionFactory(user);

        // Set Cookies & Refresh the page
        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto('http://localhost:3000');

        // Wait page load
        await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf (selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }
}

module.exports = CustomPage;
