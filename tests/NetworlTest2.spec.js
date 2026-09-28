/*
 * FILE: NetworlTest2.spec.js  (≈ một file .robot)
 * Mục đích: kiểm thử bảo mật bằng cách SỬA request.
 * Luồng: đăng nhập UI -> vào My Orders -> chặn request xem chi tiết đơn và đổi id sang đơn của NGƯỜI KHÁC
 *        -> bấm View -> trang phải báo 'You are not authorize to view this order'.
 * route.continue({...}) = cho request đi tiếp nhưng đã bị sửa; (route.abort() = huỷ request, không dùng ở đây).
 * RF: SeleniumLibrary không sửa được request; cần proxy hoặc Browser Library.
 */
// require = nạp thư viện (≈ Library). const {a, b} = lấy riêng test (khai báo test) và expect (assert).
const { test,expect } = require('@playwright/test');


// ≈ Test Case, tag @QW. async ({ page }) => {...} là arrow function; {page} = tab trình duyệt cấp sẵn.
// await = chờ thao tác xong (mỗi thao tác trả về Promise nên bắt buộc await).
test('@QW Security test request intercept', async ({ page }) => {

    //login and reach orders page
    await page.goto("https://rahulshettyacademy.com/client");
    // ≈ Input Text. Tài khoản demo viết cứng; thực tế nên để ở biến môi trường.
    await page.locator("#userEmail").fill("anshikaw@gmail.com");
    await page.locator("#userPassword").fill("Learning@830$3mK3");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    // Chờ sản phẩm đầu tiên hiện ra = đăng nhập thành công.
    await page.locator(".card-body b").first().waitFor();

    // Vào trang My Orders.
    await page.locator("button[routerlink*='myorders']").click();
    // Chặn request xem chi tiết đơn (id=* bất kỳ) và đổi URL sang id của đơn thuộc tài khoản khác.
    // route => route.continue(...) là arrow function rút gọn: một biểu thức, trả kết quả luôn.
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6' }))
    // Bấm View đơn đầu tiên -> request bị sửa id như trên.
    await page.locator("button:has-text('View')").first().click();
    // ≈ Element Text Should Be (tự chờ): đoạn p cuối phải báo không có quyền xem đơn.
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");








})