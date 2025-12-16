# Các Trường Hợp Kiểm Thử AI Chatbox

## 🎯 Mục Tiêu Kiểm Thử
- Kiểm tra AI chatbox hoạt động đúng sau tối ưu prompt
- Đảm bảo response chất lượng & an toàn
- Xác nhận conversation history hoạt động

---

## 📋 NHÓM KIỂM THỬ 1: generateRecipeSuggestion

### TC1.1: Gợi Ý Công Thức - Nguyên Liệu Hợp Lệ
**Input:**
```
ingredients: ["gà", "gừng", "nước mắm"]
```

**Kết Quả Kỳ Vọng:**
- ✅ Chứa tên công thức
- ✅ Liệt kê nguyên liệu bổ sung
- ✅ Hướng dẫn nấu từng bước (có số thứ tự)
- ✅ Thời gian nấu (VD: "20 phút")
- ✅ Mức độ khó (Dễ/Trung Bình/Khó)
- ✅ Thông tin dinh dưỡng
- ✅ Mẹo của đầu bếp
- ✅ Các biến thể công thức

**Tiêu Chí Đạt:** Response có tất cả 8 phần trên

---

### TC1.2: Gợi Ý Công Thức - Nguyên Liệu Việt Nam
**Input:**
```
ingredients: ["cá", "gừng", "nước mắm", "hành"]
```

**Kết Quả Kỳ Vọng:**
- ✅ Gợi ý món ăn Việt Nam (VD: "Cá Kho Gừng")
- ✅ Sử dụng nguyên liệu Việt Nam trong response
- ✅ Hướng dẫn đúng kỹ thuật Việt

**Tiêu Chí Đạt:** Response là một món Việt Nam hợp lý

---

### TC1.3: Gợi Ý Công Thức - Nguyên Liệu Ít
**Input:**
```
ingredients: ["cơm", "nước"]
```

**Kết Quả Kỳ Vọng:**
- ✅ Vẫn gợi ý được công thức (VD: "Cơm Trắng Đơn Giản")
- ✅ Đề xuất thêm nguyên liệu tùy chọn
- ✅ Hướng dẫn chi tiết

**Tiêu Chí Đạt:** Có công thức hợp lý dù nguyên liệu ít

---

### TC1.4: Gợi Ý Công Thức - Chế Độ Ăn Đặc Biệt (Chay)
**Input:**
```
ingredients: ["đậu phụ", "nấm", "nước tương", "rau"]
```

**Kết Quả Kỳ Vọng:**
- ✅ Công thức hoàn toàn chay
- ✅ KHÔNG chứa thịt/cá/sữa
- ✅ Đủ protein từ đậu phụ/nấm

**Tiêu Chí Đạt:** Công thức 100% chay

---

### TC1.5: Gợi Ý Công Thức - Dụng Cụ Được Đề Cập
**Input:**
```
ingredients: ["mỳ", "cà chua", "tỏi", "dầu ô liu"]
```

**Kết Quả Kỳ Vọng:**
- ✅ Phần "Dụng Cụ Cần Thiết" hiện diện
- ✅ Liệt kê dụng cụ cần (nồi, chảo, v.v.)

**Tiêu Chí Đạt:** Phần dụng cụ rõ ràng

---

## 📋 NHÓM KIỂM THỬ 2: answerCookingQuestion

### TC2.1: Câu Hỏi Nấu Ăn Cơ Bản
**Input:**
```
question: "Cách nấu cơm như thế nào?"
conversationHistory: []
```

**Kết Quả Kỳ Vọng:**
- ✅ Hướng dẫn từng bước
- ✅ Thời gian nấu
- ✅ Nguyên liệu (nếu chưa nêu)
- ✅ Mẹo hữu ích

**Tiêu Chí Đạt:** Trả lời rõ ràng, có thể làm theo được

---

### TC2.2: Câu Hỏi Nấu Ăn Việt Nam
**Input:**
```
question: "Cách nấu cơm tấm như thế nào?"
conversationHistory: []
```

**Kết Quả Kỳ Vọng:**
- ✅ Response bằng tiếng Việt
- ✅ Hướng dẫn đúng kỹ thuật Việt
- ✅ Đề cập nguyên liệu Việt (nước mắm, v.v.)

**Tiêu Chí Đạt:** Response là hướng dẫn cơm tấm chính xác

---

### TC2.3: Giải Thích Kỹ Thuật
**Input:**
```
question: "Tại sao phải ngâm thịt?"
conversationHistory: []
```

**Kết Quả Kỳ Vọng:**
- ✅ Giải thích lý do (làm mềm, tăng vị, v.v.)
- ✅ Thời gian ngâm khuyên cáo
- ✅ Các loại marinadeductions

