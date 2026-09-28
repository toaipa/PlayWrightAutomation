# ===================================================================================
# FILE GHERKIN (BDD) chạy bằng Cucumber.js: npx cucumber-js features/greeting.feature --exit
# RF cũng hỗ trợ Given/When/Then. Mỗi dòng Given/When/Then được nối với một hàm có câu trùng khớp
# trong features/step_definitions/steps.js (≈ keyword có tên trùng câu).
# Scenario 1: đăng nhập -> thêm sản phẩm vào giỏ -> kiểm tra giỏ -> đặt hàng -> kiểm tra lịch sử đơn hàng.
# Scenario 2: đăng nhập sai -> kiểm tra thông báo lỗi.
# ===================================================================================
# Feature ≈ một test suite (tên suite).
Feature: Greeting
		# @Regression = tag (≈ [Tags] trong RF), chỉ áp dụng cho scenario ngay bên dưới.
		# Chạy theo tag: npx cucumber-js --tags "@Regression" (≈ robot --include Regression).
		@Regression
		# Scenario Outline + Examples ≈ Test Template với bảng dữ liệu: chạy 1 lần cho mỗi dòng Examples,
		# <username>/<password> được thay bằng giá trị cột tương ứng.
		# Given = điều kiện ban đầu, When = hành động, Then = kiểm tra kết quả.
		Scenario Outline: Say hello
		Given a login to Ecommerce application with "<username>" and "<password>"
		# "zara coat 3" khớp {string} trong step definition -> truyền vào làm tham số productName.
		When Add "zara coat 3" to Cart
		Then Verify "zara coat 3" is displayed in the Cart
		When Enter valid details and Place the Order
		Then Verify order is present in the OrderHistory

		 # Examples: dòng đầu = tên cột, mỗi dòng sau = một lần chạy scenario.
		 Examples:
          | username    	  | 	password  |
          | anshikaw@gmail.com | Learning@830$3mK3   |







		# Scenario 2 (không có tag, nên --tags "@Regression" sẽ không chạy nó). Giống ErrorValidation.feature.
		Scenario Outline: Say bye
		Given a login to Ecommerce2 application with "<username>" and "<password>"
		Then Verify Error message is displayed

		 Examples:
          | username    	  | 	password  |
          | anshikaw@gmail.com | Learning@830$3mK3   |
       
       
       
