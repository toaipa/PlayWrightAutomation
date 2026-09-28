// ===================================================================================
// STEP DEFINITIONS: nơi hiện thực từng dòng Given/When/Then trong các file .feature
// (≈ định nghĩa keyword trong *** Keywords *** có tên trùng với câu Gherkin).
// Cucumber khớp câu trong .feature với chuỗi đầu tiên trong Given/When/Then(...) rồi chạy hàm đi kèm.
// Given/When/Then chỉ là tên để đăng ký; khi khớp câu Cucumber không phân biệt chúng.
// {string} = tham số lấy từ câu (phần trong ngoặc kép) ≈ embedded argument "${productName}" trong tên keyword RF.
// this (World) = object riêng cho mỗi scenario, dùng chia sẻ biến giữa các step (≈ Set Test Variable);
//   this.page được tạo sẵn trong features/support/hooks.js.
// POManager (thư mục pageobjects/) = Page Object ≈ các Resource file chứa keyword theo từng trang.
// ===================================================================================
// Đây là bản TypeScript (.ts) gần như giống hệt steps.js. Cucumber mặc định chỉ nạp .js nên file này
// thường không được chạy; nếu cấu hình nạp cả .ts thì các step bị định nghĩa trùng (lỗi ambiguous).
// require('...') ≈ `Library` trong *** Settings ***. const = biến không gán lại được.
// { exec } = lấy riêng hàm exec (chạy lệnh shell) - không được dùng trong file này.
const { exec } = require("child_process")

// Lấy các hàm đăng ký step (Given/When/Then) từ thư viện Cucumber.
const { defineParameterType, When, Given,Then } = require("@cucumber/cucumber")
const path = require("path")
// let = biến có thể gán lại. poManager khai báo ở cấp file (dùng chung cho mọi step, ≈ Suite/Global Variable),
// được gán giá trị trong step login 'a login to Ecommerce application...'. Chưa gán thì là undefined (≈ None).
let poManager 
const playwright = require('@playwright/test');
// import { ... } from '...' = cách nạp thư viện kiểu ES module/TypeScript, tương đương require.
// Locator, Page là kiểu dữ liệu TypeScript (ở đây không dùng).
import { test, Locator,Page,expect } from '@playwright/test';
 // ../../ = lùi lên 2 cấp thư mục (về thư mục gốc project).
 const {POManager} = require('../../pageobjects/POManager');
const assert = require("assert")
// __dirname = thư mục chứa file này; path.resolve ghép thành đường dẫn tuyệt đối. binDir chỉ để in ra, không dùng.
const binDir = path.resolve(__dirname, "../../bin")
console.log(binDir)

// defineParameterType: tạo kiểu tham số tuỳ biến {command} (khớp chuỗi nằm trong dấu backtick bằng regex).
// Không step nào dùng {command}. transformer: (cmd) => cmd là arrow function trả về nguyên giá trị.
defineParameterType({
  name: "command", 
  regexp: /`(.+)`/,
  transformer: (cmd) => cmd,
})

