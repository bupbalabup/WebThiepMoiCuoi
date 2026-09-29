# 08 — Tự tạo link thiệp cá nhân từ Google Sheets

## Bố cục đã chốt

Giữ đúng tên hai tab: **Nhà trai mời onl** và **Nhà gái mời onl**. Mỗi tab có hàng tiêu đề ở dòng 1:

| Cột | Tiêu đề | Cách dùng |
| --- | --- | --- |
| A | Tên | Chủ tiệc nhập tên đầy đủ có dấu |
| B | Slug | Công thức tự bỏ dấu, viết thường, thay khoảng trắng bằng dấu gạch ngang |
| C | Link thiệp | Công thức ghép tên miền, bên mời và slug |
| D | Slug cố định (tùy chọn) | Chỉ dùng để xử lý tên trùng hoặc giữ link đã gửi khi sửa tên |

Cột A/B/C theo bố cục chủ tiệc đã chọn. D là trường ngoại lệ, bình thường để trống. Chưa có quyền truy cập Sheet thực tế nên bộ công thức hiện được chuẩn bị trong dự án, chưa được dán vào tài khoản Google.

## Cài công thức một lần

1. Tạo một tab `Cấu hình`: A1 ghi `Tên miền website`; B1 điền origin HTTPS sau khi deploy, ví dụ `https://thiep-cuoi.example.com`. Đây chỉ là ví dụ, không phải link đã phát hành. B1 không chứa `/nha-trai`, `/nha-gai` hoặc tham số truy vấn.
2. Trong cả hai tab khách mời, dán toàn bộ [công thức slug](../google-sheets/slug.formula.txt) vào **B2**.
3. Trong `Nhà trai mời onl`, dán [công thức link Nhà trai](../google-sheets/link-nha-trai.formula.txt) vào **C2**.
4. Trong `Nhà gái mời onl`, dán [công thức link Nhà gái](../google-sheets/link-nha-gai.formula.txt) vào **C2**.
5. Sau đó chỉ cần nhập tên ở cột A. Các công thức mảng tự điền xuống các hàng, không phải kéo công thức mỗi lần thêm khách. Các ô B3:B và C3:C phải trống để công thức mở rộng; nếu đã có dữ liệu/công thức, bảo toàn bản gốc và chuyển chúng trước khi áp dụng.

Công thức dùng dấu `;` làm dấu phân cách đối số. Nếu Sheet của bạn dùng dấu `,`, đổi dấu `;` thành `,` trong ba công thức. Công thức giữ tên gốc ở A, xử lý cả chữ `đ`, dấu tiếng Việt và dấu Unicode tổ hợp. Không tự sửa tên người nhận để tạo slug.

## Ví dụ kết quả

| Tab | A — Tên | B — Slug | Đường dẫn trong C |
| --- | --- | --- | --- |
| Nhà trai mời onl | Nguyễn Văn A | nguyen-van-a | `/nha-trai/nguyen-van-a` |
| Nhà gái mời onl | Nguyễn Văn A | nguyen-van-a | `/nha-gai/nguyen-van-a` |
| Nhà gái mời onl | Đặng Thị Hồng | dang-thi-hong | `/nha-gai/dang-thi-hong` |

Cột C hiển thị URL đầy đủ khi `Cấu hình!B1` đã có tên miền. Khi chưa có, hiển thị “Chưa cấu hình tên miền”. Cùng slug ở hai tab khác nhau là hợp lệ vì đường dẫn có bên mời khác nhau.

## Tên trùng và giữ link ổn định

- Hai khách trong cùng tab có thể cùng tên, hoặc khác dấu nhưng ra cùng slug. Khi trùng, C hiển thị “Trùng slug: nhập slug riêng ở cột D”; không tạo hai link không phân biệt được người nhận.
- Với dòng mới bị trùng, nhập ví dụ `nguyen-van-a-dong-nghiep` vào D. B dùng slug này; A vẫn giữ “Nguyễn Văn A”. Khi đó hai URL khác nhau. Không dùng số dòng để đánh số khách vì chèn/sắp xếp hàng có thể đổi link.
- `phuc-dap` là slug dành riêng cho trang RSVP, không dùng cho tên khách. Nếu gặp, nhập slug khác vào D.
- Sau khi gửi thiệp cho một khách, có thể sao chép giá trị B của khách đó vào D bằng **Chỉ dán giá trị** để giữ nguyên URL nếu cần chỉnh tên có dấu tại A. Công thức theo tên tự thay đổi khi tên đổi nếu D còn trống; công thức không giữ lịch sử link cũ.
- Slug cố định chỉ chứa chữ a–z, chữ số và dấu gạch ngang giữa các từ. Công thức C thông báo slug sai định dạng thay vì xuất một link hỏng.
- Khi sắp xếp, giữ nguyên quan hệ A và D trong từng hàng; tránh ghi đè ô gốc công thức B2/C2. Dùng chế độ lọc phù hợp và kiểm tra công thức sau khi thay đổi cấu trúc Sheet.

## Website điền đúng tên có dấu

1. Khách mở `/nha-trai/nguyen-van-a`.
2. Giao diện lấy bên mời từ đường dẫn và gọi `GET /api/invitation?side=groom&slug=nguyen-van-a`.
3. Function dùng tài khoản dịch vụ để đọc cột A:B của tab `Nhà trai mời onl`, tìm slug khớp chính xác và duy nhất.
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
