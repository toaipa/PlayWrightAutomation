/*
 * OrdersReviewPage - Trang Review/Thanh toán đơn hàng (sau khi bấm Checkout) và trang xác nhận đơn.
 * Chứa các thao tác: chọn quốc gia từ dropdown gợi ý, kiểm tra email, bấm Place Order và lấy mã đơn.
 *
 * So sánh với Robot Framework (SeleniumLibrary):
 *  - Một Page Object class ≈ một resource file riêng cho màn hình này.
 *  - Locator khai báo trong constructor ≈ phần *** Variables *** chứa locator.
 *  - Mỗi method async ≈ một keyword người dùng tự viết trong *** Keywords ***.
 */
// Lấy expect (hàm assert) từ Playwright; require ≈ Library trong *** Settings ***.
const { expect } = require("@playwright/test");

// class = "khuôn" để tạo đối tượng page object (test sẽ gọi new ...(page) để tạo).
class OrdersReviewPage
{
// constructor(page) = hàm tự chạy khi tạo đối tượng: new XxxPage(page).
// page = tab trình duyệt đang mở (giống trình duyệt hiện tại mà SeleniumLibrary đang điều khiển).
constructor(page)
{
    // this.xxx = thuộc tính (biến) của đối tượng, method nào trong class cũng dùng được (≈ biến ${xxx} trong resource).
    this.page = page;
// Locator là "lazy": chỉ khai báo CÁCH tìm, chưa tìm phần tử ngay; chỉ tìm khi thực sự thao tác (click, fill...).
// [placeholder*='Country'] = ô input có placeholder chứa chữ Country.
this.country = page.locator("[placeholder*='Country']");
// .ta-results = khung dropdown gợi ý quốc gia.
this.dropdown = page.locator(".ta-results");
this.emailId = page.locator(".user__name [type='text']").first();
this.submit =  page.locator(".action__submit");
this.orderConfirmationText = page.locator(".hero-primary");
this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");

}
// Keyword: gõ vào ô Country, chờ dropdown gợi ý, chọn nút có chữ countryName.
// Lưu ý: tham số countryCode không được dùng, luôn gõ cứng "ind".
// async = method có thao tác trình duyệt. Mỗi thao tác trả về Promise ("hẹn sẽ có kết quả"),
// nên BẮT BUỘC có await phía trước để chờ xong mới chạy dòng kế (RF tự chờ từng keyword, JS thì không).
async searchCountryAndSelect(countryCode,countryName)
{
    // pressSequentially ≈ Press Keys từng ký tự (gõ như người thật để bật gợi ý; fill dán cả chuỗi có thể không bật).
    await this.country.pressSequentially("ind");
    // waitFor({ state: "visible" }) ≈ Wait Until Element Is Visible. { ... } = object tuỳ chọn (≈ tham số key=value).
    await this.dropdown.waitFor({ state: "visible" });
    // Nút trong dropdown có chữ CHỨA countryName (≈ //button[contains(.,'India')]), lấy cái đầu tiên (first).
    const countryOption = this.dropdown.locator("button", { hasText: countryName }).first();
    // Chờ lựa chọn hiện rồi click ≈ Wait Until Element Is Visible + Click Element.
    await countryOption.waitFor({ state: "visible" });
    await countryOption.click();

}

// Keyword: kiểm tra ô email trên trang đúng bằng username.
// expect(locator).toHaveText ≈ Element Text Should Be, nhưng TỰ THỬ LẠI cho tới khi đúng hoặc hết timeout.
async VerifyEmailId(username)
{
    await expect(this.emailId).toHaveText(username);
}

// Keyword: bấm Place Order (≈ Click Element), kiểm tra thông báo cảm ơn (tự thử lại), rồi trả về mã đơn.
async SubmitAndGetOrderId()
{
 await this.submit.click();
 // Web-first assertion ≈ Element Text Should Be (tự thử lại). Có dấu cách đầu/cuối trong chuỗi mong đợi.
 await expect(this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
 // textContent() ≈ Get Text; return ≈ RETURN mã đơn cho test dùng tiếp.
 return await this.orderId.textContent();
}
}
// module.exports = xuất class ra để file khác require() được (≈ cho phép file khác import resource này).
module.exports = {OrdersReviewPage};
   