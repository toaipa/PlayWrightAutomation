/*
 * POManager - "Quản lý" tất cả Page Object của web client.
 * Chứa các thao tác: tạo sẵn mọi page object, và các hàm get...() trả về page object tương ứng.
 *
 * So sánh với Robot Framework (SeleniumLibrary):
 *  - Một Page Object class ≈ một resource file riêng cho màn hình này.
 *  - Locator khai báo trong constructor ≈ phần *** Variables *** chứa locator.
 *  - Mỗi method async ≈ một keyword người dùng tự viết trong *** Keywords ***.
 *  - POManager ≈ một resource gốc import tất cả resource trang; test chỉ cần tạo 1 đối tượng
 *  -   (new POManager(page)) rồi lấy trang cần dùng, vd: poManager.getLoginPage().validLogin(...).
 */
// require('./LoginPage') ≈ Resource  LoginPage.resource. {LoginPage} = lấy đúng class LoginPage mà file kia export.
const {LoginPage} = require('./LoginPage');
const {DashboardPage} = require('./DashboardPage');
const {OrdersHistoryPage} = require('./OrdersHistoryPage');
const {OrdersReviewPage} = require('./OrdersReviewPage');
const {CartPage} = require('./CartPage');
// class = "khuôn" để tạo đối tượng page object (test sẽ gọi new ...(page) để tạo).
class POManager
{
// constructor(page) = tự chạy khi new POManager(page): tạo sẵn tất cả page object, dùng chung MỘT tab page.
constructor(page)
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
// module.exports = xuất class ra để file khác require() được (≈ cho phép file khác import resource này).
module.exports = {POManager};