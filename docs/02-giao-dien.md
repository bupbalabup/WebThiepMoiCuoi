# 02 — Định hướng giao diện

## Cảm giác tổng thể

Thiệp cưới trẻ, sáng, ấm và giàu hình ảnh. Nền kem giữ cảm giác nhẹ; đỏ rượu tạo điểm neo thị giác; hồng đất dùng cho mảng nền, đường nét và trạng thái phụ. Ảnh thật là trọng tâm. Tránh chữ quá mảnh, màu quá nhạt hoặc hiệu ứng che nội dung.

## Hệ màu và mức độ nhấn

| Vai trò | Màu | Cách dùng |
| --- | --- | --- |
| Nền trang | `#FFF8F0` kem | Nền chính, tạo độ ấm |
| Bề mặt | `#FFFDF9` | Thẻ, form và hộp thoại |
| Nền hồng | `#FBE8EC` | Xen kẽ section, khối câu chuyện và album |
| Hồng đất | `#D98C9F` | Viền, icon và chi tiết trang trí |
| Hồng đậm | `#B95F78` | Nhãn, trạng thái phụ và hover |
| Đỏ rượu | `#7A1F36` | Ngày giờ, tiêu đề quan trọng, nút chính |
| Đỏ rượu đậm | `#541326` | Hover/active và chữ nhấn mạnh |
| Chữ chính | `#34282C` | Nội dung dài, bảo đảm dễ đọc |

- Tên hai bạn, ngày cưới, hạn phúc đáp và tiêu đề địa điểm dùng đỏ rượu; không dùng đỏ rượu cho mọi dòng chữ.
- Nút “Tham dự” dùng nền đỏ rượu, chữ trắng. “Chỉ đường” dùng viền đỏ rượu. “Gửi mừng cưới” dùng nền hồng đậm hoặc bề mặt hồng để tách vai trò.
- Thẻ đang được chọn trong form có viền đỏ rượu, nền hồng nhạt và dấu chọn rõ. Lỗi dùng màu đỏ có độ tương phản đạt chuẩn, không chỉ đổi màu mà còn có biểu tượng/chữ mô tả.
- Mỗi màn hình chỉ có một hành động chính nổi bật nhất. Các nút không tranh nhau bằng cùng một màu đậm.

## Bố cục đề xuất

| Phần | Trên điện thoại | Trên máy tính |
| --- | --- | --- |
| Home chọn bên mời | Tên hai bạn và hai nút lớn xếp dọc | Hai nút hoặc thẻ song song, căn giữa |
| Mở đầu | Một cột, ảnh tỷ lệ dọc, thông tin chính xuất hiện ngay | Ảnh và nội dung cân đối hai bên |
| Thời gian/địa điểm | Thẻ xếp dọc, Google Maps có ghim, nút chỉ đường đủ lớn để chạm | Thẻ thông tin và bản đồ song song khi đủ chỗ |
| Câu chuyện/ảnh | Ảnh xen giữa nội dung, lưới 2 cột khi đủ rộng | Lưới 3–4 cột có ảnh ngang/dọc đan xen |
| Lịch trình | Timeline dọc dễ đọc | Timeline hoặc lưới 2 cột |
| RSVP trong thiệp | Hộp thoại rộng theo màn hình, cuộn được khi bàn phím mở | Hộp thoại khoảng 520px, form một cột |
| Trang phúc đáp riêng | Hiện form ngay sau tên hai bạn và thông tin tiệc ngắn | Thẻ form khoảng 520px, căn giữa |
| Mừng cưới | Hộp thoại có QR rõ nét, không cắt viền, có nút đóng và tải ảnh | Hộp thoại hiển thị QR và thông tin người nhận |

## Điều hướng và hộp thoại