// Step mẫu (từ ví dụ của Cucumber, không file .feature nào dùng): lưu chuỗi vào this.stdout.
// function (string): tham số tên 'string' nhận giá trị của {string}.
When("I run {string}", function (string) {
  console.log(string)
  this.stdout = string;
  
  })

  // async function = hàm có dùng await (chờ thao tác trình duyệt xong mới chạy dòng tiếp).
  // Step này dùng this.dashboardPage và this.orderId do các step trước lưu vào World.
  Then('Verify order is present in the OrderHistory', async function () {
    // Write code here that turns the phrase above into concrete actions
    await this.dashboardPage.navigateToOrders();
   const ordersHistoryPage = poManager.getOrdersHistoryPage();
   await ordersHistoryPage.searchOrderAndSelect(this.orderId);
   // includes = chuỗi có chứa chuỗi con; expect(...).toBeTruthy() ≈ Should Be True.
   expect(this.orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
  });

  // Checkout, chọn quốc gia India, submit và lưu mã đơn hàng vào this.orderId cho step sau dùng.
  When('Enter valid details and Place the Order', async function () {
    // Write code here that turns the phrase above into concrete actions
    await this.cartPage.Checkout();

    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind","India");
    this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(this.orderId);
  });

  // productName nhận giá trị {string}, ví dụ "zara coat 3".
  Then('Verify {string} is displayed in the Cart', async function (productName) {
    // Write code here that turns the phrase above into concrete actions
    this.cartPage = poManager.getCartPage();
    await this.cartPage.VerifyProductIsDisplayed(productName);
  });

  // Tìm sản phẩm, thêm vào giỏ rồi mở trang giỏ hàng; lưu dashboardPage vào World.
  When('Add {string} to Cart', async function (productName) {
    // Write code here that turns the phrase above into concrete actions
     this.dashboardPage = poManager.getDashboardPage();
     await this.dashboardPage.searchProductAddCart(productName);
     await this.dashboardPage.navigateToCart();
  });

  // {timeout: 100 * 1000} = timeout riêng cho step này 100 giây (mặc định Cucumber 5 giây) ≈ [Timeout] của keyword.
  // Hai {string} -> hai tham số username, password theo đúng thứ tự trong câu.
  Given('a login to Ecommerce application with {string} and {string}', {timeout: 100 * 1000}, async function (username,password) {

       // new POManager(this.page) = tạo đối tượng quản lý các Page Object, dùng tab của scenario hiện tại.
       poManager = new POManager(this.page);
    //js file- Login js, DashboardPage
     // 'products' khai báo nhưng không dùng.
     const products = this.page.locator(".card-body");
     const loginPage = poManager.getLoginPage();
     await loginPage.goTo();
     await loginPage.validLogin(username,password);
   
    });



// Step mẫu: assert.equal ≈ Should Be Equal.
Then("the stdout should contain {string}", function (string) {
  assert.equal(this.stdout, string)
})
      // Step mẫu dùng regex /^a table step$/ thay cho chuỗi; 'table' = DataTable (bảng | ... | ngay dưới step). Không feature nào dùng.
      Given(/^a table step$/, function(table) {
        const expected = [
          ['Apricot', '5'],
          ['Brocolli', '2'],
          ['Cucumber', '10']
        ]
        assert.deepEqual(table.rows(), expected)
      })


      // Step login sai (dùng cho kịch bản kiểm tra lỗi). Lưu ý: bỏ qua tham số username/password, dùng giá trị cứng bên dưới.
      Given('a login to Ecommerce2 application with {string} and {string}', {timeout: 100 * 1000}, async function (username,password) {
        
        // Dòng bị comment out dưới: ví dụ chặn tải ảnh (jpg/png/jpeg) để trang load nhanh hơn.
        // page.route('**/*.{jpg,png,jpeg}',route=> route.abort());
          // locator ≈ khai báo locator; phần tử chỉ được tìm khi thực hiện thao tác (tự chờ phần tử xuất hiện).
          // ('this.page .locator' có khoảng trắng trước dấu chấm vẫn hợp lệ.)
          const userName = this.page .locator('#username');
          const signIn = this.page .locator("#signInBtn");
          const cardTitles =  this.page .locator(".card-body a");
          // goto ≈ Go To; title() ≈ Get Title.
          await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
          console.log(await this.page.title());
          //css 
         // fill ≈ Input Text; click ≈ Click Element.
         await userName.fill("rahulshetty");
         await this.page .locator("[type='password']").fill("learning");
         await signIn.click();   
        });


        // expect(locator).toContainText ≈ Element Should Contain, tự thử lại tới hết expect timeout.
        // [style*='block'] = CSS: phần tử có thuộc tính style chứa 'block' (thông báo lỗi đang hiển thị).
        Then('Verify Error message is displayed', async function () {
          await expect(this.page .locator("[style*='block']")).toContainText('Incorrect');

        })
