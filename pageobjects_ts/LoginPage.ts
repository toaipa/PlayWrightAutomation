/*
 * LoginPage (TypeScript) - Trang đăng nhập https://rahulshettyacademy.com/client.
 * Chứa các thao tác: mở trang, đăng nhập với tài khoản hợp lệ.
 *
 * So sánh với Robot Framework (SeleniumLibrary):
 *  - Một Page Object class ≈ một resource file riêng cho màn hình này.
 *  - Locator khai báo trong constructor ≈ phần *** Variables *** chứa locator.
 *  - Mỗi method async ≈ một keyword người dùng tự viết trong *** Keywords ***.
 *  - Nội dung giống pageobjects/LoginPage.js, chỉ thêm khai báo kiểu.
 */
// import {...} from '...' = nạp thư viện Playwright (≈ Library/Resource trong *** Settings ***).
// Locator, Page ở đây là KIỂU dữ liệu của TypeScript, dùng để khai báo thuộc tính/tham số.
import {test, expect,Locator,Page} from '@playwright/test';


// export class = vừa định nghĩa class vừa xuất ra để file khác import được.
// class = "khuôn" để tạo đối tượng page object (test sẽ gọi new ...(page) để tạo).
export class LoginPage {
    // TypeScript: khai báo trước các thuộc tính kèm KIỂU, dạng  tên : Kiểu  (Locator = locator, Page = tab trình duyệt).
    // Lợi ích: IDE báo lỗi ngay khi viết (gõ sai tên, gán sai kiểu) trước khi chạy; RF chỉ lộ lỗi khi chạy tới dòng đó.
    // Vd: signInbutton : Locator = thuộc tính signInbutton luôn phải chứa một Locator.
    signInbutton : Locator;
    userName :Locator;
    password : Locator;
    page : Page;

// constructor(page:Page) = hàm tự chạy khi new LoginPage(page); tham số page có kiểu Page.
constructor(page:Page)
{
    // this.xxx = thuộc tính (biến) của đối tượng, method nào trong class cũng dùng được (≈ biến ${xxx} trong resource).
    this.page = page;
    // Locator là "lazy": chỉ khai báo CÁCH tìm, chưa tìm phần tử ngay; chỉ tìm khi thực sự thao tác (click, fill...).
    // "[value='Login']", "#userEmail" là CSS selector (≈ css:... ; #id ≈ id:...).
    this.signInbutton= page.locator("[value='Login']");
    this.userName = page.locator("#userEmail");
    this.password = page.locator("#userPassword");

}

// Keyword: mở trang đăng nhập. page.goto(url) ≈ Go To (hoặc Open Browser).
// async = method có thao tác trình duyệt. Mỗi thao tác trả về Promise ("hẹn sẽ có kết quả"),
// nên BẮT BUỘC có await phía trước để chờ xong mới chạy dòng kế (RF tự chờ từng keyword, JS thì không).
async goTo()
{
    await this.page.goto("https://rahulshettyacademy.com/client");
}

// Keyword: nhập email + mật khẩu, bấm Login, chờ trang tải xong.
// username, password = tham số (≈ [Arguments]  ${username}  ${password}).
// username:string, password:string = cả 2 tham số phải là chuỗi.
async validLogin(username:string,password:string)
{
    // fill ≈ Input Text (xoá nội dung cũ rồi điền).
    await  this.userName.fill(username);
     await this.password.fill(password);
     // click ≈ Click Element.
     await this.signInbutton.click();
     // waitForLoadState('networkidle') ≈ chờ trang hết request mạng (không còn gọi API) rồi mới đi tiếp.
     await this.page.waitForLoadState('networkidle');

}

}
// Dòng dưới là cách xuất kiểu JS cũ (CommonJS), thừa vì đã có "export class" ở trên.
module.exports = {LoginPage};