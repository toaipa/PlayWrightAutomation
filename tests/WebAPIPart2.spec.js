/*
 * FILE: WebAPIPart2.spec.js  (≈ một file .robot)
 * Mục đích: đăng nhập qua UI MỘT lần, lưu lại phiên (cookie + localStorage) vào file state.json,
 * rồi các test dùng lại phiên đó nên không phải đăng nhập lại.
 * Luồng: Suite Setup đăng nhập -> lưu state.json -> tạo context mới từ state.json
 *        -> Test 1: mua 'ZARA COAT 3', đặt hàng, kiểm tra đơn trong lịch sử; Test 2: chỉ mở trang và in tên sản phẩm.
 * RF: SeleniumLibrary không có sẵn chức năng này (phải tự Get Cookies / Add Cookie).
 */
//Login UI  -> .json

//test browser-> .json , cart-,order, orderdetails,orderhistory
// require = nạp thư viện (≈ Library). const {a, b} = lấy riêng test (khai báo test) và expect (assert).
const { test, expect } = require('@playwright/test');
// let = biến gán lại được; giữ phiên đã đăng nhập để các test dùng chung (≈ Set Suite Variable).
let webContext;

// test.beforeAll ≈ Suite Setup. async ({ browser }) => {...} là arrow function; {browser} = fixture trình duyệt Playwright cấp sẵn.
// await = chờ thao tác xong (mỗi thao tác trả về Promise nên bắt buộc await).
test.beforeAll(async ({ browser }) => {
    // newContext() = một phiên trình duyệt độc lập, sạch (như một profile ẩn danh mới).
    const context = await browser.newContext();
    // newPage() = mở tab mới trong phiên đó.
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    // fill ≈ Input Text. Tài khoản demo viết cứng; thực tế nên để ở biến môi trường.
    await page.locator("#userEmail").fill("rahulshettyw@gmail.com");
    await page.locator("#userPassword").fill("Learning@830$3mK3");
    await page.locator("[value='Login']").click();
    // Chờ tới khi không còn request mạng nào (đảm bảo login xong, token đã được lưu).
    await page.waitForLoadState('networkidle');
    // storageState ≈ lưu lại cookie + localStorage hiện tại ra file state.json để tái dùng phiên.
    await context.storageState({ path: 'state.json' });
    // Tạo phiên mới nạp sẵn state.json => mọi tab mở từ webContext đều đã đăng nhập.
    webContext = await browser.newContext({ storageState: 'state.json' });




})

// test(...) ≈ một Test Case; '@Client' trong tên dùng như Tag. Không dùng fixture page mà tự mở tab từ webContext.
test('@Client App login', async () => {
    
    const email = "rahulshettyw@gmail.com";
    const productName = 'ZARA COAT 3';
    // Tab mới trong phiên đã đăng nhập -> vào thẳng trang sản phẩm, không cần login.
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator(".card-body");
    // allTextContents() ≈ lấy text của TẤT CẢ phần tử khớp, trả về list (≈ Get WebElements + Get Text từng cái).
    const titles = await page.locator(".card-body b").allTextContents();
    // console.log ≈ Log To Console
    console.log(titles);
    const count = await products.count();
    // Duyệt từng thẻ sản phẩm (≈ FOR IN RANGE); === là so sánh bằng chặt (cả giá trị và kiểu).
    for (let i = 0; i < count; ++i) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            //add to cart
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    // Vào giỏ hàng, chờ danh sách sản phẩm trong giỏ hiện ra.
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    // isVisible() trả True/False (≈ Run Keyword And Return Status  Element Should Be Visible).
    // h3:has-text('...') = CSS mở rộng của Playwright: thẻ h3 có chứa chữ.
    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();
    // 'text=Checkout' = tìm phần tử theo nội dung chữ.
    await page.locator("text=Checkout").click();
    // pressSequentially ≈ Press Keys từng ký tự, để kích hoạt ô gợi ý (autocomplete) quốc gia.
    await page.locator("[placeholder*='Country']").pressSequentially("ind")
    // Chờ danh sách gợi ý hiện ra rồi duyệt tìm đúng ' India' (có dấu cách đầu) để chọn.
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for (let i = 0; i < optionsCount; ++i) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text === " India") {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    // await expect(...).toHaveText ≈ Element Text Should Be, nhưng tự thử lại cho tới khi hết timeout
    // (≈ Wait Until Element Contains). Email hiển thị ở trang thanh toán phải đúng tài khoản.
    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    // Bấm Place Order.
    await page.locator(".action__submit").click();

    // Kiểm tra thông báo đặt hàng thành công.
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    // Lấy mã đơn hàng vừa tạo.
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);
    // Vào My Orders, tìm dòng có mã đơn vừa tạo và bấm View (giống WebAPIPart1).
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");


    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    // Kiểm tra mã đơn ở trang chi tiết (≈ Should Be True).
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();


});
// Test 2: dùng lại phiên đã đăng nhập, chỉ mở trang và in danh sách tên sản phẩm (không có assert).
test('@API Test case 2', async () => {
    const email = "";
    const productName = 'ZARA COAT 3';
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    await page.waitForLoadState('networkidle');
    const products = page.locator(".card-body");
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);

})






