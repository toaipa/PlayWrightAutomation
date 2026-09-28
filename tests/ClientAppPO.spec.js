/*
 * FILE: ClientAppPO.spec.js  (≈ một file .robot dùng Page Object)
 * Mục đích: luồng mua hàng end-to-end viết theo Page Object Model.
 *  - Test 1 (data-driven): vòng for trên dataset trong placeorderTestData.json, mỗi phần tử sinh 1 test
 *    (≈ Test Template / DataDriver). Luồng: login -> thêm sản phẩm vào giỏ -> checkout -> chọn quốc gia
 *    -> đặt hàng lấy orderId -> vào lịch sử đơn -> kiểm tra orderId.
 *  - Test 2: dùng fixture testDataForOrder (utils/test-base.js) làm dữ liệu, chạy tới bước checkout.
 * POManager ≈ resource gốc import mọi page object; mỗi page object ≈ một resource file chứa keyword của 1 trang.
 */
// require = nạp thư viện/file (≈ Library/Resource). const {a, b} = lấy riêng các thành phần; const = không gán lại.
 const {test, expect} = require('@playwright/test');
 // customtest1 = 'test' mở rộng có fixture dữ liệu testDataForOrder.
 const {customtest1} = require('../utils/test-base');

 // POManager: nơi lấy ra các page object (≈ resource gốc).
 const {POManager} = require('../pageobjects/POManager');
 //Json->string->js object
 // JSON.parse(JSON.stringify(require(...))) = đọc file JSON thành object/list (≈ Variables file);
 // stringify rồi parse lại để có bản sao độc lập. dataset là list các bộ dữ liệu.
 const dataset =  JSON.parse(JSON.stringify(require("../utils/placeorderTestData.json")));

 
// for (const data of dataset) ≈ FOR ${data} IN @{dataset}: mỗi vòng khai báo một test riêng (≈ Test Template).
for(const data of dataset)
{
 // Tên test dùng template string `...${data.productName}` (≈ ${var} trong chuỗi RF) để mỗi test có tên khác nhau.
 // async ({page}) => {...} là arrow function; {page} = tab trình duyệt cấp sẵn; await = chờ Promise xong (bắt buộc).
 test(`@Webs Client App login for ${data.productName}`, async ({page})=>
 {
   // new POManager(page) = tạo object từ class, truyền tab trình duyệt vào cho mọi page object dùng chung.
   const poManager = new POManager(page);
    //js file- Login js, DashboardPage
     // Biến này không được dùng tới.
     const products = page.locator(".card-body");
     // Lấy page object Login rồi gọi keyword của nó: mở trang, đăng nhập bằng dữ liệu của vòng lặp.
     const loginPage = poManager.getLoginPage();
     await loginPage.goTo();
     await loginPage.validLogin(data.username,data.password);
     // Trang Dashboard: tìm sản phẩm theo tên, thêm vào giỏ, sang giỏ hàng.
     const dashboardPage = poManager.getDashboardPage();
     await dashboardPage.searchProductAddCart(data.productName);
     await dashboardPage.navigateToCart();

    // Trang Cart: kiểm tra sản phẩm có trong giỏ rồi bấm Checkout.
    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(data.productName);
    await cartPage.Checkout();

    // Trang Review: gõ 'ind' rồi chọn 'India', bấm đặt hàng và nhận lại mã đơn.
    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind","India");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(orderId);
   // Sang lịch sử đơn, tìm đơn vừa đặt và mở chi tiết.
   await dashboardPage.navigateToOrders();
   const ordersHistoryPage = poManager.getOrdersHistoryPage();
   await ordersHistoryPage.searchOrderAndSelect(orderId);
   // ≈ Should Be True: mã đơn vừa đặt phải chứa mã đơn ở trang chi tiết.
   expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();





 });
}

 // Test thứ 2 dùng customtest1: nhận fixture testDataForOrder (≈ dữ liệu trả về từ Test Setup) thay vì file JSON.
 customtest1(`Client App login`, async ({page,testDataForOrder})=>
 {
   const poManager = new POManager(page);
    //js file- Login js, DashboardPage
     const products = page.locator(".card-body");
     const loginPage = poManager.getLoginPage();
     await loginPage.goTo();
     await loginPage.validLogin(testDataForOrder.username,testDataForOrder.password);
     const dashboardPage = poManager.getDashboardPage();
     await dashboardPage.searchProductAddCart(testDataForOrder.productName);
     await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
    await cartPage.Checkout();


})
// (≈ giống pabot chia theo file: các file chạy song song, các test trong 1 file chạy lần lượt)
//test files will trigger parallel
//individual tests in the file will run in sequence
 

 



 

