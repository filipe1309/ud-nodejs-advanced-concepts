const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
})

afterEach(async () => {
    await page.close()
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
    const user = await userFactory()
    const { session, sig } = sessionFactory(user);

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
