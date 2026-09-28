/*
 * FILE: utils/APiUtils.js
 * ≈ một resource file chứa keyword gọi API bằng RequestsLibrary.
 *  - getToken(): POST /auth/login với email/password -> lấy token từ JSON body.
 *  - createOrder(orderPayLoad): lấy token rồi POST /order/create-order (header Authorization = token)
 *    -> trả về {token, orderId} để test dùng tiếp (vd nhét token vào localStorage, tìm orderId trên UI).
 * Được dùng bởi: tests/WebAPIPart1.spec.js, tests/NetworkTest.spec.js, utils/fixtures.js.
 */
// class = khuôn mẫu gom dữ liệu + các hàm (method) liên quan; ở đây mỗi method ≈ một keyword.
class APiUtils {
    // constructor chạy khi gọi new APiUtils(apiContext, loginPayLoad) (≈ tham số khi import Library).
    constructor(apiContext, loginPayLoad) {
        // this = chính object đang tạo; lưu phiên API (≈ session của Create Session) và body login để các method dùng lại.
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    // async = hàm bất đồng bộ, trả về Promise; bên gọi phải await. ≈ Keyword 'Get Token'.
    async getToken() {
        // apiContext.post(url, {data}) ≈ POST On Session; data là object, tự chuyển thành JSON body.
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: this.loginPayLoad
        }); // 200, 201
        // response.json() = lấy JSON body của response thành object (≈ ${resp.json()}).
        const loginResponseJson = await loginResponse.json();
        // Lấy trường token trong body (≈ ${json}[token]).
        const token = loginResponseJson.token;
        console.log(token);
        // return ≈ RETURN / [Return] của keyword.
        return token;
    }

    // ≈ Keyword 'Create Order'  ${orderPayLoad}
    async createOrder(orderPayLoad) {
        // let response = {} = tạo dictionary rỗng (≈ Create Dictionary), gán dần token và orderId vào.
        let response = {};
        response.token = await this.getToken();
        // POST tạo đơn kèm header (≈ POST On Session ... json=${body} headers=&{headers}).
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayLoad,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
            }
        });

        // Lấy JSON body; orders là list mã đơn, [0] = phần tử đầu tiên (index bắt đầu từ 0).
        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson);
        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;

        // Trả về {token, orderId}.
        return response;
    }
}

// module.exports = công khai class để file khác require được (≈ cho phép file khác import resource này).
module.exports = { APiUtils };




