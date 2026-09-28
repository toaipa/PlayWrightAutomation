
 /*
  * FILE: ClientAppPO.spec.ts  (bản TypeScript của ClientAppPO.spec.js, ≈ một file .robot dùng Page Object)
  * TypeScript = JavaScript + khai báo kiểu dữ liệu (vd  : string, : Page, : any) để phát hiện lỗi sớm khi viết code.
  * Mục đích: luồng mua hàng end-to-end theo Page Object Model.
  *  - Test 1 (data-driven): vòng for trên dataset trong placeorderTestData.json, mỗi phần tử sinh 1 test
  *    (≈ Test Template / DataDriver). Luồng: login -> thêm vào giỏ -> checkout -> chọn quốc gia
  *    -> đặt hàng lấy orderId -> vào lịch sử đơn -> kiểm tra orderId.
  *  - Test 2: dùng fixture testDataForOrder (utils_ts/test-base.ts) làm dữ liệu, chạy tới bước checkout.
  * POManager ≈ resource gốc import mọi page object; mỗi page object ≈ một resource file chứa keyword của 1 trang.
  */
 // import {a, b} from '...' = cách nạp thư viện kiểu mới (tương đương require; ≈ Library/Resource).
 import {test, expect} from '@playwright/test';
 // customTest = 'test' mở rộng có fixture dữ liệu testDataForOrder.
 import {customTest} from '../utils_ts/test-base';

// POManager bản TypeScript (≈ resource gốc chứa mọi page object).
import {POManager} from '../pageobjects_ts/POManager';

 //Json->string->js object
 // JSON.parse(JSON.stringify(require(...))) = đọc file JSON thành object/list (≈ Variables file);
 // stringify rồi parse lại để có bản sao độc lập. const = biến không gán lại được.
 const dataset =  JSON.parse(JSON.stringify(require("../utils/placeorderTestData.json")));

 
// for (const data of dataset) ≈ FOR ${data} IN @{dataset}: mỗi vòng khai báo một test riêng (≈ Test Template).
for(const data of dataset)
{
 // Tên test dùng template string `...${data.productName}` (≈ ${var} trong chuỗi RF).
 // async ({page}) => {...} là arrow function; {page} = tab trình duyệt cấp sẵn; await = chờ Promise xong (bắt buộc).
 test(`@Webs Client App login for ${data.productName}`, async ({page})=>
 {
   // new POManager(page) = tạo object từ class, truyền tab trình duyệt vào cho mọi page object.
   const poManager = new POManager(page);
    //js file- Login js, DashboardPage
     // Biến này không được dùng tới.
     const products = page.locator(".card-body");
     // Page object Login: mở trang, đăng nhập bằng dữ liệu của vòng lặp.
     const loginPage = poManager.getLoginPage();
     await loginPage.goTo();
     await loginPage.validLogin(data.username,data.password);
     // Dashboard: tìm sản phẩm theo tên, thêm vào giỏ, sang giỏ hàng.
     const dashboardPage = poManager.getDashboardPage();
     await dashboardPage.searchProductAddCart(data.productName);
     await dashboardPage.navigateToCart();

    // Cart: kiểm tra sản phẩm có trong giỏ rồi Checkout.
    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(data.productName);
    await cartPage.Checkout();

    // Review: gõ 'ind' rồi chọn 'India'.
    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind","India");
    // let orderId: any = khai báo biến kiểu 'any' (chấp nhận mọi kiểu, TypeScript không kiểm tra); sau đó nhận mã đơn.
    let orderId:any;
     orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(orderId);
   // Sang lịch sử đơn, tìm đơn vừa đặt và mở chi tiết.
   await dashboardPage.navigateToOrders();
   const ordersHistoryPage = poManager.getOrdersHistoryPage();
   await ordersHistoryPage.searchOrderAndSelect(orderId);
   // ≈ Should Be True: mã đơn vừa đặt phải chứa mã đơn ở trang chi tiết.
   expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();






    
 });
}

// Test thứ 2 dùng customTest: nhận fixture testDataForOrder (≈ dữ liệu trả về từ Test Setup).
customTest(`Client App login`, async ({page,testDataForOrder})=>
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
 

 



 

