/*
 * CartPage (TypeScript) - Trang Giỏ hàng (Cart) của web https://rahulshettyacademy.com/client.
 * Chứa các thao tác: kiểm tra sản phẩm có trong giỏ, bấm nút Checkout.
 *
 * So sánh với Robot Framework (SeleniumLibrary):
 *  - Một Page Object class ≈ một resource file riêng cho màn hình này.
 *  - Locator khai báo trong constructor ≈ phần *** Variables *** chứa locator.
 *  - Mỗi method async ≈ một keyword người dùng tự viết trong *** Keywords ***.
 *  - Nội dung giống pageobjects/CartPage.js, chỉ thêm khai báo kiểu.
 */
// import {...} from '...' = nạp thư viện Playwright (≈ Library/Resource trong *** Settings ***).
// Locator, Page ở đây là KIỂU dữ liệu của TypeScript, dùng để khai báo thuộc tính/tham số.
import {test, expect,Locator,Page} from '@playwright/test';
// export class = vừa định nghĩa class vừa xuất ra để file khác import được.
// class = "khuôn" để tạo đối tượng page object (test sẽ gọi new ...(page) để tạo).
export class CartPage
{

// TypeScript: khai báo trước các thuộc tính kèm KIỂU, dạng  tên : Kiểu  (Locator = locator, Page = tab trình duyệt).
// Lợi ích: IDE báo lỗi ngay khi viết (gõ sai tên, gán sai kiểu) trước khi chạy; RF chỉ lộ lỗi khi chạy tới dòng đó.
cartProducts : Locator;
productsText : Locator;
cart :Locator;
orders : Locator;
checkout : Locator;
page : Page;

    
// constructor(page: Page) = hàm tự chạy khi new CartPage(page); ": Page" = tham số page phải là kiểu Page.
constructor(page: Page)
{
    // this.xxx = thuộc tính (biến) của đối tượng, method nào trong class cũng dùng được (≈ biến ${xxx} trong resource).
    this.page = page;
    // Locator là "lazy": chỉ khai báo CÁCH tìm, chưa tìm phần tử ngay; chỉ tìm khi thực sự thao tác (click, fill...).
    // first() = lấy phần tử đầu tiên khớp locator.
    this.cartProducts = page.locator("div li").first();
    // 3 locator dưới không được method nào trong file này dùng (copy từ DashboardPage).
    this.productsText = page.locator(".card-body b");
    this.cart =  page.locator("[routerlink*='cart']");
    this.orders = page.locator("button[routerlink*='myorders']");
    // "text=Checkout" = tìm phần tử theo nội dung chữ (≈ xpath //*[contains(text(),'Checkout')]).
    this.checkout = page.locator("text=Checkout");

}

// Keyword: kiểm tra sản phẩm productName có hiển thị trong giỏ hàng.
// productName = tham số (≈ [Arguments] ${productName}).
// ":string" = kiểu tham số là chuỗi; truyền số vào sẽ bị IDE báo lỗi ngay.
// async = method có thao tác trình duyệt. Mỗi thao tác trả về Promise ("hẹn sẽ có kết quả"),
// nên BẮT BUỘC có await phía trước để chờ xong mới chạy dòng kế (RF tự chờ từng keyword, JS thì không).
async VerifyProductIsDisplayed(productName:string)
{
   
    // waitFor() ≈ Wait Until Element Is Visible: chờ sản phẩm đầu tiên trong giỏ hiện ra.
    await this.cartProducts.waitFor();
    // isVisible() trả true/false NGAY, không chờ (≈ Run Keyword And Return Status  Element Should Be Visible).
    // const = khai báo biến không gán lại.
    const bool =await this.getProductLocator(productName).isVisible();
    // expect(bool).toBeTruthy() ≈ Should Be True ${bool}.
    // Lưu ý: expect trên giá trị thường (true/false) KHÔNG tự thử lại; chỉ expect(locator)... mới tự thử lại.
    expect(bool).toBeTruthy();

}

// Keyword: bấm nút Checkout để sang trang Review đơn hàng. click ≈ Click Element.
async Checkout()
{
    await this.checkout.click();
}

 // Hàm phụ (không async vì chỉ tạo locator, chưa thao tác): trả về locator thẻ h3 có chứa tên sản phẩm.
 // return = trả kết quả cho nơi gọi (≈ RETURN / [Return]). Dấu + là nối chuỗi (≈ Catenate).
 getProductLocator(productName:string)
{
    return  this.page.locator("h3:has-text('"+productName+"')");
}

}
// Dòng dưới là cách xuất kiểu JS cũ (CommonJS), thừa vì đã có "export class" ở trên.
module.exports = {CartPage};