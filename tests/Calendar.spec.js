/*
 * FILE: Calendar.spec.js
 * Mục đích: chọn một ngày trên date picker (React calendar) và kiểm tra
 *   ô ngày/tháng/năm hiển thị đúng giá trị đã chọn.
 * Luồng: mở trang offers -> mở lịch -> bấm tiêu đề 2 lần để lên chế độ chọn năm
 *   -> chọn năm -> chọn tháng -> chọn ngày -> đọc 3 ô input và so sánh.
 * ≈ một file .robot test suite chứa 1 Test Case.
 */
// require(...) ≈ Library trong RF: nạp 'test' (khai báo test case) và 'expect' (assertion).
// const = biến không gán lại được; let = biến gán lại được.
const {test,expect} = require("@playwright/test");
 
 
// test("tên", async ({page}) => {...}) ≈ một Test Case.
//   async/=>: hàm bất đồng bộ viết gọn; mọi thao tác trình duyệt phải có 'await' đứng trước
//   để chờ nó chạy xong (RF thì keyword tự chạy tuần tự).
//   {page} là fixture: Playwright tự mở sẵn một tab và đưa vào (≈ Open Browser trong Setup).
test("Calendar validations",async({page})=>
{
 
    // Dữ liệu test: ngày cần chọn 15/06/2027 (để dạng chuỗi vì so sánh với giá trị ô input).
    const monthNumber = "6";
    const date = "15";
    const year = "2027";
    // Mảng giá trị mong đợi theo thứ tự các ô trên giao diện: tháng, ngày, năm (≈ @{list} trong RF).
    const expectedList = [monthNumber,date,year];
    
    // page.goto ≈ Go To.
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    // Click vào ô ngày để mở popup lịch ≈ Click Element.
    await page.locator(".react-date-picker__inputGroup").click();
    // Bấm tiêu đề lịch 2 lần: lần 1 lên chế độ chọn tháng, lần 2 lên chế độ chọn năm/thập kỷ.
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    // getByText(year): tìm phần tử có text '2027' rồi click ≈ Click Element xpath=//*[text()='2027'].
    await page.getByText(year).click();
    // nth(index) chọn phần tử thứ index (đếm từ 0), nên tháng 6 -> index 5.
    // Number("6") đổi chuỗi sang số để trừ 1.
    await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();
    // Locator bắt đầu bằng // được hiểu là XPath; nối chuỗi bằng dấu + để tạo //abbr[text()='15'].
    await page.locator("//abbr[text()='"+date+"']").click();
    //calendar test

    // Locator khớp nhiều ô input (tháng, ngày, năm). Locator 'lazy': chưa tìm ngay.
    const inputs =  page.locator('.react-date-picker__inputGroup__input')

    // Vòng for: i chạy từ 0 đến (số phần tử - 1) ≈ FOR ${i} IN RANGE ${len} trong RF.
    for(let i =0; i<expectedList.length;i++)
    {
        // inputValue() ≈ Get Value: lấy giá trị ô input thứ i.
        const value = await inputs.nth(i).inputValue();
        // toEqual ≈ Should Be Equal. Lưu ý: expect trên GIÁ TRỊ thường (không phải locator)
        //   thì không tự chờ/thử lại, và không cần await.
        expect(value).toEqual(expectedList[i]);

    }

   
 
 
 
 
 
 
 
 
 
 
 
 
 
})