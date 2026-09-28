/*
 * FILE: fixturesDemo.spec.js  (≈ một file .robot)
 * Mục đích: minh hoạ dùng fixture tự định nghĩa trong utils/fixtures.js.
 * Test chỉ cần ghi tên fixture trong { } là Playwright tự chạy phần setup trước test và teardown sau test:
 *   - authenticatedPage: tab trình duyệt đã đăng nhập sẵn (qua UI)
 *   - createOrder: đơn hàng tạo sẵn qua API, trả về {token, orderId}
 *   - testDataForOrder: dữ liệu test tĩnh {productName}
 * RF: ≈ Test Setup trả về giá trị dùng thẳng trong test, không cần Set Test Variable.
 */
// require = nạp thư viện (≈ Library). Ở đây chỉ lấy expect (assert).
const { expect } = require('@playwright/test');
// customtest = phiên bản 'test' đã mở rộng thêm các fixture (≈ Resource chứa Setup/Teardown dùng chung).
const { customtest } = require('../utils/fixtures.js');
// Nạp AfterAll của thư viện Cucumber nhưng không dùng tới trong file.
const { AfterAll } = require('@cucumber/cucumber');


// ≈ Test Case. async ({...}) => {...} là arrow function; await = chờ Promise xong (bắt buộc).
// Ba tên trong { } là các fixture test cần: Playwright tự chạy setup của từng fixture rồi đưa giá trị vào đây.
customtest('Fixtures demo', async ({ authenticatedPage,createOrder,testDataForOrder }) => {
   // Tab này đã đăng nhập sẵn nhờ fixture authenticatedPage.
   await authenticatedPage.goto('https://rahulshettyacademy.com/client');
   // Vào My Orders, chờ bảng đơn hàng.
   await authenticatedPage.locator("button[routerlink*='myorders']").click();
   await authenticatedPage.locator("tbody").waitFor();
   // getByText = tìm phần tử theo chữ; toBeVisible ≈ Wait Until Element Is Visible. Đơn tạo bằng API phải xuất hiện.
   await expect(authenticatedPage.getByText(createOrder.orderId)).toBeVisible();
   // In dữ liệu tĩnh lấy từ fixture testDataForOrder (≈ Log To Console).
   console.log(testDataForOrder.productName);



});
