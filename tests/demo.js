/*
 * FILE: demo.js
 * Không phải file test: đoạn JavaScript thuần minh hoạ khai báo biến và kiểu dữ liệu động.
 * Chạy thử bằng: node tests/demo.js (in ra console). ≈ vài dòng Set Variable / Log To Console trong RF.
 */
// let khai báo biến có thể gán lại (≈ ${message}= Set Variable Hello).
let message = "Hello";
// JS không cố định kiểu: biến đang là chuỗi có thể gán thành số.
message = 2; 
// console.log ≈ Log To Console.
console.log(message);
let age = 20; 
console.log(age);

// Mảng (array) ≈ @{list} trong RF.
let numbers = [1,2,3];

// Object {khoá: giá trị} ≈ &{dictionary} trong RF.
let user= { name: "Bob",age:34};
// Có thể thêm thuộc tính mới vào object bất cứ lúc nào (≈ Set To Dictionary).
user.location = "hyderabad";