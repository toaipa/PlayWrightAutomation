// ===================================================================================
// CẤU HÌNH CHẠY TRÌNH DUYỆT TRÊN CLOUD (Azure Playwright Workspaces).
// Test vẫn chạy trên máy local/CI, nhưng trình duyệt được mở trên máy của Azure.
// Dùng trong pipeline .github/workflows/playwright.yml: npx playwright test --config=playwright.service.config.js
// Tương đương RF gần nhất: SeleniumLibrary dùng Selenium Grid / remote_url (trình duyệt chạy ở máy khác).
// ===================================================================================
// require('...') ≈ `Library` trong *** Settings ***. const = biến không gán lại được.
// { defineConfig } = chỉ lấy hàm defineConfig (hàm hỗ trợ tạo/gộp cấu hình Playwright).
const { defineConfig } = require('@playwright/test');
// Thư viện Azure: createAzurePlaywrightConfig tạo phần cấu hình kết nối cloud; ServiceOS dùng để chọn hệ điều hành máy trên cloud.
const { createAzurePlaywrightConfig, ServiceOS } = require('@azure/playwright');
// DefaultAzureCredential: tự tìm thông tin đăng nhập Azure (từ `az login` trên máy, hoặc bước 'Azure Login' trong GitHub Actions).
const { DefaultAzureCredential } = require('@azure/identity');
// Nạp toàn bộ config chính từ playwright.config.js (./ = cùng thư mục) để làm nền.
const config = require('./playwright.config');

/* Learn more about service configuration at https://aka.ms/pww/docs/config */
// export default = xuất cấu hình ra ngoài (cách viết ES module, tương tự module.exports ở các file khác).
// Lưu ý: file này trộn require (CommonJS) và export (ES module); Playwright vẫn đọc được vì nó tự biên dịch file config.
// defineConfig(A, B, C): gộp các phần cấu hình, phần sau đè phần trước: A = config gốc, B = phần Azure, C = reporter riêng.
export default defineConfig(
  config,
  createAzurePlaywrightConfig(config, {
    // exposeNetwork '<loopback>': cho trình duyệt trên cloud truy cập được localhost của máy đang chạy test.
    exposeNetwork: '<loopback>',
    // connectTimeout: thời gian chờ tối đa để kết nối tới trình duyệt trên cloud.
    connectTimeout: 3 * 60 * 1000, // 3 minutes
    // os: máy trình duyệt trên cloud chạy Linux.
    os: ServiceOS.LINUX,
    // new = tạo một đối tượng từ class (≈ khởi tạo Library kèm tham số).
    credential: new DefaultAzureCredential(),
  }),
  {
    /*
    Enable Playwright Workspaces Reporter:
    Uncomment the reporter section below to upload test results and reports to Playwright Workspaces.

    Note: The HTML reporter must be included before Playwright Workspaces Reporter.
    This configuration will replace any existing reporter settings from your base config.
    If you're already using other reporters, add them to this array.
    */
    // reporter là mảng nhiều reporter: HTML report (open: 'never' = không tự mở trình duyệt xem report) + upload kết quả lên Azure.
    // (Phần này thực tế đã được bật sẵn, dù comment phía trên nói 'Uncomment'.)
    reporter: [
     ["html", { open: "never" }],
     ["@azure/playwright/reporter"],
    ],
  }
);
