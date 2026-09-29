// ===================================================================================
// FILE CẤU HÌNH CHÍNH CỦA PLAYWRIGHT (được dùng mặc định khi chạy `npx playwright test`).
// Tương đương RF: argument file truyền cho lệnh `robot` (--argumentfile) + phần cấu hình chung
// (thư mục test, timeout, log/report, trình duyệt...). File này KHÔNG chứa test case.
// Dùng file cấu hình khác: npx playwright test --config=playwright.config1.js
// ===================================================================================
// (Dòng '@ts-check' bên dưới chỉ bật kiểm tra lỗi kiểu dữ liệu trong editor, không ảnh hưởng khi chạy.)
// @ts-check
// require('...') ≈ `Library` / `Resource` trong *** Settings ***: nạp thư viện vào file.
// const = khai báo biến không gán lại được. { devices } = chỉ lấy riêng thuộc tính 'devices' của thư viện
// (devices = danh sách thiết bị giả lập có sẵn; ở file này import nhưng không dùng tới).
const { devices } = require('@playwright/test');

// Object JS dạng { key: value, ... } ≈ một Dictionary trong RF. Toàn bộ cấu hình nằm trong object 'config'.
const config = {
  // testDir ≈ thư mục chứa các file .robot (nơi Playwright tìm test).
  testDir: './tests',
  // testMatch: chỉ chạy file có đuôi .spec.js ('**' = mọi thư mục con).
  testMatch: '**/*.spec.js',
  // retries ≈ --rerunfailed nhưng chạy lại ngay trong cùng lần chạy; 0 = không chạy lại test fail.
  retries :0,
  
  /* Maximum time one test can run for. */
  // timeout ≈ Test Timeout: 30 * 1000 ms = 30 giây cho mỗi test.
  timeout: 30 * 1000,
  // expect.timeout: thời gian một assertion (expect) tự thử lại cho tới khi đúng (≈ Wait Until Keyword Succeeds 5s).
  expect: {
  
    timeout: 5000
  },
  
  // reporter ≈ output log.html/report.html của RF; 'html' tạo thư mục playwright-report/ (xem bằng: npx playwright show-report).
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  // use.* = tuỳ chọn trình duyệt dùng chung cho mọi test (≈ các tham số của Open Browser).
  use: {

    // browserName ≈ biến ${BROWSER}: 'chromium' (Chrome/Edge), 'firefox', 'webkit' (Safari).
    browserName : 'chromium',
    // headless: true = chạy ẩn, không mở cửa sổ trình duyệt.
    headless : true,
    // screenshot: 'on' = luôn chụp màn hình cuối mỗi test; 'only-on-failure' = chỉ khi fail.
    screenshot : 'on',
    // trace: ghi lại từng thao tác + DOM + network để xem lại từng bước (npx playwright show-trace), chi tiết hơn log.html.
    trace : 'on',//off,on
    
    
    
  },


};

// module.exports = 'xuất' object ra ngoài để Playwright (hoặc file khác dùng require) đọc được.
module.exports = config;

//Chạy: https://playwright.dev/docs/test-cli
npx playwright test tests/UIBasicstest.spec.js -g "Web Browser Context-Validating Error login"
