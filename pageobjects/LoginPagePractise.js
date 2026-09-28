/*
 * LoginPagePractise - Trang luyện tập đăng nhập https://rahulshettyacademy.com/loginpagePractise/.
 * Chứa các thao tác: mở trang, đăng nhập (tick ô đồng ý điều khoản).
 *
 * So sánh với Robot Framework (SeleniumLibrary):
 *  - Một Page Object class ≈ một resource file riêng cho màn hình này.
 *  - Locator khai báo trong constructor ≈ phần *** Variables *** chứa locator.
 *  - Mỗi method async ≈ một keyword người dùng tự viết trong *** Keywords ***.
 */
// class = "khuôn" để tạo đối tượng page object (test sẽ gọi new ...(page) để tạo).
class LoginPagePractise {

// constructor(page) = hàm tự chạy khi tạo đối tượng: new XxxPage(page).
// page = tab trình duyệt đang mở (giống trình duyệt hiện tại mà SeleniumLibrary đang điều khiển).
constructor(page)
{
    // this.xxx = thuộc tính (biến) của đối tượng, method nào trong class cũng dùng được (≈ biến ${xxx} trong resource).
    this.page = page;
    // Locator là "lazy": chỉ khai báo CÁCH tìm, chưa tìm phần tử ngay; chỉ tìm khi thực sự thao tác (click, fill...).
    // "#username" = CSS theo id (≈ id:username).
    this.userName = page.locator("#username");
    this.password = page.locator("#password");
    this.termsCheckbox = page.locator("#terms");
    this.signInButton = page.locator("#signInBtn");
}

// Keyword: mở trang đăng nhập. page.goto(url) ≈ Go To (hoặc Open Browser).
// async = method có thao tác trình duyệt. Mỗi thao tác trả về Promise ("hẹn sẽ có kết quả"),
// nên BẮT BUỘC có await phía trước để chờ xong mới chạy dòng kế (RF tự chờ từng keyword, JS thì không).
async goTo()
{
    await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
}

// Keyword: nhập username + password, tick ô terms, bấm Sign In, chờ trang tải xong.
// username, password = tham số (≈ [Arguments]  ${username}  ${password}). fill ≈ Input Text.
async validLogin(username, password)
{
    await this.userName.fill(username);
    await this.password.fill(password);
    // check() ≈ Select Checkbox (đánh dấu ô checkbox).
    await this.termsCheckbox.check();
    // click ≈ Click Element.
    await this.signInButton.click();
    // waitForLoadState('networkidle') ≈ chờ trang hết request mạng (không còn gọi API) rồi mới đi tiếp.
    await this.page.waitForLoadState('networkidle');
}

}
// module.exports = xuất class ra để file khác require() được (≈ cho phép file khác import resource này).
module.exports = {LoginPagePractise};