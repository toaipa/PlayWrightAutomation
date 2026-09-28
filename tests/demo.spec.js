/*
 * FILE: demo.spec.js
 * Không chứa test case nào (không có test(...)); chỉ là đoạn JavaScript minh hoạ:
 *   biến đổi kiểu, hàm, object, require và class. Nếu Playwright quét file này
 *   sẽ báo "No tests found" cho file này.
 */
// let: biến có thể gán lại; JS cho phép đổi từ chuỗi sang số.
let message = "Hello";
message = 5;

// function ≈ một User Keyword trong RF có 2 tham số a, b và trả về (return ≈ RETURN) a + b.
function add(a, b) {
    return a + b;
  }
  // Gọi hàm với 3 và "4": JS tự nối chuỗi -> kết quả "34" chứ không phải 7 (lý do nên dùng TypeScript).
  add(3, "4"); 


  // const: không gán lại biến được, nhưng vẫn thêm được thuộc tính vào object.
  const person = { name: "Alice", age: 25 };
  person.favoriteColor = "blue";

  // require ≈ Library: nạp 'expect' của Playwright (ở đây không dùng).
  const { expect } = require("@playwright/test");


  // class: khuôn mẫu tạo object; constructor chạy khi tạo mới (new Person('...')).
  //   Gần giống một Library Python tự viết trong RF có __init__.
  class Person {
    constructor(name) {
      this.name = name;
    }
  }
  