// ===================================================================================
// FILE CẤU HÌNH PLAYWRIGHT THỨ HAI (không phải mặc định). Chạy bằng:
//   npx playwright test --config playwright.config1.js --project=safari   (script 'SafariNewConfig' trong package.json)
// Tương đương RF: một argument file khác cho lệnh `robot` + cấu hình chung.
// Khác config chính: có retries, workers và 2 'projects' (safari giả lập iPhone + chrome).
// ===================================================================================
// (Dòng '@ts-check' bên dưới chỉ bật kiểm tra lỗi kiểu dữ liệu trong editor, không ảnh hưởng khi chạy.)
// @ts-check
// require('...') ≈ `Library` trong *** Settings ***. const = biến không gán lại được.
// { devices } = chỉ lấy thuộc tính 'devices' (danh sách thiết bị giả lập có sẵn, dùng ở project safari).
const { devices } = require('@playwright/test');

// Object JS { key: value, ... } ≈ Dictionary trong RF.
const config = {
  // testDir ≈ thư mục chứa các file .robot. Không có testMatch nên Playwright dùng mặc định (*.spec.* / *.test.*).
  testDir: './tests',
  // retries ≈ --rerunfailed nhưng chạy lại ngay trong cùng lần chạy: test fail được chạy lại tối đa 1 lần.
  retries :1,
  // workers ≈ pabot --processes 3: chạy song song 3 tiến trình.
  workers: 3,
  /* Maximum time one test can run for. */
  //10-
  // timeout ≈ Test Timeout (30 giây mỗi test).
  timeout: 30 * 1000,
  // expect.timeout: assertion tự thử lại tối đa 5 giây (≈ Wait Until Keyword Succeeds).
  expect: {
  
    timeout: 5000
  },
  
  // reporter ≈ log.html/report.html của RF (tạo thư mục playwright-report/).
  reporter: 'html',
  // projects = danh sách cấu hình chạy, mỗi project là một trình duyệt/thiết bị với 'use' riêng.
  // Mặc định chạy TẤT CẢ project (≈ chạy robot nhiều lần với --variable BROWSER khác nhau).
  // Chỉ chạy một project: --project=safari. [ ... ] = mảng (≈ List trong RF).
  projects : [
    {
      // name: tên project, dùng với --project=<name> và hiện trong report.
      name : 'safari',
      use: {
        // actionTimeout ≈ Set Selenium Timeout: chờ tối đa 5 giây cho mỗi thao tác (click, fill...).
        actionTimeout: 5000,
        // navigationTimeout ≈ Set Selenium Page Load Timeout: chờ tối đa 6 giây khi tải trang (goto).
        navigationTimeout : 6000,
        // webkit = engine trình duyệt của Safari.
        browserName : 'webkit',
        headless : true,
        screenshot : 'off',
        trace : 'on',//off,on 
        // ... (spread) = 'trải' toàn bộ key/value của object vào đây (≈ gộp Dictionary; key trùng thì giá trị sau đè giá trị trước).
        // devices['iPhone 11'] = giả lập điện thoại iPhone 11 (kích thước màn hình, user agent, cảm ứng...).
        ...devices['iPhone 11'],    
      }

    },
    {
      name : 'chrome',
      use: {

        browserName : 'chromium',
        // headless: false = mở cửa sổ trình duyệt thật (thấy được khi chạy).
        headless : false,
        screenshot : 'on',
        // video: 'retain-on-failure' = quay video mọi test, chỉ giữ lại video của test fail.
        video: 'retain-on-failure',
        // ignoreHttpsErrors: bỏ qua lỗi chứng chỉ HTTPS (vd môi trường test dùng cert tự ký).
        ignoreHttpsErrors:true,
        // permissions: cấp sẵn quyền cho trang web (ở đây: vị trí - geolocation) để không hiện popup xin quyền.
        permissions:['geolocation'],
        
        trace : 'on',//off,on
       // 2 dòng bị comment out bên dưới: ví dụ giả lập thiết bị khác / đặt kích thước cửa sổ (viewport) 720x720.
       // ...devices['']
     //   viewport : {width:720,height:720}
         }

    }
    ]

};

// module.exports = xuất object cấu hình ra ngoài để Playwright đọc.
module.exports = config;
