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
    // When
    const text = await page.getContentsOf('a.brand-logo');

    // Then
    expect(text).toEqual('Blogster');
})


test('clicking login starts oauth flow', async () => {
    // When
    await page.click('.right a');
    const url = await page.url();

    // Then
    expect(url).toMatch(/accounts\.google\.com/);
})

test('when signed in, shows logout button', async () => {
    // Given
    await page.login();

    // When
    const logoutText = await page.getContentsOf('a[href="/auth/logout"]');

    // Then
    expect(logoutText).toEqual('Logout')
})
