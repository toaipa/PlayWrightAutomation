/*
 * FILE: utils_ts/test-base.ts  (bản TypeScript của utils/test-base.js)
 * ≈ nơi định nghĩa dữ liệu test dùng chung (fixture Playwright).
 * baseTest.extend(...) tạo 'customTest' = test có thêm fixture testDataForOrder {username, password, productName}
 * (≈ Test Setup trả về giá trị / Variables dùng chung). Được dùng bởi: tests/ClientAppPO.spec.ts
 */

// import {test as baseTest} = nạp 'test' từ Playwright và đặt tên khác là baseTest (≈ Library ... AS ...).
import {test as baseTest} from '@playwright/test';
// interface = mô tả 'hình dạng' dữ liệu: object phải có các key này với kiểu này (string = chuỗi).
// Chỉ để TypeScript kiểm tra khi viết code, không chạy lúc test.
interface TestDataForOrder {
    username: string;
    password: string;
    productName: string;
};
// export const = công khai biến cho file khác import; const = không gán lại được.
// extend<{...}> : phần trong < > khai báo kiểu của fixture để editor gợi ý và báo lỗi nếu dùng sai.
export const customTest = baseTest.extend<{testDataForOrder:TestDataForOrder}>(
{
// Fixture dạng giá trị tĩnh (≈ dictionary). Tài khoản demo; thực tế nên để ở biến môi trường.
testDataForOrder :    {
    username : "anshikaw@gmail.com",
    password : "Learning@830$3mK3",
    productName:"ADIDAS ORIGINAL"
    
    }

}

)




