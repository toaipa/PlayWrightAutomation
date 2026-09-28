/*
 * FILE: NetworkTest.spec.js  (≈ một file .robot)
 * Mục đích: GIẢ LẬP response API (mock) để kiểm tra giao diện khi khách hàng không có đơn hàng nào.
 * Luồng: Suite Setup tạo đơn qua API + lấy token -> test nhét token vào localStorage (bỏ qua login)
 *        -> chặn API 'get-orders-for-customer', thay body bằng {data: [], message: 'No Orders'}
 *        -> bấm My Orders -> trang hiển thị thông báo 'No Orders'.
 * RF: SeleniumLibrary KHÔNG làm được việc sửa response; phải dùng proxy (mitmproxy/BrowserMob) hoặc Browser Library.
 */
// require = nạp thư viện (≈ Library). test = khai báo test, expect = assert, request = gọi API (≈ RequestsLibrary).
const { test, expect, request } = require('@playwright/test');
// Nạp class APiUtils (≈ Resource chứa keyword gọi API).
const { APiUtils } = require('../utils/APiUtils');
// Object {key: value} ≈ dictionary. Tài khoản demo viết cứng; thực tế nên để ở biến môi trường.
const loginPayLoad = { userEmail: "anshikaw@gmail.com", userPassword: "Learning@830$3mK3" };
const orderPayLoad = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
// Body giả sẽ trả cho trình duyệt thay cho dữ liệu thật: danh sách đơn rỗng.
const fakePayLoadOrders = { data: [], message: "No Orders" };

// let = biến gán lại được; dùng chung giữa beforeAll và test (≈ Set Suite Variable).
let response;
// test.beforeAll ≈ Suite Setup. async () => {...} là arrow function; await = chờ Promise hoàn tất (bắt buộc).
test.beforeAll(async () => {
  // ≈ Create Session
  const apiContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  // Login + tạo đơn qua API, nhận về object {token, orderId}.
  response = await apiUtils.createOrder(orderPayLoad);

})


//create order is success
// ≈ Test Case, tag @SP. {page} = tab trình duyệt Playwright cấp sẵn.
test('@SP Place the order', async ({ page }) => {
  // ≈ Execute Javascript trước khi trang tải: ghi token vào localStorage để bỏ qua đăng nhập.
  page.addInitScript(value => {

    window.localStorage.setItem('token', value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");


  // page.route(url, handler) = đăng ký CHẶN mọi request khớp URL (* là ký tự đại diện).
  // Phải đăng ký trước hành động gây ra request (bấm My Orders bên dưới).
  await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    // Hàm xử lý chạy mỗi khi request bị chặn; 'route' đại diện cho request đang bị giữ lại.
    async route => {
      // Vẫn gửi request thật lên server để lấy response thật (status, header).
      const response = await page.request.fetch(route.request());
      // JSON.stringify = chuyển object thành chuỗi JSON.
      let body = JSON.stringify(fakePayLoadOrders);
      // route.fulfill = trả response GIẢ cho trình duyệt: giữ status/header của response thật, thay body bằng body giả.
      route.fulfill(
        {
          response,
          body, 

        });
      //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    });

  // Bấm My Orders -> trình duyệt gọi API get-orders-for-customer -> bị chặn và nhận body giả.
  await page.locator("button[routerlink*='myorders']").click();
  // page.waitForResponse ≈ chờ tới khi có response khớp URL này.
  await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")

  // In thông báo trên trang (mong đợi nội dung kiểu 'No Orders'); test chỉ in ra, không assert.
  console.log(await page.locator(".mt-4").textContent());



});

