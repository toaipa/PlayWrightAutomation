/*
 * FILE: utils_ts/APiUtils.ts  (bản TypeScript của utils/APiUtils.js)
 * ≈ một resource file chứa keyword gọi API bằng RequestsLibrary.
 *  - getToken(): POST /auth/login -> lấy token từ JSON body.
 *  - createOrder(orderPayLoad): lấy token rồi POST /order/create-order (header Authorization = token)
 *    -> trả về {token, orderId}.
 * TypeScript = JavaScript + khai báo kiểu: 'tên: kiểu' (vd  loginPayLoad: string, apiContext: any).
 */
// export class = khai báo class và công khai cho file khác import. class = khuôn mẫu gom dữ liệu + hàm (≈ resource).
export class APiUtils
{
    // Khai báo thuộc tính của class kèm kiểu: any = kiểu bất kỳ (không kiểm tra), string = chuỗi.
    apiContext:any;
    loginPayLoad:string;

    // constructor chạy khi gọi new APiUtils(...); this = chính object đó, lưu lại phiên API (≈ session) và body login.
    constructor(apiContext:any,loginPayLoad:string)
    {
        this.apiContext =apiContext; 
        this.loginPayLoad = loginPayLoad;
        
    }

    // async method ≈ Keyword 'Get Token'; trả về Promise nên bên gọi phải await.
    async getToken()
     {
        // apiContext.post(url, {data}) ≈ POST On Session; data tự chuyển thành JSON body.
        const loginResponse =  await  this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data:this.loginPayLoad
         } )//200,201,
        // response.json() = lấy JSON body thành object; lấy trường token.
        const loginResponseJson = await loginResponse.json();
        const token =loginResponseJson.token;
        console.log(token);
        // return ≈ RETURN
        return token;

    }

    // ≈ Keyword 'Create Order'  ${orderPayLoad}
    async createOrder(orderPayLoad:string)
    {
        // Object kết quả có 2 key token, orderId (giá trị 'String' ban đầu chỉ là chỗ giữ chỗ, sẽ bị ghi đè ngay).
        let response = {token : String,orderId : String};
       response.token = await this.getToken();
    // POST tạo đơn kèm header Authorization = token (≈ POST On Session ... headers=&{headers}).
    const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
   {
    data : orderPayLoad,
    headers:{
                'Authorization' :response.token,
                'Content-Type'  : 'application/json'
            },

   })
   // Lấy JSON body; orders[0] = mã đơn đầu tiên trong list.
   const orderResponseJson =await orderResponse.json();
   console.log(orderResponseJson);
  const orderId = orderResponseJson.orders[0];
   response.orderId = orderId;

   // Trả về {token, orderId}.
   return response;
}



    }
// module.exports = cách công khai kiểu cũ (CommonJS), ở đây dùng song song với 'export class' phía trên.
module.exports = {APiUtils};