- Thiệp cá nhân `/nha-trai/:slug` và `/nha-gai/:slug` hiển thị “Trân trọng kính mời” cùng tên khách có dấu từ Sheet. Tên dài tự xuống dòng ở màn nhỏ, không cắt chữ. Khi tra tên, dùng trạng thái đang tải gọn; lỗi có nút thử lại, slug không tồn tại có thông báo rõ, không đoán tên từ URL.
- Câu tên trong form của thiệp cá nhân được điền trước và vẫn chỉnh sửa được. Khi đi sang trang phúc đáp cùng bên, giữ slug bằng tham số `khach`; dữ liệu tra cứu chỉ điền vào form chưa chỉnh sửa để không ghi đè tên khách vừa gõ.
- `/` là trang home với “Tuấn Anh & Ngọc Anh”, thông tin tiệc ngắn gọn và câu hỏi “Bạn là khách của bên nào?”. Hai nút “Khách Nhà trai” → `/nha-trai`, “Khách Nhà gái” → `/nha-gai`. Luôn hiển thị lựa chọn khi vào home, không tự chuyển theo lần truy cập trước. Nút có focus rõ và dùng được bằng bàn phím/cảm ứng.
- `/nha-trai` và `/nha-gai` là hai link thiệp đầy đủ dùng cùng thiết kế. Nút “Tham dự” mở form ngay trong trang, không đổi URL hoặc chuyển tab. Nút “Gửi mừng cưới” mở một hộp thoại riêng chứa đúng QR của bên mời.
- `/nha-trai/phuc-dap` và `/nha-gai/phuc-dap` là hai trang độc lập dùng với QR theo từng bên. Khách thấy form ngay cùng nhãn “Phúc đáp Nhà trai” hoặc “Phúc đáp Nhà gái”; không phải chọn lại bên mời, xem album hoặc mở thiệp trước. Liên kết “Xem thiệp mời” dẫn về đúng `/nha-trai` hoặc `/nha-gai` tương ứng.
- Dùng cùng một form cho hai vị trí, cùng nội dung, quy tắc và trạng thái gửi. Nút “Tham dự” mở form nhưng không chọn sẵn câu trả lời; khách phải chọn rõ “Có mình sẽ tham gia”, “Mình đang cân nhắc” hoặc “Tiếc quá mình không tham gia được rồi”.
- Chỉ mở một hộp thoại tại một thời điểm; có tiêu đề, nút đóng dễ chạm, đóng bằng Escape, giữ focus trong hộp thoại và trả focus về nút mở khi đóng. Khóa cuộn nền nhưng cho phép cuộn nội dung trên màn hình nhỏ.
- Đóng rồi mở lại form trong cùng lần xem thiệp giữ nội dung chưa gửi ở bộ nhớ trang. Trạng thái thành công vẫn được giữ để tránh vô tình gửi lại; khi tải lại trang không tự gửi.
- QR mừng cưới dùng ảnh gốc được chủ tiệc cung cấp, nền đủ tương phản, không thêm hiệu ứng che QR. Link nhà trai chỉ hiển thị QR nhà trai; link nhà gái chỉ hiển thị QR nhà gái. Không có tab chuyển bên trong hộp thoại. Nút tải ảnh phải tải đúng QR đang xem; không dùng QR bên kia để dự phòng khi thiếu ảnh.
- Hạn RSVP áp dụng cho cả hai form. Khi đã hết hạn, khách vẫn xem được thiệp, bản đồ và QR mừng cưới.

## Nội dung chính và bản đồ

