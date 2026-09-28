/*
 * FILE: ClientApp.spec.js
 * Mục đích: test end-to-end mua hàng trên trang https://rahulshettyacademy.com/client
 * Luồng: đăng nhập -> tìm sản phẩm 'ZARA COAT 3' trong danh sách và thêm vào giỏ
 *   -> vào giỏ kiểm tra sản phẩm -> Checkout -> chọn quốc gia India từ ô gợi ý
 *   -> đặt hàng, kiểm tra thông báo cảm ơn và lấy mã đơn -> vào My Orders tìm đúng đơn
 *   -> mở chi tiết và kiểm tra mã đơn khớp.
 * Viết theo kiểu locator CSS + vòng lặp (bản ClientAppOtherWay.spec.js làm cùng việc
 *   bằng các locator getByRole/getByText gọn hơn).
 * ≈ một file .robot test suite chứa 1 Test Case.
 */
// require(...) ≈ Library trong RF: nạp 'test' (khai báo test case) và 'expect' (assertion).
// const = biến không gán lại được; let = biến gán lại được (dùng trong vòng for).
const { test, expect } = require('@playwright/test');




// test('tên', async ({ page }) => {...}) ≈ một Test Case; tag '@Webst' dùng để lọc khi chạy.
//   async + await: mỗi thao tác trình duyệt trả về Promise nên phải 'await' để chờ xong
//   (RF tự tuần tự). => là cú pháp hàm viết gọn (arrow function).
//   {page} là fixture: tab trình duyệt Playwright tạo sẵn cho test.
test('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "anshikaw@yahoo.com";
   const productName = 'ZARA COAT 3';
   // Locator các thẻ sản phẩm (nhiều phần tử). Locator 'lazy': chưa tìm tới khi dùng.
   const products = page.locator(".card-body");
   // page.goto ≈ Go To.
   await page.goto("https://rahulshettyacademy.com/client");
   // fill ≈ Input Text.
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").fill("Learning@830$3mK3");
   // click ≈ Click Button; tự chờ nút sẵn sàng (auto-wait).
   await page.locator("[value='Login']").click();
   // Chờ tới khi mạng rảnh (không còn request) ≈ không có keyword trực tiếp; gần giống Wait For Condition.
   await page.waitForLoadState('networkidle');
   // waitFor() chờ phần tử hiển thị ≈ Wait Until Element Is Visible.
   // Cần vì allTextContents() ở dòng dưới KHÔNG tự chờ.
   await page.locator(".card-body b").first().waitFor();
   // allTextContents(): lấy text tất cả tên sản phẩm -> mảng; in ra console (≈ Log To Console).
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles); 
   // count() ≈ Get Element Count: số thẻ sản phẩm.
   const count = await products.count();
   // Vòng for duyệt từng sản phẩm ≈ FOR ${i} IN RANGE ${count}.
   for (let i = 0; i < count; ++i) {
      // Locator lồng: tìm thẻ <b> BÊN TRONG sản phẩm thứ i, lấy text (≈ Get Text) và so sánh.
      // === là so sánh bằng chặt (cả kiểu dữ liệu) ≈ IF '${text}' == '${productName}'.
      if (await products.nth(i).locator("b").textContent() === productName) {
         //add to cart
         // "text= Add To Cart" là locator theo text; click nút Add To Cart của đúng sản phẩm đó.
         await products.nth(i).locator("text= Add To Cart").click();
         // break ≈ BREAK trong RF: thoát vòng lặp khi đã tìm thấy.
         break;
      }
   }

   // Click icon giỏ hàng (phần tử có thuộc tính routerlink chứa 'cart').
   await page.locator("[routerlink*='cart']").click();
   // (Đã comment sẵn) page.pause() mở Playwright Inspector để debug từng bước.
   //await page.pause();

   // Chờ danh sách sản phẩm trong giỏ hiện ra ≈ Wait Until Element Is Visible.
   await page.locator("div li").first().waitFor();
   // isVisible() trả về true/false ngay, KHÔNG chờ ≈ Run Keyword And Return Status Element Should Be Visible.
   // h3:has-text('...') = thẻ h3 có chứa text đó (cú pháp riêng của Playwright).
   const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
   // toBeTruthy() = kiểm tra giá trị là true ≈ Should Be True.
   expect(bool).toBeTruthy();
   // Click nút Checkout (locator theo text).
   await page.locator("text=Checkout").click();

   // pressSequentially("ind") gõ từng ký tự như người thật (để kích hoạt gợi ý tự động)
   //   ≈ Press Keys / Input Text từng ký tự. Khác fill là fill dán nguyên chuỗi một lần.
   await page.locator("[placeholder*='Country']").pressSequentially("ind");
   // Khung kết quả gợi ý (dropdown tự hoàn thành).
   const dropdown = page.locator(".ta-results");
   // Chờ khung gợi ý hiện ra.
   await dropdown.waitFor();
   // Đếm số nút gợi ý trong khung ≈ Get Element Count.
   const optionsCount = await dropdown.locator("button").count();
   // Duyệt từng gợi ý, gặp đúng ' India' (có dấu cách đầu) thì click và thoát vòng.
   for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown.locator("button").nth(i).textContent();
      if (text === " India") {
         await dropdown.locator("button").nth(i).click();
         break;
      }
   }

   // Kiểm tra ô email ở trang thanh toán hiển thị đúng email đã đăng nhập ≈ Element Text Should Be.
   // LƯU Ý: dòng này thiếu 'await' nên assertion không được chờ -> nếu sai có thể không làm test fail.
   expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
   // Click nút 'Place Order' để đặt hàng.
   await page.locator(".action__submit").click();
   // toHaveText ≈ Element Text Should Be (khớp toàn bộ text), có tự chờ/thử lại.
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   // Lấy mã đơn hàng hiển thị trên trang cảm ơn ≈ Get Text.
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(orderId);

   // Vào trang My Orders.
   await page.locator("button[routerlink*='myorders']").click();
   // Chờ bảng đơn hàng hiển thị.
   await page.locator("tbody").waitFor();
   // Locator các dòng trong bảng (await ở đây không cần thiết nhưng không gây lỗi).
   const rows = await page.locator("tbody tr");


   // Duyệt từng dòng; điều kiện dừng gọi 'await rows.count()' mỗi vòng ≈ Get Element Count.
   for (let i = 0; i < await rows.count(); ++i) {
      // Lấy mã đơn ở cột <th> của dòng thứ i.
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      // includes() ≈ Should Contain: mã đơn trang cảm ơn (có ký tự '|' bao quanh) có chứa mã ở dòng này không.
      if (orderId.includes(rowOrderId)) {
         // Click nút 'View' (nút đầu tiên) của dòng đó để mở chi tiết đơn.
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   // Lấy mã đơn ở trang chi tiết và kiểm tra khớp với mã đơn ban đầu ≈ Should Contain.
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();

});