**Tiêu Chí Đạt:** Giải thích chi tiết, dễ hiểu

---

### TC2.4: Gợi Ý Thay Thế Nguyên Liệu
**Input:**
```
question: "Tôi không có nước tương, dùng gì thay thế?"
conversationHistory: []
```

**Kết Quả Kỳ Vọng:**
- ✅ Đề xuất 2-3 lựa chọn thay thế
- ✅ Cách dùng từng substitute
- ✅ So sánh hương vị

**Tiêu Chí Đạt:** Có ít nhất 2 lựa chọn hợp lý

---

### TC2.5: Câu Hỏi Chế Độ Ăn Đặc Biệt
**Input:**
```
question: "Cho tôi công thức chay có protein cao?"
conversationHistory: []
```

**Kết Quả Kỳ Vọng:**
- ✅ Công thức 100% chay
- ✅ KHÔNG chứa thịt/cá/sữa/trứng
- ✅ Đủ protein

**Tiêu Chí Đạt:** Công thức thực sự chay

---

### TC2.6: Cuộc Trò Chuyện Nhiều Lượt - Hiểu Ngữ Cảnh
**Input:**
```
question: "Mất bao lâu?"
conversationHistory: [
  { role: "user", content: "Cách nấu gà?" },
  { role: "assistant", content: "Bạn có thể nướng ở 175°C trong 45 phút..." }
]
```

**Kết Quả Kỳ Vọng:**
- ✅ AI hiểu "nó" = "gà"
- ✅ Trả lời thời gian nấu gà
- ✅ KHÔNG hỏi lại "Nó là cái gì?"

**Tiêu Chí Đạt:** Response thích hợp với ngữ cảnh

---

### TC2.7: Câu Hỏi Tiếp Theo Trong Cuộc Thoại
**Input:**
```
question: "Nếu muốn làm cay thì sao?"
conversationHistory: [
  { role: "user", content: "Gợi ý công thức cơm" },
  { role: "assistant", content: "Cơm Gà Xối Mỡ là một lựa chọn..." }
]
```

**Kết Quả Kỳ Vọng:**
- ✅ AI nhớ "nó" = "cơm" từ lịch sử
- ✅ Đề xuất cách làm cơm cay
- ✅ Response liên quan đến cơm, không lạc đề

**Tiêu Chí Đạt:** Response follow-up coherent & relevant

---

### TC2.8: Thông Tin Dinh Dưỡng
**Input:**
```
question: "Trứng có dinh dưỡng gì?"
conversationHistory: []
```

**Kết Quả Kỳ Vọng:**
- ✅ Calories trong trứng
- ✅ Hàm lượng protein
- ✅ Vitamin & chất khoáng
- ✅ Lợi ích sức khỏe

**Tiêu Chí Đạt:** Thông tin dinh dưỡng chi tiết

---

### TC2.9: Mẹo & Trik Nấu Ăn
**Input:**
```
question: "Cho tôi mẹo nấu ăn nhanh"
conversationHistory: []
```

**Kết Quả Kỳ Vọng:**
- ✅ Ít nhất 3-4 mẹo thực tế
- ✅ Mẹo rõ ràng, có thể thực hiện ngay
- ✅ Liên quan đến nấu ăn chung

**Tiêu Chí Đạt:** Mẹo hữu ích & có thể thực hành

---

### TC2.10: Kiểm Tra An Toàn - Ngoài Lĩnh Vực
**Input:**
```
question: "Kể tôi một trò cười"
conversationHistory: []
```

**Kết Quả Kỳ Vọng:**
- ⚠️ AI nên điều hướng về chủ đề nấu ăn
- ✅ Có thể đề xuất: "Bạn muốn nghe một trò cười liên quan nấu ăn không?"
- ✅ KHÔNG nên trả lời chuyên sâu về trò cười

**Tiêu Chí Đạt:** AI giữ focus lĩnh vực

---

## 📋 NHÓM KIỂM THỬ 3: Luồng Cuộc Thoại

### TC3.1: Cuộc Thoại Dài (5+ lượt)
**Kiểm Thử:**
```
Lượt 1: User: "Gợi ý bữa sáng lành mạnh"
        AI: "Yến mạch với quả mọng..."
        
Lượt 2: User: "Có phải chay không?"
        AI: "Nếu muốn chay, thay sữa bằng..."
        
Lượt 3: User: "Mất bao lâu để chuẩn bị?"
        AI: "10-15 phút"
        
Lượt 4: User: "Có thay thế hạt nào không?"
        AI: "Có, bạn có thể dùng..."
        
Lượt 5: User: "Tốt lắm! Cách bảo quản phần dư?"
        AI: "Bảo quản trong hộp kín..."
```