- Mở đầu: “Tuấn Anh & Ngọc Anh”, “11:00 · 21.10.2026”.
- Địa điểm: “Trống Đồng Palace”, “Tòa nhà Hancorp Plaza, 72 Trần Đăng Ninh, Hà Nội”.
- Nhúng Google Maps bằng iframe chia sẻ từ đúng địa điểm; ghim phải nằm ở cơ sở Trần Đăng Ninh, không nhầm cơ sở khác của Trống Đồng Palace. Lưu URL embed sau khi kiểm tra ghim thực tế, không đoán tọa độ.
- Bản đồ tải trễ, có tiêu đề mô tả, chiều cao cố định để tránh nhảy bố cục và không kéo chậm màn đầu. Luôn có địa chỉ dạng chữ cùng nút “Chỉ đường” hoạt động ngay cả khi iframe bị chặn.
- Gần form ghi “Vui lòng xác nhận trước khi kết thúc ngày 15/10/2026”.
- Câu 1 dùng ô nhập tên và giữ nguyên lời gọi “anh/chị/bạn”.
- Câu 2 dùng ba lựa chọn radio, mỗi dòng là một phương án để dễ chạm trên điện thoại.
- Câu 3 ghi rõ “tính cả bạn nhé”, có nút chọn 1 người, 2 người và “Mục khác”. Khi chọn Mục khác, hiện ô số nguyên từ 1 trở lên, không có `max`. Khi chọn không tham gia, ẩn câu này và lưu 0; khi đổi lại tham gia/đang cân nhắc, khách phải chọn số người.
- Câu 4 dùng năm lựa chọn radio. Khi chọn “Mục khác”, hiện ô nhập nội dung và bắt buộc điền; đổi sang phương án khác thì bỏ giá trị Mục khác khỏi payload.
- Sau hạn RSVP, thay form bằng thông báo đã kết thúc thời gian xác nhận, giữ nội dung thiệp và bản đồ.

## Quy tắc responsive và dễ dùng

- Thiết kế mobile first và kiểm tra toàn bộ khoảng 320–1920px, không chỉ một vài thiết bị mẫu. Không có cuộn ngang.
- `320–359px`: một cột, lề 16px, nút rộng toàn hàng, chữ co bằng `clamp()`, ảnh hero tối đa chiều cao màn hình còn lại sau nội dung chính.
- `360–479px`: một cột, lề 20px; album 2 cột ở các nhóm ảnh vuông/nhỏ, ảnh dọc hoặc ảnh nhấn chiếm toàn hàng.
- `480–767px`: một cột rộng hơn, lề 24–32px; các lựa chọn ngắn trong form có thể xếp 2 cột nhưng câu dài vẫn toàn hàng.
- `768–1023px`: lưới 2 cột cho hero, thời gian/địa điểm và các nhóm ảnh; form giữ chiều rộng đọc tốt, không kéo giãn hết màn hình.
- `1024–1439px`: container tối đa 1180px; lưới album 3 cột, hero chia khoảng 55/45, bản đồ và thông tin cân chiều cao.
- `1440px trở lên`: container tối đa 1280px, phần nền trang tiếp tục phủ hết chiều ngang; không kéo dòng chữ hoặc ảnh vượt kích thước hợp lý. Album có thể 4 cột.
- Kiểm tra thêm màn hình ngang thấp 568×320 và 667×375: hero không khóa `100vh`, hộp thoại cuộn nội dung được, nút đóng luôn tiếp cận được.
- Khoảng cách section dùng `clamp()` và giảm theo chiều cao màn hình. Không dùng chiều cao cố định cho khối chứa văn bản.
- Nội dung quan trọng không phụ thuộc animation hoặc hover; nút và input có trạng thái focus rõ.
- Cỡ chữ nội dung tối thiểu khoảng 16px; độ tương phản theo WCAG AA cho chữ và nút quan trọng.
- Ảnh có `alt` phù hợp, kích thước khai báo sẵn để hạn chế nhảy bố cục; ảnh dưới màn đầu tải trễ.
- Form có nhãn, thông báo lỗi cạnh trường và thông báo thành công/thất bại đọc được bằng trình đọc màn hình.
- Tôn trọng `prefers-reduced-motion`: tắt hiệu ứng cuộn/phóng và chuyển cảnh không cần thiết.

## Quy tắc không để trống bố cục

