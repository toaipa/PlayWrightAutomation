/*
 * FILE: upload-download.spec.js
 * Mục đích: test tải xuống (download) file Excel, sửa file bằng thư viện exceljs,
 *   rồi tải lên (upload) lại và kiểm tra giá trị mới hiển thị trên bảng web.
 * Luồng: mở trang -> bấm Download -> sửa giá Mango thành 350 trong file .xlsx
 *   -> upload file -> kiểm tra dòng 'Mango' trên bảng có giá 350.
 * Gồm 2 hàm hỗ trợ (≈ User Keyword trong phần *** Keywords ***) và 1 test case.
 * ≈ một file .robot test suite chứa 1 Test Case + 2 keyword tự viết.
 */
// require(...) ≈ Library trong RF. 'exceljs' là thư viện đọc/ghi Excel
//   (≈ thư viện ExcelLibrary / openpyxl trong RF).
const ExcelJs =require('exceljs');
// Nạp 'test' (khai báo test case) và 'expect' (assertion) của Playwright.
const { test, expect } = require('@playwright/test');

// async function ≈ User Keyword: tìm ô chứa searchText, rồi ghi replaceText vào ô
//   lệch sang phải change.colChange cột (cùng dòng), rồi lưu file.
//   async: bên trong có thao tác đọc/ghi file trả về Promise nên dùng 'await' để chờ xong.
async function writeExcelTest(searchText,replaceText,change,filePath)
{
    
  // const: biến không gán lại được. 'new' tạo một workbook rỗng rồi đọc file vào.
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);
  // Lấy sheet tên 'Sheet1'.
  const worksheet = workbook.getWorksheet('Sheet1');
  // Gọi keyword readExcel để lấy vị trí {row, column} của ô cần tìm.
  const output= await readExcel(worksheet,searchText);

  // Ô cần sửa: cùng dòng, cột = cột tìm được + colChange (rowChange không được dùng).
  const cell = worksheet.getCell(output.row,output.column+change.colChange);
  cell.value = replaceText;
  // Ghi đè file Excel sau khi sửa.
  await workbook.xlsx.writeFile(filePath);

}


// Keyword tìm ô có giá trị bằng searchText, trả về vị trí dòng/cột (-1 nếu không thấy).
async function readExcel(worksheet,searchText)
{
    // let: biến có thể gán lại. Object {row, column} ≈ &{dictionary}.
    let output = {row:-1,column:-1};
    // eachRow/eachCell duyệt mọi dòng, mọi ô (≈ 2 vòng FOR lồng nhau).
    //   (row, rowNumber) => {...} là arrow function: hàm được gọi cho từng dòng.
    worksheet.eachRow((row,rowNumber) =>
    {
          row.eachCell((cell,colNumber) =>
          {
              if(cell.value === searchText)
              {
                  output.row=rowNumber;
                  output.column=colNumber;
              }
  
  
          }  )
    
    })
    return output;
}
// (Comment sẵn) Ví dụ gọi trực tiếp hàm để đổi giá Mango thành 350.
//update Mango Price to 350. 
//writeExcelTest("Mango",350,{rowChange:0,colChange:2},"/Users/rahulshetty/downloads/excelTest.xlsx");
// test('tên', async ({page}) => {...}) ≈ một Test Case; {page} là fixture tab trình duyệt.
test('Upload download excel validation',async ({page})=>
{
  const textSearch = 'Mango';
  const updateValue = '350';
  // page.goto ≈ Go To.
  await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
  // Bắt đầu lắng nghe sự kiện 'download' TRƯỚC khi click (không await ngay).
  const downloadPromise = page.waitForEvent('download');
  // Click nút Download ≈ Click Button.
  await page.getByRole('button',{name:'Download'}).click();
  // Chờ việc tải file hoàn tất.
  // LƯU Ý: không gọi download.saveAs(...) nên file thường không được lưu vào đường dẫn
  //   /Users/rahulshetty/downloads/download.xlsx mà hàm dưới đang đọc (đường dẫn cứng của tác giả).
  await downloadPromise;
  // Sửa file Excel: giá của Mango (cột lệch 2 so với cột tên) thành 350.
  // LƯU Ý: thiếu 'await' nên có thể upload trước khi ghi file xong.
  writeExcelTest(textSearch,updateValue,{rowChange:0,colChange:2},"/Users/rahulshetty/downloads/download.xlsx");
  await page.locator("#fileinput").click();
  // setInputFiles ≈ Choose File: chọn file để upload vào ô <input type=file>.
  await page.locator("#fileinput").setInputFiles("/Users/rahulshetty/downloads/download.xlsx");
  // Locator theo text 'Mango' (lazy, chưa tìm ngay).
  const textlocator = page.getByText(textSearch);
  // Lọc các dòng bảng (role 'row') có chứa phần tử 'Mango' ở trong.
  const desiredRow = await page.getByRole('row').filter({has :textlocator });
  // Trong dòng đó, ô giá (id cell-4-undefined) phải chứa '350' ≈ Element Should Contain (tự chờ).
  await expect(desiredRow.locator("#cell-4-undefined")).toContainText(updateValue);




















})







