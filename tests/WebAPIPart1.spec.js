/*
 * FILE: WebAPIPart1.spec.js  (≈ một file .robot)
 * Mục đích: kết hợp API + UI.
 *  1) Suite Setup (test.beforeAll): gọi API đăng nhập lấy token + gọi API tạo đơn hàng (≈ RequestsLibrary).
 *  2) Test: nhét token vào localStorage của trình duyệt để BỎ QUA màn hình đăng nhập,
 *     mở trang 'My Orders', tìm đúng đơn vừa tạo bằng API và kiểm tra chi tiết đơn (≈ SeleniumLibrary).
 * Lợi ích: phần chuẩn bị dữ liệu làm bằng API nên nhanh và ổn định hơn làm qua UI.
 */
// require(...) = nạp thư viện/file khác (≈ Library / Resource trong *** Settings ***).
// const {a, b} = ... : lấy riêng các thành phần a, b từ thư viện; const = biến không gán lại được.
// test = khai báo test case, expect = kiểm tra (assert), request = gọi API (≈ RequestsLibrary).
const {test, expect, request} = require('@playwright/test');
// Nạp class APiUtils (≈ Resource chứa keyword gọi API) từ file utils/APiUtils.js
const {APiUtils} = require('../utils/APiUtils');
// Object {key: value} ≈ dictionary trong RF (&{loginPayLoad}) - body gửi khi login.
// Tài khoản demo viết cứng; thực tế nên để ở biến môi trường (process.env...).
const loginPayLoad = {userEmail:"anshikaw@gmail.com",userPassword:"Learning@830$3mK3"};
// Body tạo đơn hàng: [ ... ] là list (≈ @{list}), mỗi phần tử là một dictionary.
const orderPayLoad = {orders:[{country:"Cuba",productOrderedId:"6960eac0c941646b7a8b3e68"}]};


// let = biến có thể gán lại. Khai báo ở ngoài để beforeAll gán, test bên dưới đọc (≈ Set Suite Variable).
let response;
// test.beforeAll ≈ Suite Setup: chạy 1 lần trước mọi test trong file.
// async () => { ... } là arrow function (hàm không tên, ≈ một keyword viết tại chỗ).
// async cho phép dùng await bên trong; await = CHỜ thao tác xong mới chạy dòng tiếp theo
// (mọi thao tác Playwright trả về Promise - 'lời hứa kết quả sau' - nên bắt buộc phải await).
test.beforeAll( async()=>
{
   // request.newContext() ≈ Create Session: tạo phiên gọi API riêng (không cần trình duyệt).
   const apiContext = await request.newContext();
   // new APiUtils(...) = tạo object từ class, truyền phiên API + thông tin login (≈ import resource kèm tham số).
   const apiUtils = new APiUtils(apiContext,loginPayLoad);
   // Gọi keyword createOrder: login lấy token rồi POST tạo đơn; trả về object {token, orderId}.
   response =  await apiUtils.createOrder(orderPayLoad);

})


//create order is success
// test('tên', async ({page}) => {...}) ≈ một Test Case. '@API' trong tên dùng như Tag (lọc bằng --grep @API ≈ --include).
// {page} = fixture Playwright tự cấp: một tab trình duyệt đã mở sẵn, tự đóng khi test xong (≈ Open/Close Browser trong Setup/Teardown).
test('@API Place the order', async ({page})=>
{ 
    // addInitScript ≈ Execute Javascript nhưng chạy TRƯỚC khi trang tải: ghi token vào localStorage
    // => ứng dụng nghĩ là đã đăng nhập, bỏ qua màn hình login. 'value' nhận giá trị response.token truyền ở cuối.
    page.addInitScript(value => {

        window.localStorage.setItem('token',value);
    }, response.token );
// ≈ Go To
await page.goto("https://rahulshettyacademy.com/client");
 // locator("css") ≈ locator css:... ; .click() ≈ Click Element. Vào trang My Orders.
 await page.locator("button[routerlink*='myorders']").click();
 // waitFor() ≈ Wait Until Element Is Visible: chờ bảng đơn hàng hiện ra.
 await page.locator("tbody").waitFor();
// locator chỉ là 'địa chỉ' phần tử, chưa tìm ngay (lazy); các dòng hàng của bảng.
const rows = await page.locator("tbody tr");


// Vòng lặp ≈ FOR ${i} IN RANGE ${count}; rows.count() ≈ Get Element Count.
for(let i =0; i<await rows.count(); ++i)
{
   // nth(i) = phần tử thứ i (bắt đầu từ 0); textContent() ≈ Get Text: lấy mã đơn ở cột đầu.
   const rowOrderId =await rows.nth(i).locator("th").textContent();
   // includes() = chuỗi có chứa (≈ Should Contain nhưng trả True/False) -> đúng đơn vừa tạo
   if (response.orderId.includes(rowOrderId))
   {
       // Bấm nút đầu tiên của dòng (nút View) rồi break ≈ Exit For Loop / BREAK.
       await rows.nth(i).locator("button").first().click();
       break;
   }
}
// Lấy mã đơn hiển thị ở trang chi tiết đơn hàng.
const orderIdDetails =await page.locator(".col-text").textContent();
// page.pause() = dừng lại mở Playwright Inspector để debug (đang tắt).
//await page.pause();
// expect(...).toBeTruthy() ≈ Should Be True: mã đơn API trả về phải chứa mã đơn trên trang chi tiết.
expect(response.orderId.includes(orderIdDetails)).toBeTruthy();

});

//Verify if order created is showing in history page
// Precondition - create order -