// ===================================================================================
// HOOKS CỦA CUCUMBER: code tự chạy trước/sau mỗi scenario hoặc mỗi step. Cucumber tự nạp file này vì nằm trong features/.
//   Before / After         ≈ Test Setup / Test Teardown (chạy cho MỖI scenario).
//   BeforeAll / AfterAll   ≈ Suite Setup / Suite Teardown (chạy 1 lần; file này không dùng).
//   AfterStep              = chạy sau mỗi step (RF không có tương đương trực tiếp, gần nhất là listener end_keyword).
//   Tagged hook: Before({tags: '@Regression'}, async function () {...}) chỉ chạy cho scenario có tag đó (file này không dùng).
// Ở đây: Before mở trình duyệt + tab mới, AfterStep chụp màn hình khi step fail, After chỉ in log.
// ===================================================================================
// require('...') ≈ `Library` trong *** Settings ***. const = biến không gán lại được.
// { After, Before, ... } = lấy riêng từng hàm từ thư viện. Status = các hằng trạng thái step (PASSED, FAILED...).
const {After, Before,AfterStep,Status} = require('@cucumber/cucumber');
const playwright = require('@playwright/test');
// Before(async function () {...}) = đăng ký hàm chạy trước mỗi scenario.
// async = trong hàm có dùng await (chờ thao tác bất đồng bộ như mở trình duyệt xong mới chạy tiếp).
// Phải viết 'function' (không dùng arrow '=>') thì mới dùng được 'this' (World) bên dưới.
Before(async function () {
    // This hook will be executed before all scenarios
    // (Chính xác: chạy trước MỖI scenario, không phải một lần cho tất cả.)
    console.log("i am first");
    // ≈ Open Browser với Chromium; headless: false = hiện cửa sổ trình duyệt.
    const browser = await playwright.chromium.launch({
      headless: false,
  });
  // context = phiên trình duyệt độc lập (cookie riêng); newPage() = mở một tab.
  const context = await browser.newContext();
    // this = 'World': object riêng của từng scenario, dùng chia sẻ biến giữa hook và các step (≈ Set Test Variable).
    // this.page sẽ được dùng trong features/step_definitions/steps.js.
    this.page =  await context.newPage();
  });

  // AfterStep nhận tham số; ({result}) = lấy riêng thuộc tính 'result' (kết quả của step vừa chạy).
  AfterStep( async function ({result}) {
    // This hook will be executed after all steps, and take a screenshot on step failure
    // === là phép so sánh bằng (chặt).
    if (result.status === Status.FAILED) {
      // buffer = ảnh chụp màn hình dạng dữ liệu trong bộ nhớ (chưa lưu file).
      const buffer = await this.page.screenshot();
      // Chụp thêm một lần và lưu ra file screenshot1.png (bị ghi đè mỗi lần có step fail).
      await this.page.screenshot({ path: 'screenshot1.png' });
      // attach = nhúng ảnh (mã hoá base64) vào report Cucumber (≈ ảnh chụp nhúng trong log.html).
      this.attach(buffer.toString('base64'), 'base64:image/png');
      console.log("Screenshot logged")

    }
  });
  // After ≈ Test Teardown: chạy sau mỗi scenario (hiện chỉ in log, KHÔNG đóng trình duyệt).
  After(async function () {
    // Assuming this.driver is a selenium webdriver
    console.log("i am last");
    
    
  });

  
