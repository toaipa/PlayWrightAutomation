/*
 * FILE: demo1.js
 * Không phải file test: đây là file JavaScript được sinh ra khi biên dịch demo1.ts
 *   bằng TypeScript (tsc) - các khai báo kiểu đã bị xoá, let đổi thành var.
 */
// var: cách khai báo biến kiểu cũ của JS (hiện nay nên dùng let/const).
var message1 = "Hello";
message1 = "bye";
console.log(message1);
var age1 = 20;
console.log(age1);
var isActive = false;
var numberArry = [1, 2, 3];
var data = "this could be anything";
data = 42;
// Hàm cộng 2 số ≈ User Keyword có tham số và RETURN.
function add(a, b) {
    return a + b;
}
add(3, 4);
// Object ≈ &{dictionary}; thêm thuộc tính location sau khi tạo.
var user = { name: "Bob", age: 34 };
user.location = "hyderabad";