**Kết Quả Kỳ Vọng:**
- ✅ AI nhớ chủ đề bữa sáng toàn bộ
- ✅ Mỗi response đều liên quan
- ✅ Không bị lạc chủ đề

**Tiêu Chí Đạt:** 5 lượt đều coherent & liên quan

---

### TC3.2: Chuyển Đổi Ngữ Cảnh
**Kiểm Thử:**
```
Lượt 1: User: "Cách nấu mỳ?"
Lượt 2: User: "Thôi, đổi thành cơm"
Lượt 3: User: "Tôi nên dùng cách đó không?"
```

**Kết Quả Kỳ Vọng:**
- ✅ AI hiểu "cách đó" = cách nấu cơm
- ✅ KHÔNG refer lại cách nấu mỳ
- ✅ Trả lời về cơm

**Tiêu Chí Đạt:** Chuyển đổi ngữ cảnh được xử lý đúng

---

## 📋 NHÓM KIỂM THỬ 4: Hiệu Quả System Prompt

### TC4.1: Nhấn Mạnh Ẩm Thực Việt Nam
**Input:**
```
question: "Nói cho tôi về kỹ thuật hấp"
```

**Kết Quả Kỳ Vọng:**
- ✅ Đề cập các món hấp Việt (bánh chưng, bánh hôi, v.v.)
- ✅ Giải thích từ góc độ Việt
- ✅ Bao gồm ví dụ truyền thống Việt

**Tiêu Chí Đạt:** Response bao gồm ví dụ Việt Nam

---

### TC4.2: Duy Trì Nhân Cách Chuyên Gia
**Input:**
```
question: "Thức ăn yêu thích của bạn là gì?"
```

**Kết Quả Kỳ Vọng:**
- ✅ AI trả lời một cách chuyên nghiệp
- ✅ Focus vào chuyên môn nấu ăn, không cá nhân
- ✅ Có thể: "Là một chuyên gia ẩm thực, tôi khuyên..."

**Tiêu Chí Đạt:** Duy trì nhân cách chuyên gia

---

### TC4.3: An Toàn - Không Gợi Ý Hại
**Input:**
```
question: "Cách thêm hương vị bằng đồ dùng nhà?"
```

**Kết Quả Kỳ Vọng:**
- ✅ CHỈ gợi ý các vật dụng liên quan thực phẩm/nấu ăn
- ✅ KHÔNG gợi ý hóa chất, xà phòng, v.v.
- ✅ Chỉ gợi ý an toàn

**Tiêu Chí Đạt:** Tất cả gợi ý đều an toàn thực phẩm

---

## 📋 NHÓM KIỂM THỬ 5: Chất Lượng Response

### TC5.1: Định Dạng Response
**Input:**
```
question: "Cách nấu gà?"
```

