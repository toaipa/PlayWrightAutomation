/*
 * FILE: UIBasicstest.spec.js
 * Mục đích: các bài test UI cơ bản trên trang login luyện tập
 *   https://rahulshettyacademy.com/loginpagePractise/
 * Gồm 3 test case (≈ một file .robot test suite có 3 Test Case):
 *   1. Đăng nhập sai -> kiểm tra thông báo lỗi, rồi đăng nhập đúng -> in tiêu đề sản phẩm.
 *   2. Thao tác các control: dropdown, radio, checkbox, kiểm tra thuộc tính link.
 *   3. Xử lý cửa sổ con (tab mới): click link mở tab mới, lấy text ở tab mới,
 *      quay về tab cũ điền vào ô username.
 * Tag: chữ "@Web", "@Child" trong tên test đóng vai trò như [Tags] trong RF,
 *   chạy lọc bằng: npx playwright test --grep @Web  (≈ robot --include Web).
 */
 // require(...) ≈ Library trong RF: nạp thư viện Playwright Test.
 // const {test, expect} = ... : lấy 2 thứ từ thư viện: 'test' (để khai báo Test Case)
 //   và 'expect' (để viết assertion, ≈ các keyword Should Be ...).
 // const = biến hằng (không gán lại được); let = biến có thể gán lại (≈ ${var} trong RF).
 const {test, expect} = require('@playwright/test');



 // (Đã comment sẵn) Nếu bật: chạy các test trong file này bằng trình duyệt WebKit (Safari)
 //   ≈ Open Browser ... browser=safari.
 //test.use({ browserName: 'webkit'});
 // test('tên', async ({browser}) => { ... }) ≈ một Test Case trong RF.
 //   - async: hàm bất đồng bộ; bên trong phải dùng 'await' trước mỗi thao tác vì mỗi thao tác
 //     trả về Promise (kết quả 'sẽ có sau'). RF tự chạy tuần tự, JS thì phải await để chờ xong.
 //   - ( ... ) => { ... } là arrow function (hàm viết gọn), ≈ phần thân của Test Case.
 //   - {browser} là 'fixture': Playwright tự tạo sẵn và đưa vào (≈ Suite Setup mở browser).
 //     Ở đây nhận 'browser' để tự tạo context/page thay vì dùng 'page' có sẵn.
 test('@Web Browser Context-Validating Error login', async ({browser})=>
 {
   
      // newContext() tạo một phiên trình duyệt sạch (cookie/storage riêng) ≈ một profile ẩn danh mới.
      const context = await browser.newContext();
      // newPage() mở một tab mới trong context ≈ Open Browser (tab đầu tiên).
      const page =  await context.newPage();
    // (Đã comment sẵn) Nếu bật: chặn tải mọi ảnh jpg/png/jpeg để trang load nhanh hơn.
    // page.route('**/*.{jpg,png,jpeg}',route=> route.abort());
      // page.locator('css') khai báo locator (≈ biến locator trong RF: css:#username).
      // Locator là 'lazy': dòng này CHƯA tìm phần tử, chỉ khi thao tác (fill/click...) mới tìm.
      const userName = page.locator('#username');
      const signIn = page.locator("#signInBtn");
      // Locator này có thể khớp NHIỀU phần tử (các link tiêu đề sản phẩm).
      const cardTitles =  page.locator(".card-body a");
      // page.on('request', ...) đăng ký hàm lắng nghe: mỗi request mạng thì in URL ra console
      //   (console.log ≈ Log To Console). Không có keyword tương đương trực tiếp trong SeleniumLibrary.
      page.on('request',request=> console.log(request.url()));
      // Tương tự: in URL + mã HTTP status của mỗi response.
      page.on('response',response=> console.log(response.url(), response.status()));
      // page.goto(url) ≈ Go To.
      await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
      // page.title() ≈ Get Title; in ra console.
      console.log(await page.title());
      //css 
     // fill ≈ Input Text (xoá nội dung cũ rồi gõ giá trị mới).
     await userName.fill("rahulshetty");
     // Locator viết thẳng rồi fill luôn: ô có thuộc tính type='password' ≈ Input Password.
     await page.locator("[type='password']").fill("Learning@830$3mK2");
     // click ≈ Click Element / Click Button. Playwright tự chờ (auto-wait) phần tử hiển thị,
     //   enable, ổn định rồi mới click - không cần Wait Until Element Is Visible.
     await signIn.click();
    // textContent() ≈ Get Text: lấy text của thông báo lỗi (phần tử có style chứa 'block').
    console.log(await page.locator("[style*='block']").textContent());
    // expect(locator).toContainText('Incorrect') ≈ Element Should Contain,
    //   nhưng tự chờ/thử lại tới khi đúng hoặc hết timeout (mặc định 5s).
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
    //type - fill
    // fill("") ≈ Clear Element Text; sau đó nhập username đúng.
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    // first() = phần tử đầu tiên trong danh sách khớp; nth(1) = phần tử thứ 2 (đếm từ 0).
    console.log(await cardTitles.first().textContent());
   console.log(await cardTitles.nth(1).textContent());
   // allTextContents() lấy text của TẤT CẢ phần tử khớp -> trả về mảng (≈ list trong RF).
   // Lưu ý: hàm này KHÔNG tự chờ; ở đây chạy được vì dòng trên đã chờ phần tử đầu tiên.
   const allTitles = await cardTitles.allTextContents();
   
   console.log(allTitles);

 });
 

 // Test Case 2: dùng fixture {page} - Playwright tự tạo sẵn tab mới cho test này.
 test('@Web UI Controls', async ({page})=>
 {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const signIn = page.locator("#signInBtn");
    const documentLink = page.locator("[href*='documents-request']");
    const dropdown = page.locator("select.form-control");
    // selectOption("consult") ≈ Select From List By Value (chọn option có value='consult').
    await dropdown.selectOption("consult");
    // last() = phần tử cuối cùng: click radio cuối (ô 'User') ≈ Select Radio Button / Click Element.
    await page.locator(".radiotextsty").last().click();
    // Click nút 'Okay' trong popup xác nhận xuất hiện sau khi chọn radio 'User'.
    await page.locator("#okayBtn").click();
    // isChecked() trả về true/false ngay (không chờ) ≈ Get Element Attribute checked.
    console.log(await page.locator(".radiotextsty").last().isChecked());
    // toBeChecked() ≈ Radio Button Should Be Set To / Checkbox Should Be Selected (có tự chờ).
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    // Click checkbox 'terms' ≈ Select Checkbox.
    await page.locator("#terms").click();
    await expect( page.locator("#terms")).toBeChecked();
    // uncheck() ≈ Unselect Checkbox.
    await page.locator("#terms").uncheck();
    // Cách assert KHÔNG tự chờ: lấy giá trị true/false trước rồi so sánh ≈ Checkbox Should Not Be Selected.
    // toBeFalsy() = kiểm tra giá trị là false.
    expect( await page.locator("#terms").isChecked()).toBeFalsy();
    // toHaveAttribute(tên, giá trị) ≈ Element Attribute Value Should Be (link đang có class 'blinkingText').
    await expect(documentLink).toHaveAttribute("class","blinkingText");
 });

 

 // Test Case 3: xử lý cửa sổ/tab con.
 test('@Child windows hadl', async ({browser})=>
 {
    const context = await browser.newContext();
    const page =  await context.newPage();
    const userName = page.locator('#username');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    // Promise.all([...]) chạy đồng thời 2 việc và chờ cả 2 xong:
    //   (1) bắt đầu lắng nghe sự kiện 'có tab mới', (2) click link mở tab mới.
    //   Phải chạy song song, vì nếu click trước rồi mới nghe thì có thể lỡ sự kiện.
    //   context.waitForEvent('page') ≈ Switch Window NEW trong RF.
    // const [newPage] = ... : lấy phần tử đầu của mảng kết quả = đối tượng tab mới.
    // Tab cũ vẫn là 'page', tab mới là 'newPage' - không cần 'switch' qua lại như Selenium.
    const [newPage]=await Promise.all(
   [
      context.waitForEvent('page'),//listen for any new page pending,rejected,fulfilled
      documentLink.click(),
   
   ])//new page is opened
   

   // Lấy text đoạn màu đỏ ở TAB MỚI (có chứa email) ≈ Get Text.
   const  text = await newPage.locator(".red").textContent();
    // split("@") cắt chuỗi theo ký tự '@' -> mảng; [1] là phần sau '@'
    //   (≈ Split String trong thư viện String của RF).
    const arrayText = text.split("@")
    // Tiếp tục cắt theo khoảng trắng, lấy phần đầu -> tên domain (vd rahulshettyacademy.com).
    const domain =  arrayText[1].split(" ")[0]
   //console.log(domain);
    // Quay lại tab CŨ (page) và điền domain vào ô username.
    await page.locator("#username").fill(domain);
    // inputValue() ≈ Get Value: lấy giá trị hiện có trong ô input, in ra console.
    console.log(await page.locator("#username").inputValue());




    
    





 })



 



