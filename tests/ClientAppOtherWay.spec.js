/*
 * FILE: ClientAppOtherWay.spec.js
 * Mục đích: cùng luồng mua hàng như ClientApp.spec.js nhưng viết bằng các locator
 *   "ngữ nghĩa" của Playwright (getByPlaceholder, getByRole, getByText, filter),
 *   nên không cần vòng lặp tự duyệt danh sách.
 * Luồng: đăng nhập -> thêm 'ZARA COAT 3' vào giỏ -> vào giỏ kiểm tra -> Checkout
 *   -> chọn quốc gia India -> Place Order -> kiểm tra thông báo cảm ơn.
 * ≈ một file .robot test suite chứa 1 Test Case.
 */
// require(...) ≈ Library trong RF: nạp 'test' (khai báo test case) và 'expect' (assertion).
// const = biến không gán lại được.
const { test, expect } = require('@playwright/test');




// test('tên', async ({ page }) => {...}) ≈ một Test Case; tag '@Webst' để lọc khi chạy.
//   async + await: mỗi thao tác trả về Promise nên phải 'await' để chờ xong (RF tự tuần tự).
//   => là cú pháp hàm viết gọn. {page} là fixture: tab trình duyệt Playwright tạo sẵn.
test('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "rahulshetty1@yahoo.com";
   const productName = 'ZARA COAT 3';
   // Locator các thẻ sản phẩm (khai báo nhưng không dùng tới trong test này). Locator là 'lazy'.
   const products = page.locator(".card-body");
   // page.goto ≈ Go To.
   await page.goto("https://rahulshettyacademy.com/client");
   // getByPlaceholder: tìm ô input theo placeholder ≈ Input Text  xpath=//input[@placeholder='...'].
   await page.getByPlaceholder("email@example.com").fill(email);
   await page.getByPlaceholder("enter your passsword").fill("Learning@830$3mK3");
   // getByRole('button', {name:'Login'}): tìm nút có tên hiển thị 'Login' rồi click ≈ Click Button.
   await page.getByRole('button',{name:"Login"}).click();
   // Chờ mạng rảnh rồi chờ tên sản phẩm đầu tiên hiển thị ≈ Wait Until Element Is Visible.
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body b").first().waitFor();
   
   // filter({hasText}) lọc: chỉ giữ thẻ sản phẩm có chứa text 'ZARA COAT 3',
   //   rồi trong thẻ đó tìm nút 'Add to Cart' và click. Thay cho vòng for ở ClientApp.spec.js.
   //   (Câu lệnh viết xuống 2 dòng, dấu . ở đầu dòng sau là nối tiếp.)
   await page.locator(".card-body").filter({hasText:"ZARA COAT 3"})
   .getByRole("button",{name:"Add to Cart"}).click();

   // Trong các mục <li> (listitem) tìm nút 'Cart' và click để vào giỏ hàng.
   await page.getByRole("listitem").getByRole('button',{name:"Cart"}).click();

   // (Đã comment sẵn) page.pause() mở Playwright Inspector để debug.
   //await page.pause();
   // Chờ danh sách trong giỏ hiện ra.
   await page.locator("div li").first().waitFor();
   // toBeVisible() ≈ Element Should Be Visible / Page Should Contain, nhưng tự chờ/thử lại.
   await expect(page.getByText("ZARA COAT 3")).toBeVisible();

   // Click nút Checkout.
   await page.getByRole("button",{name :"Checkout"}).click();

   // pressSequentially gõ từng ký tự 'ind' để hiện gợi ý quốc gia ≈ Press Keys.
   await page.getByPlaceholder("Select Country").pressSequentially("ind");

   // Có nhiều nút tên chứa 'India' (vd 'British Indian Ocean Territory'), nth(1) lấy nút thứ 2 = 'India'.
   await page.getByRole("button",{name :"India"}).nth(1).click();
   // getByText: click phần tử có text 'PLACE ORDER' để đặt hàng.
   await page.getByText("PLACE ORDER").click();

   // Kiểm tra thông báo đặt hàng thành công hiển thị.
   await expect(page.getByText("Thankyou for the order.")).toBeVisible();
})