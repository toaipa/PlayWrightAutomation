/*
 * FILE: demo1.ts
 * Không phải file test: ví dụ TypeScript (JS có khai báo kiểu dữ liệu).
 * TypeScript báo lỗi ngay khi viết nếu gán sai kiểu (vd gán số cho biến string),
 *   giúp tránh lỗi như add(3, "4") trong demo.spec.js. Biên dịch ra demo1.js.
 */
// import ≈ require ≈ Library trong RF: nạp expect và các kiểu Locator, Page từ Playwright
//   (ở file này chưa dùng).
import { expect, type Locator, type Page } from '@playwright/test';
// ': string' khai báo kiểu cho biến: chỉ được chứa chuỗi.
let message1 : string = "Hello";
message1 = "bye";
console.log(message1);
// number = số; boolean = true/false; number[] = mảng số.
let age1:number = 20;
console.log(age1);
let isActive : boolean = false;

let numberArry : number[] = [1,2,3];

// any = kiểu bất kỳ (tắt kiểm tra kiểu), nên gán số vẫn được.
let data : any = "this could be anything";
data =42;
// Hàm có khai báo kiểu tham số và kiểu trả về (': number' sau dấu ngoặc).
function add(a:number,b:number): number
{
    return a+b;
}

add(3,4);

// Object với kiểu mô tả rõ các thuộc tính name, age, location.
let user: {name:string,age:number,location:string} = { name: "Bob",age:34,location:"delhi"};
user.location = "hyderabad";















