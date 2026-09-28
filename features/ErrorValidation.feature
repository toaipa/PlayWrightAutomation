# ===================================================================================
# FILE GHERKIN (BDD) chạy bằng Cucumber.js: npx cucumber-js features/ErrorValidation.feature --exit
# RF cũng hỗ trợ Given/When/Then (RF bỏ qua tiền tố Given/When/Then khi tìm keyword).
# Mỗi dòng Given/Then được nối với một hàm có câu trùng khớp trong features/step_definitions/steps.js
# (≈ keyword có tên trùng câu). Kịch bản: đăng nhập sai và kiểm tra thông báo lỗi hiển thị.
# ===================================================================================
# Feature ≈ một test suite (tên suite). Tên 'Greeting' và 'Say hello' là tên mẫu, không khớp nội dung.
Feature: Greeting

		# Scenario Outline + Examples ≈ Test Template với bảng dữ liệu: scenario chạy 1 lần cho mỗi dòng dữ liệu,
		# <username>/<password> được thay bằng giá trị cột tương ứng.
		Scenario Outline: Say hello
		# Phần "..." trong ngoặc kép khớp với {string} trong step definition và được truyền vào làm tham số.
		Given a login to Ecommerce2 application with "<username>" and "<password>"
		Then Verify Error message is displayed

		 # Examples: dòng đầu = tên cột, mỗi dòng sau = một lần chạy scenario.
		 Examples:
          | username    	  | 	password  |
          | anshikaw@gmail.com | Learning@830$3mK3   |
       
       
