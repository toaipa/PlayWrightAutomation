// ===================================================================================
// CẤU HÌNH CUCUMBER.JS (framework chạy BDD: file .feature + step definitions).
// Khi chạy `npx cucumber-js`, Cucumber tự đọc file này. Mặc định nó tìm features/**/*.feature
// và tự nạp code .js trong features/ (step_definitions/steps.js, support/hooks.js).
// Tương đương RF: argument file cho lệnh `robot`.
// ===================================================================================
// module.exports = xuất object cấu hình ra ngoài. Object { key: value } ≈ Dictionary.
// 'default' = profile mặc định (≈ một argument file); có thể thêm profile khác và chọn bằng --profile <tên>.
module.exports = {
  // --publish-quiet: tắt thông báo mời publish report lên reports.cucumber.io (option cũ, có thể không còn ở bản Cucumber mới).
  default: "--publish-quiet",
}
// Các lệnh mẫu (đã comment out): --exit = thoát hẳn khi chạy xong; --parallel 2 ≈ pabot --processes 2;
// --format html:cucumber-report.html ≈ tạo report HTML (như report.html của RF).
//npx cucumber-js features/ErrorValidation.feature --exit
//npx cucumber-js --parallel 2 --exit --format html:cucumber-report.html
//npx cucumber-js features/greeting.feature --parallel 2 --exit --format html:cucumber-report.html