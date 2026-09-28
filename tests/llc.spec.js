/*
 * FILE: llc.spec.js
 * Mục đích: minh hoạ các "special locators" của Playwright (getByLabel, getByPlaceholder,
 *   getByRole, getByText, filter) và cách cấu hình timeout ở nhiều cấp.
 * Trang test: https://rahulshettyacademy.com/angularpractice/
 * Luồng: tick checkbox, chọn radio, chọn giới tính, nhập password, Submit,
 *   kiểm tra thông báo thành công, vào Shop và thêm 'Nokia Edge' vào giỏ.
 * Gồm 2 test case (≈ một file .robot test suite có 2 Test Case):
 *   1. Dùng special locators với timeout ở cấp bước (step level).
 *   2. Cùng luồng nhưng dùng expect với timeout tuỳ chỉnh (slowExpect).
 */

// import { test, expect } from ... ≈ Library trong RF (cú pháp ES module, tương đương require).
import { test, expect } from '@playwright/test';

// test('tên', async ({ page }) => {...}) ≈ một Test Case.
//   async + await: mỗi thao tác trả về Promise nên phải 'await' để chờ xong (RF tự tuần tự).
//   => là cú pháp hàm viết gọn. {page} là fixture: tab trình duyệt Playwright tạo sẵn.
test('Playwright Special locators', async ({ page }) => {
  
    // page.goto ≈ Go To.
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    // getByLabel: tìm control theo text của <label> gắn với nó, rồi click ≈ Select Checkbox.
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    // check() tick chọn radio 'Employed' ≈ Select Radio Button.
    await page.getByLabel("Employed").check();
    // selectOption("Female") trên dropdown có label 'Gender' ≈ Select From List By Label/Value.
    await page.getByLabel("Gender").selectOption("Female");
    // getByPlaceholder: tìm ô theo placeholder; fill ≈ Input Text.
    await page.getByPlaceholder("Password").fill("abc123");
    // getByRole("button", {name}) tìm nút theo tên hiển thị ≈ Click Button  Submit.
    await page.getByRole("button", {name: 'Submit'}).click();
    // isVisible() chỉ trả về true/false, KHÔNG assert và không chờ - dòng này không kiểm tra gì cả.
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    //5 seconds default timeout for expect assertions --{timeout:10000} Step level 
    // Assert thật: toBeVisible với timeout riêng 10 giây cho riêng bước này
    //   (10_000 = 10000 ms; dấu _ chỉ để dễ đọc) ≈ Wait Until Element Is Visible  ...  timeout=10s.
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({ timeout: 10_000 });


    // Click link 'Shop'.
    await page.getByRole("link",{name : "Shop"}).click();
    // Trong các thẻ <app-card>, lọc thẻ chứa 'Nokia Edge' rồi click nút bên trong (Add).
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();

    //locator(css) waitFor()

});


// (Comment sẵn '30seconds'): timeout mặc định cho cả 1 test là 30 giây
//   ≈ [Timeout] của Test Case trong RF.
//30seconds
test('Playwright Test level time out ', async ({ page }) => {
  
    // expect.configure({timeout: 9000}) tạo một 'expect' mới có timeout 9 giây
    //   dùng lại cho nhiều assertion ≈ Set Selenium Timeout nhưng chỉ áp dụng cho biến slowExpect.
    const slowExpect = expect.configure({timeout : 9000});
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("abc123");
  //7 seconds
    // Truyền {timeout: 7000}: bước click này chờ tối đa 7 giây.
    await page.getByRole("button", {name: 'Submit'}).click({timeout: 7000});
    // isVisible() không assert (xem giải thích ở test trên).
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    //5 seconds default timeout for expect assertions --{timeout:10000}- Step level --test level
    // Dùng slowExpect -> assertion chờ tối đa 9 giây.
    await slowExpect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible();


    await page.getByRole("link",{name : "Shop"}).click();
    // toHaveText ≈ Element Text Should Be; kiểm tra tiêu đề trang Shop (có tự chờ tối đa 9s).
    await slowExpect(page.locator(".my-4").first()).toHaveText("Shop Name");
    //2 more
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();


    //locator(css) waitFor()

});