- Không render thẻ ảnh, tiêu đề section, cột hoặc khoảng đệm nếu dữ liệu tương ứng chưa có. Section thiếu toàn bộ nội dung phải bị loại khỏi DOM.
- Dùng CSS Grid với số cột tự đổi theo breakpoint; phần tử còn lại ở hàng cuối được kéo rộng hoặc căn theo mẫu đã định, không để một nửa màn hình trắng vô cớ.
- Trên desktop, các khối hai cột phải cân bằng bằng nội dung/ảnh thực tế. Nếu một cột thiếu, chuyển thành một cột có `max-width`, không giữ cột rỗng.
- Container nội dung có chiều rộng tối đa 1280px nhưng nền section phủ toàn viewport để màn hình lớn không có cảm giác một dải nội dung nhỏ lọt thỏm giữa khoảng trắng.
- Khoảng trắng chỉ dùng làm nhịp đọc có chủ ý; khoảng cách lớn nhất giữa hai section không vượt quá giá trị responsive đã định. Không dùng spacer rỗng, nhiều thẻ `<br>` hoặc `min-height` lớn để lấp trang.
- Trong thời gian chưa đủ ảnh, bản preview dùng khối trang trí màu kem/hồng có nội dung thật hoặc rút gọn bố cục. Bản production không được có placeholder “Ảnh ở đây”.

## Hệ thống 18 vị trí ảnh cưới

| Nhóm | Số ảnh | Vai trò |
| --- | ---: | --- |
| Hero | 1 | Ảnh đại diện đẹp nhất, tải ưu tiên |
| Lời chào | 2 | Hai ảnh dọc cạnh lời mời |
| Câu chuyện | 4 | Ảnh dọc, vuông, ngang xen kẽ nội dung |
| Dải nổi bật | 3 | Một ảnh ngang lớn và hai ảnh phụ |
| Album | 7 | Lưới ảnh nhiều tỷ lệ, mở lightbox khi bấm |
| Kết thiệp | 1 | Ảnh ngang trước phần RSVP/footer |

- Mỗi vị trí có `id`, vai trò, tỷ lệ và nguồn ảnh riêng trong cấu hình. Không lặp một ảnh ở nhiều vị trí trừ khi chủ tiệc yêu cầu.
- Yêu cầu tối thiểu 12 ảnh thật để phát hành. Với 12–17 ảnh, thuật toán bố cục bỏ các slot cuối và tái phân bố lưới; với 18 ảnh trở lên, dùng đủ 18 slot đã định.
- Dùng `<picture>`/`srcset` cho các cỡ khoảng 480, 800, 1200 và 1600px; hero tải sớm, các ảnh còn lại `loading="lazy"` và `decoding="async"`.
- Khai báo `width`, `height` hoặc `aspect-ratio` để không nhảy bố cục. `object-position` được cấu hình riêng để không cắt mặt; lightbox dùng ảnh lớn hơn nhưng không tải trước toàn bộ album.
- Trên thiết bị yếu hoặc bật tiết kiệm dữ liệu, giảm hiệu ứng ảnh và ưu tiên biến thể WebP/AVIF nhẹ; vẫn giữ ảnh JPEG dự phòng khi cần.

## Chuyển động và hiệu năng

- Dùng chuyển động nhẹ bằng CSS `transform`/`opacity`; thời lượng ngắn, không chạy liên tục trên màn hình cũ.
- Không bắt buộc thư viện animation lớn. Dùng Intersection Observer chỉ khi hiệu ứng làm nội dung dễ theo dõi hơn.
- Ưu tiên ảnh AVIF/WebP với bản JPEG/PNG dự phòng khi cần; tạo kích thước phù hợp điện thoại và máy tính.
- Giữ font ít kiểu, có font hệ thống dự phòng; không tải video nền mặc định.
- Mục tiêu kiểm thử: Lighthouse mobile Performance và Accessibility từ 90 trở lên trên bản production, đồng thời kiểm tra thủ công trên thiết bị yếu.
