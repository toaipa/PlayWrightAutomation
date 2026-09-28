/*
 * OrdersHistoryPage (TypeScript) - Trang "My Orders" (lịch sử đơn hàng) và trang chi tiết đơn.
 * Chứa các thao tác: tìm đơn theo mã rồi mở chi tiết, lấy mã đơn trên trang chi tiết.
 *
 * So sánh với Robot Framework (SeleniumLibrary):
 *  - Một Page Object class ≈ một resource file riêng cho màn hình này.
 *  - Locator khai báo trong constructor ≈ phần *** Variables *** chứa locator.
 *  - Mỗi method async ≈ một keyword người dùng tự viết trong *** Keywords ***.
 *  - Nội dung giống pageobjects/OrdersHistoryPage.js, chỉ thêm khai báo kiểu.
 */
// import {...} from '...' = nạp thư viện Playwright (≈ Library/Resource trong *** Settings ***).
// Locator, Page ở đây là KIỂU dữ liệu của TypeScript, dùng để khai báo thuộc tính/tham số.
import {test, expect,Locator,Page} from '@playwright/test';
// export class = vừa định nghĩa class vừa xuất ra để file khác import được.
// class = "khuôn" để tạo đối tượng page object (test sẽ gọi new ...(page) để tạo).
export class OrdersHistoryPage
{
    // TypeScript: khai báo trước các thuộc tính kèm KIỂU, dạng  tên : Kiểu  (Locator = locator, Page = tab trình duyệt).
    // Lợi ích: IDE báo lỗi ngay khi viết (gõ sai tên, gán sai kiểu) trước khi chạy; RF chỉ lộ lỗi khi chạy tới dòng đó.
    orderdIdDetails : Locator;
    rows :Locator;
    ordersTable : Locator;
    page : Page;
// constructor(page:Page) = hàm tự chạy khi new OrdersHistoryPage(page).
constructor(page:Page)
{
    // this.xxx = thuộc tính (biến) của đối tượng, method nào trong class cũng dùng được (≈ biến ${xxx} trong resource).
    this.page = page;
// Locator là "lazy": chỉ khai báo CÁCH tìm, chưa tìm phần tử ngay; chỉ tìm khi thực sự thao tác (click, fill...).
this.ordersTable = page.locator("tbody");
// tbody tr = tất cả các dòng của bảng (nhiều phần tử).
this.rows = page.locator("tbody tr");
this.orderdIdDetails =page.locator(".col-text");
}
// Keyword: chờ bảng đơn hàng hiện ra, duyệt từng dòng, dòng nào có mã đơn khớp thì bấm nút View.
// orderId:any = kiểu "any" (bất kỳ) -> TẮT kiểm tra kiểu, mất lợi ích báo lỗi sớm của TS.
// async = method có thao tác trình duyệt. Mỗi thao tác trả về Promise ("hẹn sẽ có kết quả"),
// nên BẮT BUỘC có await phía trước để chờ xong mới chạy dòng kế (RF tự chờ từng keyword, JS thì không).
async searchOrderAndSelect(orderId:any)
{

    // waitFor() ≈ Wait Until Element Is Visible (chờ bảng tbody).
    await this.ordersTable.waitFor();
// Vòng for (≈ FOR ${i} IN RANGE ...): điều kiện dừng gọi rows.count() (≈ Get Element Count) ở MỖI vòng.
for(let i =0; i<await this.rows.count(); ++i)
 {
    // nth(i) ≈ chọn dòng thứ i (từ 0); ô <th> của dòng chứa mã đơn. textContent() ≈ Get Text.
    const rowOrderId =await this.rows.nth(i).locator("th").textContent();
    // includes ≈ "chứa" (≈ IF  '${rowOrderId}' in '${orderId}'): orderId lấy từ trang xác nhận có dạng " | abc123 | "
    // nên so "chứa" thay vì "bằng".
    if (orderId.includes(rowOrderId))
    {
        // first() = nút đầu tiên trong dòng (nút View) rồi click ≈ Click Element.
        await this.rows.nth(i).locator("button").first().click();
        break;
    }
 }

}

// Keyword: đọc mã đơn trên trang chi tiết đơn hàng. return ≈ RETURN giá trị Get Text.
async getOrderId()
{
    return await this.orderdIdDetails.textContent();
}

}
// Dòng dưới là cách xuất kiểu JS cũ (CommonJS), thừa vì đã có "export class" ở trên.
module.exports = {OrdersHistoryPage};
