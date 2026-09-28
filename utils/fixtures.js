/*
 * FILE: utils/fixtures.js
 * ≈ nơi định nghĩa Test Setup/Teardown dùng chung + dữ liệu test (dạng 'fixture' của Playwright).
 * base.test.extend({...}) tạo ra 'customtest' = test có thêm 3 fixture:
 *   - authenticatedPage: mở trình duyệt mới + đăng nhập UI -> giao tab cho test -> đóng trình duyệt sau test.
 *   - createOrder: tạo phiên API + tạo đơn -> giao {token, orderId} cho test -> đóng phiên API sau test.
 *   - testDataForOrder: dữ liệu tĩnh {productName}.
 * Quy tắc fixture: code TRƯỚC 'await use(x)' là setup, code SAU là teardown, x được giao cho test
 * (≈ Test Setup trả về giá trị, không cần Set Test Variable). Fixture chỉ chạy khi test ghi tên nó trong { }.
 * Được dùng bởi: tests/fixturesDemo.spec.js
 */
// require = nạp thư viện/file (≈ Library/Resource); base = toàn bộ thư viện @playwright/test. const = không gán lại.
const base = require('@playwright/test');
// Nạp keyword gọi API (resource utils/APiUtils.js).
const {APiUtils} = require('./APiUtils.js');
const {request} = require('@playwright/test');

// Object {key: value} ≈ dictionary. Tài khoản demo viết cứng; thực tế nên để ở biến môi trường.
const loginPayLoad = { userEmail: 'rahulshettyw@gmail.com', userPassword: 'Learning@830$3mK3' };
const orderPayLoad = {
  orders: [{ country: 'India', productOrderedId: '6960eac0c941646b7a8b3e68' }]};

// exports.customtest = công khai ra ngoài cho file test require. extend({...}) = định nghĩa các fixture.
exports.customtest = base.test.extend({
  // Fixture là arrow function async ({ fixture khác cần dùng }, use) => {...}; ở đây cần fixture 'browser' có sẵn.
  authenticatedPage: async ({ browser }, use) => {
    // --- SETUP: phiên trình duyệt mới + tab mới, đăng nhập UI ---
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill('rahulshettyw@gmail.com');
    await page.locator('#userPassword').fill('Learning@830$3mK3');
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');

    // Giao tab đã đăng nhập cho test; dòng này chờ tới khi test chạy xong mới đi tiếp.
    await use(page);
    //tear down
    // ≈ Test Teardown: Close Browser
    await context.close();





  },

  // Fixture createOrder: ({}, use) = không cần fixture nào khác.
  createOrder : async({},use)=>
  {
   // --- SETUP: ≈ Create Session, rồi login + tạo đơn qua API ---
   const apiContext = await request.newContext();
   const apiUtils = new APiUtils(apiContext,loginPayLoad);
   const response =  await apiUtils.createOrder(orderPayLoad);
   // Giao {token, orderId} cho test.
   await use(response);
   // --- TEARDOWN: ≈ Delete All Sessions ---
   await apiContext.dispose();

  },

  // Fixture dạng giá trị tĩnh (không phải hàm) ≈ biến dữ liệu test.
  testDataForOrder : {

    productName : 'ADIDAS ORIGINAL'
  }
});