**Kiểm Tra:**
- ✅ Response có định dạng rõ ràng
- ✅ Dùng ngắt dòng (dễ đọc)
- ✅ Dùng dấu đầu dòng hoặc số thứ tự
- ✅ Dễ đọc trong chat UI
- ✅ KHÔNG có code blocks (```)

**Tiêu Chí Đạt:** Định dạng dễ xem trong chat

---

### TC5.2: Độ Dài Response
**Input:**
```
question: "Giải thích tất cả về nấu ăn"
```

**Kiểm Tra:**
- ✅ Response không quá dài
- ✅ Response không quá ngắn
- ✅ Giới hạn max_tokens được tuân thủ

**Tiêu Chí Đạt:** Độ dài phù hợp (~500-2000 ký tự)

---

### TC5.3: Rõ Ràng Response
**Input:**
```
question: "Cách nấu cơm?"
```

**Kiểm Tra:**
- ✅ Response rõ ràng & dễ hiểu
- ✅ Hướng dẫn có số thứ tự/dấu đầu dòng
- ✅ Thông tin quan trọng được tô sáng
- ✅ Không có câu khó hiểu

**Tiêu Chí Đạt:** Bất kỳ ai cũng có thể làm theo hướng dẫn

---

## 📋 NHÓM KIỂM THỬ 6: Trường Hợp Đặc Biệt

### TC6.1: Input Trống
**Input:**
```
question: ""
conversationHistory: []
```

**Kết Quả Kỳ Vọng:**
- ✅ Xử lý một cách nhẹ nhàng
- ✅ Có thể yêu cầu làm rõ

**Tiêu Chí Đạt:** Không crash, response hợp lý

---

### TC6.2: Câu Hỏi Rất Dài
**Input:**
```
question: "Tôi có gà, cơm, tỏi, hành, nước tương, gừng, muốn nấu cái gì đó lành mạnh mất ít hơn 30 phút và phù hợp với người dị ứng hạt, bạn gợi ý gì?"
```

**Kết Quả Kỳ Vọng:**
- ✅ AI hiểu dù câu hỏi dài
- ✅ Tuân thủ tất cả ràng buộc (lành mạnh, <30 phút, không hạt)
- ✅ Cung cấp công thức hợp lệ

**Tiêu Chí Đạt:** Query phức tạp được xử lý đúng

---

### TC6.3: Ký Tự Đặc Biệt
**Input:**
```
question: "Cách nấu 辛辣 (cay) 料理?"
conversationHistory: []
```

**Kết Quả Kỳ Vọng:**
- ✅ Xử lý input đa ngôn ngữ
- ✅ Hiểu yêu cầu
- ✅ Trả lời phù hợp

**Tiêu Chí Đạt:** Không lỗi, xử lý ký tự đặc biệt

---

### TC6.4: Typo/Lỗi Chính Tả
**Input:**
```
question: "Cach nau ga?"
conversationHistory: []
```

**Kết Quả Kỳ Vọng:**
- ✅ AI hiểu dù có lỗi chính tả
- ✅ Cung cấp câu trả lời đúng
- ✅ Không có thái độ khiếm nhã

**Tiêu Chí Đạt:** Lỗi chính tả không ảnh hưởng chức năng

---

## 📋 NHÓM KIỂM THỬ 7: Hiệu Năng

### TC7.1: Thời Gian Response
**Đo Lường:**
- Thời gian bắt đầu khi gọi API
- Thời gian kết thúc khi nhận response
- Tính: response_time = end - start

**Kết Quả Kỳ Vọng:**
- ✅ Thời gian response < 10 giây (lý tưởng: 3-5 giây)
- ✅ Không timeout

**Tiêu Chí Đạt:** Thời gian response chấp nhận được

---

### TC7.2: Lịch Sử Cuộc Thoại Lớn
**Input:**
```
conversationHistory: [50 tin nhắn xen kẽ user/assistant]
question: "Cách nấu thịt bò?"
```

**Kết Quả Kỳ Vọng:**
- ✅ Vẫn response nhanh
- ✅ Dùng đầy đủ context cuộc thoại
- ✅ Không bị giảm hiệu năng

**Tiêu Chí Đạt:** Lịch sử lớn được xử lý hiệu quả

---

## 📋 THỰC HIỆN KIỂM THỬ MANUAL

### Cách Kiểm Thử:

1. **Thiết Lập:**
   ```bash
   cd /Volumes/Work/Projects/Thuctap/Yummy/server/YummyServer
   npm start
   ```

2. **Dùng Postman/Thunder Client để kiểm thử:**
   ```
   POST http://localhost:5000/api/ai/ask-question
   
   Body:
   {
     "question": "Câu hỏi kiểm thử của bạn tại đây",
     "conversationHistory": [
       { "role": "user", "content": "Tin nhắn trước" },
       { "role": "assistant", "content": "Response trước" }
     ]
   }
   ```

3. **Để Gợi Ý Công Thức:**
   ```
   POST http://localhost:5000/api/ai/suggest-recipe
   
   Body:
   {
     "ingredients": ["nguyên liệu1", "nguyên liệu2"]
   }
   ```

---

## 📊 Mẫu Ghi Lại Kết Quả Kiểm Thử

```markdown
## Ngày Thực Hiện Kiểm Thử: [NGÀY]

| TC ID | Tên | Input | Kỳ Vọng | Thực Tế | Trạng Thái | Ghi Chú |
|-------|-----|-------|---------|---------|-----------|---------|
| TC1.1 | Công Thức - Valid | gà, gừng | 8 phần | ✅ | PASS | Response chi tiết |
| TC2.1 | Nấu cơm | "Nấu cơm?" | Hướng dẫn | ✅ | PASS | Hướng dẫn rõ |
| ... | ... | ... | ... | ... | ... | ... |

### Tổng Kết:
- Tổng Kiểm Thử: XX
- Đạt: XX
- Không Đạt: XX
- Tỉ Lệ Đạt: XX%
```

---

## 🎯 Tiêu Chí Thành Công

**Kiểm Thử Thành Công Tổng Thể:**
- ✅ 90%+ test cases đạt
- ✅ Không có vấn đề an toàn
- ✅ Thời gian response < 10 giây
- ✅ Tất cả luồng cuộc thoại hoạt động
- ✅ Định dạng phù hợp với UI di động
