/*
 * FILE: utils/test-base.js
 * ≈ nơi định nghĩa dữ liệu test dùng chung (dạng fixture của Playwright).
 * base.test.extend({...}) tạo 'customtest1' = test có thêm fixture testDataForOrder {username, password, productName}.
 * Test nào ghi testDataForOrder trong { } sẽ nhận object này (≈ Test Setup trả về giá trị / Variables dùng chung).
 * Được dùng bởi: tests/ClientAppPO.spec.js
 */
// require = nạp thư viện (≈ Library); base = toàn bộ @playwright/test. const = biến không gán lại.
const base = require('@playwright/test');


// exports.customtest1 = công khai ra ngoài cho file khác require; extend({...}) = định nghĩa fixture.
exports.customtest1 = base.test.extend(
{
// Fixture dạng giá trị tĩnh: object {key: value} ≈ dictionary. Tài khoản demo; thực tế nên để ở biến môi trường.
testDataForOrder :    {
    username : "anshikaw@gmail.com",
    password : "Learning@830$3mK3",
    productName:"ADIDAS ORIGINAL"
    
    }

}

)




