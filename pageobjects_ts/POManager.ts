/*
 * POManager (TypeScript) - "Quản lý" tất cả Page Object của web client.
 * Chứa các thao tác: tạo sẵn mọi page object, và các hàm get...() trả về page object tương ứng.
 *
 * So sánh với Robot Framework (SeleniumLibrary):
 *  - Một Page Object class ≈ một resource file riêng cho màn hình này.
 *  - Locator khai báo trong constructor ≈ phần *** Variables *** chứa locator.
 *  - Mỗi method async ≈ một keyword người dùng tự viết trong *** Keywords ***.
 *  - POManager ≈ một resource gốc import tất cả resource trang; test chỉ cần tạo 1 đối tượng
 *  -   (new POManager(page)) rồi lấy trang cần dùng, vd: poManager.getLoginPage().validLogin(...).
 */

// import {LoginPage} from './LoginPage' ≈ Resource  LoginPage.resource (lấy class LoginPage mà file kia export).
import {LoginPage} from './LoginPage';
import {DashboardPage} from './DashboardPage';
import { OrdersHistoryPage } from './OrdersHistoryPage';
import { OrdersReviewPage } from './OrdersReviewPage';
import { CartPage } from './CartPage';
import {Page} from '@playwright/test';

// export class = vừa định nghĩa class vừa xuất ra để file khác import được.
// class = "khuôn" để tạo đối tượng page object (test sẽ gọi new ...(page) để tạo).
export class POManager
{
    // Khai báo thuộc tính kèm kiểu: loginPage luôn là đối tượng LoginPage,... -> IDE gợi ý đúng các method của từng trang
    // và báo lỗi trước khi chạy nếu gọi sai tên method (RF chỉ báo "No keyword found" khi chạy).
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    ordersHistoryPage : OrdersHistoryPage;
    ordersReviewPage : OrdersReviewPage;
    cartPage : CartPage;
    page : Page;


// constructor(page:Page) = tự chạy khi new POManager(page): tạo sẵn tất cả page object, dùng chung MỘT tab page.
constructor(page:Page)
{
    // this.xxx = thuộc tính (biến) của đối tượng, method nào trong class cũng dùng được (≈ biến ${xxx} trong resource).
    this.page = page;
    // new LoginPage(this.page) = tạo đối tượng từ class LoginPage (chạy constructor của nó).
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.ordersHistoryPage = new OrdersHistoryPage(this.page);
    this.ordersReviewPage = new OrdersReviewPage(this.page);
    this.cartPage = new CartPage(this.page);


}

// Các hàm get...() dưới đây chỉ trả về (return ≈ RETURN) page object đã tạo sẵn.
// Không async vì không thao tác gì trên trình duyệt.
getLoginPage()
{
    return this.loginPage;
}

getCartPage()
{
    return this.cartPage;
}

getDashboardPage()
{
    return this.dashboardPage;
}
getOrdersHistoryPage()
{
    return this.ordersHistoryPage;
}

getOrdersReviewPage()
{
    return this.ordersReviewPage;
}
}
// Dòng dưới là cách xuất kiểu JS cũ (CommonJS), thừa vì đã có "export class" ở trên.
module.exports = {POManager};