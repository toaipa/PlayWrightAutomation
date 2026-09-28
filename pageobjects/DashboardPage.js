/*
 * DashboardPage - Trang Dashboard (danh sách sản phẩm) sau khi đăng nhập.
 * Chứa các thao tác: tìm sản phẩm theo tên rồi Add To Cart, đi tới trang Orders, đi tới trang Cart.
 *
 * So sánh với Robot Framework (SeleniumLibrary):
 *  - Một Page Object class ≈ một resource file riêng cho màn hình này.
 *  - Locator khai báo trong constructor ≈ phần *** Variables *** chứa locator.
 *  - Mỗi method async ≈ một keyword người dùng tự viết trong *** Keywords ***.
 */
// class = "khuôn" để tạo đối tượng page object (test sẽ gọi new ...(page) để tạo).
class DashboardPage
{
// constructor(page) = hàm tự chạy khi tạo đối tượng: new XxxPage(page).
// page = tab trình duyệt đang mở (giống trình duyệt hiện tại mà SeleniumLibrary đang điều khiển).
constructor(page)
{
    // this.xxx = thuộc tính (biến) của đối tượng, method nào trong class cũng dùng được (≈ biến ${xxx} trong resource).
    this.page = page;
    // Locator là "lazy": chỉ khai báo CÁCH tìm, chưa tìm phần tử ngay; chỉ tìm khi thực sự thao tác (click, fill...).
    // .card-body = mỗi thẻ sản phẩm (nhiều phần tử).
    this.products = page.locator(".card-body");
    // Tên sản phẩm = thẻ <b> nằm trong mỗi thẻ sản phẩm.
    this.productsText = page.locator(".card-body b");
    this.cart =  page.locator("[routerlink*='cart']");
    this.orders = page.locator("button[routerlink*='myorders']");

}

// Keyword: duyệt từng thẻ sản phẩm, gặp thẻ có tên = productName thì bấm "Add To Cart".
// async = method có thao tác trình duyệt. Mỗi thao tác trả về Promise ("hẹn sẽ có kết quả"),
// nên BẮT BUỘC có await phía trước để chờ xong mới chạy dòng kế (RF tự chờ từng keyword, JS thì không).
async searchProductAddCart(productName)
{
   
    // allTextContents() ≈ lấy Get Text của TẤT CẢ phần tử khớp -> trả về list tên sản phẩm.
    const titles= await this.productsText.allTextContents();
    // console.log ≈ Log To Console.
    console.log(titles);
    // count() ≈ Get Element Count: số thẻ sản phẩm trên trang.
    const count = await this.products.count();
    // Vòng for: i chạy 0,1,...,count-1 (≈ FOR  ${i}  IN RANGE  ${count}). Chỉ số bắt đầu từ 0.
    for(let i =0; i < count; ++i)
    {
    // nth(i) ≈ chọn phần tử thứ i (từ 0); .locator("b") = tìm tiếp phần tử con bên trong thẻ đó.
    // textContent() ≈ Get Text. === là so sánh bằng tuyệt đối (≈ IF  '${text}' == '${productName}').
    if(await this.products.nth(i).locator("b").textContent() === productName)
    {
        //add to cart
        await this.products.nth(i).locator("text= Add To Cart").click();
        // break ≈ BREAK: thoát vòng lặp khi đã thêm xong.
        break;
     }
    }
}

// Keyword: bấm nút ORDERS trên thanh header -> sang trang lịch sử đơn hàng (≈ Click Element).
async navigateToOrders()
{
    await this.orders.click();
}


// Keyword: bấm nút Cart trên thanh header -> sang trang giỏ hàng (≈ Click Element).
async navigateToCart()
{
    await this.cart.click();
}

}
// module.exports = xuất class ra để file khác require() được (≈ cho phép file khác import resource này).
module.exports = {DashboardPage};