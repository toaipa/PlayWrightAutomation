/*
 * OrdersReviewPage (TypeScript) - Trang Review/Thanh toán đơn hàng và trang xác nhận đơn.
 * Chứa các thao tác: chọn quốc gia từ dropdown gợi ý, kiểm tra email, bấm Place Order và lấy mã đơn.
 *
 * So sánh với Robot Framework (SeleniumLibrary):
 *  - Một Page Object class ≈ một resource file riêng cho màn hình này.
 *  - Locator khai báo trong constructor ≈ phần *** Variables *** chứa locator.
 *  - Mỗi method async ≈ một keyword người dùng tự viết trong *** Keywords ***.
 *  - Khác bản .js: chọn quốc gia bằng vòng lặp so khớp CHÍNH XÁC tên (bản .js dùng hasText = "chứa").
 */
// import {...} from '...' = nạp thư viện Playwright (≈ Library/Resource trong *** Settings ***).
// Locator, Page ở đây là KIỂU dữ liệu của TypeScript, dùng để khai báo thuộc tính/tham số.
import {test, expect,Locator,Page} from '@playwright/test';


// export class = vừa định nghĩa class vừa xuất ra để file khác import được.
// class = "khuôn" để tạo đối tượng page object (test sẽ gọi new ...(page) để tạo).
export class OrdersReviewPage
{

    // TypeScript: khai báo trước các thuộc tính kèm KIỂU, dạng  tên : Kiểu  (Locator = locator, Page = tab trình duyệt).
    // Lợi ích: IDE báo lỗi ngay khi viết (gõ sai tên, gán sai kiểu) trước khi chạy; RF chỉ lộ lỗi khi chạy tới dòng đó.
    country : Locator;
    dropdown :Locator;
    emailId : Locator;
    page : Page;
    submit : Locator;
    orderConfirmationText :Locator;
    orderId : Locator;
// constructor(page:Page) = hàm tự chạy khi new OrdersReviewPage(page).
constructor(page:Page)
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
// Keyword: gõ vào ô Country, chờ dropdown gợi ý, duyệt từng nút và click nút có tên đúng bằng countryName.
// Lưu ý: tham số countryCode không được dùng, luôn gõ cứng "ind".
// async = method có thao tác trình duyệt. Mỗi thao tác trả về Promise ("hẹn sẽ có kết quả"),
// nên BẮT BUỘC có await phía trước để chờ xong mới chạy dòng kế (RF tự chờ từng keyword, JS thì không).
async searchCountryAndSelect(countryCode:string,countryName:string)
{
    // pressSequentially ≈ Press Keys từng ký tự (gõ như người thật để bật gợi ý).
    await this.country.pressSequentially("ind");
   // (Cách cũ đã tắt: điền cả chuỗi bằng fill - giữ lại để tham khảo.)
   // await this.country.fill(countryCode,{delay:100});
    // waitFor() ≈ Wait Until Element Is Visible (mặc định chờ hiển thị).
    await this.dropdown.waitFor();
    // count() ≈ Get Element Count: số nút quốc gia trong dropdown.
    const optionsCount = await this.dropdown.locator("button").count();
    // Vòng for (≈ FOR ${i} IN RANGE ${optionsCount}), i bắt đầu từ 0.
    for(let i =0;i< optionsCount; ++i)
    {
        // let = biến có thể gán lại; text:any = kiểu bất kỳ (textContent có thể trả null nên dùng any cho gọn).
        let text:any;
        // nth(i) ≈ chọn nút thứ i; textContent() ≈ Get Text.
        text =  await this.dropdown.locator("button").nth(i).textContent();
        // trim() ≈ Strip String (bỏ khoảng trắng đầu/cuối); === so sánh bằng tuyệt đối.
        if(text.trim() === countryName)
        {
           // click ≈ Click Element; break ≈ BREAK thoát vòng lặp.
           await this.dropdown.locator("button").nth(i).click();
           break;
        }
    }

}

// Keyword: kiểm tra ô email trên trang đúng bằng username.
// expect(locator).toHaveText ≈ Element Text Should Be, nhưng TỰ THỬ LẠI cho tới khi đúng hoặc hết timeout.
async VerifyEmailId(username:string)
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
// Dòng dưới là cách xuất kiểu JS cũ (CommonJS), thừa vì đã có "export class" ở trên.
module.exports = {OrdersReviewPage};
   