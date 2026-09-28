/*
 * FILE: MoreValidations.spec.js
 * Mục đích: các kiểm tra nâng cao trên trang https://rahulshettyacademy.com/AutomationPractice/
 * Gồm 3 test case (≈ một file .robot test suite có 3 Test Case):
 *   1. "@Web Popup validations": ẩn/hiện textbox, xử lý alert/confirm, hover, thao tác trong iframe.
 *   2. "Screenshot & Visual comparision": chụp ảnh 1 phần tử và cả trang.
 *   3. "visual": so sánh ảnh chụp trang với ảnh chuẩn đã lưu (visual regression).
 */
   // require(...) ≈ Library trong RF: nạp 'test' (khai báo test case) và 'expect' (assertion).
   // const = biến không gán lại được; let = biến gán lại được.
   const {test,expect} = require('@playwright/test')

// (Đã comment sẵn) Cấu hình chạy các test trong file song song (parallel) hoặc tuần tự,
//   dừng khi 1 test fail (serial).
//test.describe.configure({mode:'parallel'});
//test.describe.configure({mode:'serial'});

// test("tên", async ({page}) => {...}) ≈ một Test Case.
//   async + await: mỗi thao tác trả về Promise nên phải 'await' để chờ xong (RF tự tuần tự).
//   => là cú pháp hàm viết gọn. {page} là fixture: tab trình duyệt Playwright tạo sẵn.
test("@Web Popup validations",async({page})=>
{
    // page.goto ≈ Go To.
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    // (Đã comment sẵn) Ví dụ điều hướng: goBack ≈ Go Back; goForward = tiến lại trang sau.
    // await page.goto("http://google.com");
    // await page.goBack();
    // await page.goForward();
    // toBeVisible() ≈ Element Should Be Visible, nhưng tự chờ/thử lại tới timeout.
    await expect(page.locator("#displayed-text")).toBeVisible();
    // Click nút 'Hide' để ẩn textbox.
    await page.locator("#hide-textbox").click();
    // toBeHidden() ≈ Element Should Not Be Visible (tự chờ).
    await expect(page.locator("#displayed-text")).toBeHidden();
   // (Đã comment sẵn) page.pause() mở Playwright Inspector để debug.
   // await page.pause();
    // page.on('dialog', ...) đăng ký TRƯỚC: mỗi khi có alert/confirm thì tự bấm OK
    //   ≈ Handle Alert  ACCEPT. Nếu muốn bấm Cancel thì dùng dialog.dismiss() (≈ Handle Alert DISMISS).
    //   Mặc định nếu không đăng ký, Playwright tự đóng (dismiss) dialog.
    page.on('dialog',dialog => dialog.accept());
    // Click nút Confirm -> bật hộp thoại confirm, được xử lý bởi dòng trên.
    await page.locator("#confirmbtn").click();
    // hover() ≈ Mouse Over.
    await page.locator("#mousehover").hover();
    // frameLocator("#courses-iframe") trỏ vào iframe ≈ Select Frame,
    //   nhưng không cần Unselect Frame: chỉ locator nào gọi qua framesPage mới tìm trong iframe.
    const framesPage = page.frameLocator("#courses-iframe");
    // :visible = chỉ lấy phần tử đang hiển thị (có nhiều link giống nhau, 1 số bị ẩn).
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
     // textContent() ≈ Get Text: lấy tiêu đề h2 trong iframe.
     const textCheck =await framesPage.locator(".text h2").textContent();
    // split(" ")[1]: cắt theo dấu cách, lấy từ thứ 2 (đếm từ 0) rồi in ra console.
    console.log(textCheck.split(" ")[1]);


})

// Test Case 2: chụp ảnh màn hình.
test("Screenshot & Visual comparision",async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    // Chụp ảnh riêng 1 phần tử ≈ Capture Element Screenshot; lưu file partialScreenshot.png.
    await page.locator('#displayed-text').screenshot({path:'partialScreenshot.png'});
    await page.locator("#hide-textbox").click();
    // Chụp ảnh cả trang ≈ Capture Page Screenshot; lưu file screenshot.png.
    await page.screenshot({path: 'screenshot.png'});
    await expect(page.locator("#displayed-text")).toBeHidden();
});
//screenshot -store -> screenshot -> 
// Test Case 3: visual regression - so sánh ảnh chụp với ảnh chuẩn.
test('visual',async({page})=>
{
    //make payment -when you 0 balance
      await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    // toMatchSnapshot('landing.png'): lần chạy đầu tạo ảnh chuẩn (và báo fail),
    //   các lần sau so từng pixel với ảnh chuẩn; khác thì fail. RF/SeleniumLibrary không có sẵn keyword này.
    expect(await page.screenshot()).toMatchSnapshot('landing.png');

})





