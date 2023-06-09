const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
})

afterEach(async () => {
    await browser.close()
})

test('the header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
})


test('clicking login starts oauth flow', async () => {
    await page.click('.right a');
    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
})

test('when signed in, shows logout button', async () => {
    // Given
    const id = '647bed57d921dabd5b19c77f';

    const { session, sig } = sessionFactory({ _id: id });

    // Set Cookies & Refresh the page
    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('http://localhost:3000');

    // Wait page load
    await page.waitFor('a[href="/auth/logout"]');

    // When
    const logoutText = await page
        .$eval('a[href="/auth/logout"]', el => el.innerHTML);

    // Then
    expect(logoutText).toEqual('Logout')
})
