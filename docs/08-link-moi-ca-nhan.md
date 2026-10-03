# 08 — Tự tạo link thiệp cá nhân từ Google Sheets

## Bố cục đã chốt

Giữ đúng tên hai tab: **Nhà trai mời onl** và **Nhà gái mời onl**. Mỗi tab có hàng tiêu đề ở dòng 1:

| Cột | Tiêu đề | Cách dùng |
| --- | --- | --- |
| A | STT | Công thức đánh số tự động |
| B | Tên khách mời | Chủ tiệc nhập tên đầy đủ có dấu |
| C | Đường dẫn khách mời | Công thức tự bỏ dấu, viết thường, thay khoảng trắng bằng dấu gạch ngang |
| D | Link thiệp | Công thức ghép tên miền, bên mời và slug |
| E | Đã mời | Checkbox để chủ tiệc đánh dấu đã gửi thiệp |

Cột A:D theo bố cục đang dùng. Cột E là checkbox quản lý việc gửi thiệp.

## Cài công thức một lần

1. Dán [công thức STT](../google-sheets/stt.formula.txt) vào **A2**.
2. Trong cả hai tab khách mời, dán toàn bộ [công thức slug](../google-sheets/slug.formula.txt) vào **C2**.
3. Trong `Nhà trai mời onl`, dán [công thức link Nhà trai](../google-sheets/link-nha-trai.formula.txt) vào **D2**.
4. Trong `Nhà gái mời onl`, dán [công thức link Nhà gái](../google-sheets/link-nha-gai.formula.txt) vào **D2**.
5. Sau đó chỉ cần nhập tên ở cột B. Công thức mảng tự điền từ hàng 2 đến 1001, tương ứng 1.000 khách.

Công thức dùng dấu `;` làm dấu phân cách đối số. Nếu Sheet của bạn dùng dấu `,`, đổi dấu `;` thành `,` trong ba công thức. Công thức giữ tên gốc ở A, xử lý cả chữ `đ`, dấu tiếng Việt và dấu Unicode tổ hợp. Không tự sửa tên người nhận để tạo slug.

## Ví dụ kết quả

| Tab | B — Tên | C — Slug | Đường dẫn trong D |
| --- | --- | --- | --- |
| Nhà trai mời onl | Nguyễn Văn A | nguyen-van-a | `/nha-trai/nguyen-van-a` |
| Nhà gái mời onl | Nguyễn Văn A | nguyen-van-a | `/nha-gai/nguyen-van-a` |
| Nhà gái mời onl | Đặng Thị Hồng | dang-thi-hong | `/nha-gai/dang-thi-hong` |

Cột C ghép URL production với slug. Cùng slug ở hai tab khác nhau là hợp lệ vì đường dẫn có bên mời khác nhau.

## Tên trùng và giữ link ổn định

- Hai khách trong cùng tab có thể cùng tên hoặc tạo cùng slug. Khi trùng, C hiển thị cảnh báo và không phát hành hai link giống nhau. Hãy bổ sung thông tin phân biệt trực tiếp vào tên, ví dụ “Nguyễn Văn A - Đồng nghiệp”.
- `phuc-dap` là slug dành riêng cho trang RSVP. Nếu tên tạo ra slug này, hãy bổ sung thông tin phân biệt vào tên.
- Khi sửa tên ở B, slug và link tự cập nhật. Vì vậy không sửa tên sau khi đã gửi link cho khách.
- Khi sắp xếp, giữ nguyên hàng khách và tránh ghi đè các ô công thức A2/C2/D2.

## Website điền đúng tên có dấu

1. Khách mở `/nha-trai/nguyen-van-a`.
2. Giao diện lấy bên mời từ đường dẫn và gọi `GET /api/invitation?side=groom&slug=nguyen-van-a`.
3. Function dùng tài khoản dịch vụ để đọc cột A:C của tab `Nhà trai mời onl`, tìm slug khớp chính xác và duy nhất.
4. Trả về đúng tên “Nguyễn Văn A”, hiển thị lời mời “Trân trọng kính mời Nguyễn Văn A” và điền trước câu tên trong form. Khách vẫn được sửa tên khi phúc đáp; giữ riêng tên được mời gốc để đối chiếu.
5. Link Nhà gái tra tab `Nhà gái mời onl` theo cùng quy tắc. Nút mừng cưới vẫn chọn QR theo bên trong đường dẫn.

Không thể khôi phục tên có dấu chính xác chỉ bằng cách đổi dấu gạch ngang thành khoảng trắng; dữ liệu tên phải lấy từ Sheet. Không xuất danh sách khách hoặc khóa Google vào mã frontend. API tra cứu chỉ trả tên/slug/bên của một thiệp, không trả số điện thoại, danh sách RSVP hay cả tab.

Hai link phúc đáp `/nha-trai/phuc-dap` và `/nha-gai/phuc-dap` vẫn dùng cho QR theo từng bên. Nếu đi từ thiệp cá nhân sang trang phúc đáp, dùng thêm `?khach=nguyen-van-a` để giữ người nhận; khi quét QR chung không có tham số, khách tự điền tên. Hộp thoại Tham dự trong thiệp cá nhân lấy tên đã tra cứu trực tiếp.

## Kiểm thử cần hoàn thành khi kết nối Google

- Dán công thức trên bản Sheet thử, nhập mới và sửa tên; kiểm tra B/C tự cập nhật mà không kéo công thức.
- Nguyễn Văn A → `nguyen-van-a`; Đặng Thị Hồng → `dang-thi-hong`; thêm khoảng trắng và thử tên Unicode tổ hợp.
- Cùng tên ở hai tab tạo hai link theo đúng bên. Hai tên trùng slug trong cùng tab được phát hiện; nhập D giải quyết được mà giữ nguyên tên A.
- Không có tên, chỉ có dấu câu, slug sai hoặc slug `phuc-dap`: không phát hành link nhầm.
- Vào/refresh link cá nhân: lời mời và form tên có dấu chính xác, Sheet phản hồi lưu đúng slug/bên mời.
- Link không tồn tại trả trạng thái không tìm thấy; slug trùng trả lỗi cần sửa, không tự chọn dòng đầu; Google lỗi không được giả là không tìm thấy.
- Route phúc đáp tĩnh phải được ưu tiên hơn route `:slug` để không tra khách có tên slug `phuc-dap`.

Hiện công thức được kiểm tra cấu trúc và logic xử lý tên cục bộ; chưa chạy kiểm chứng trực tiếp trong Google Sheets.

## Tài liệu công thức

- [ARRAYFORMULA — mở rộng kết quả tự động](https://support.google.com/docs/answer/3093275?hl=en)
- [REGEXREPLACE — thay thế chuỗi bằng biểu thức chính quy](https://support.google.com/docs/answer/3098245?hl=en-GB)
- [CHAR — ký tự Unicode theo mã số](https://support.google.com/docs/answer/3094120?hl=en-GB)
