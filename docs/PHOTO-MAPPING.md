# Vị trí ảnh cưới

Website dùng ảnh gốc trong `public/images/anhcuoi`, đường dẫn tập trung trong `src/config/photos.json`. Thư mục `public/images/optimized` chứa các bản cũ, không phải ảnh đang dùng trong cấu hình.

| Ảnh nguồn | Vị trí |
| --- | --- |
| hero-banner-mobile.jpg | Banner dưới 768px |
| hero-banner-pc.JPG | Banner ngang từ 768px |
| anhlich.jpg | Ảnh cạnh lịch và thẻ sự kiện |
| chure.JPG / codau.JPG | Thẻ chú rể / cô dâu |
| Toàn bộ ảnh trong `public/images/khoanhkhac` | Album xếp lớp 3D, tự sắp xếp theo tên và số |
| demnguoc.jpg | Đếm ngược |
| homepage.JPG | Trang chủ |
| camon.JPG | Ảnh dự phòng, phần lời cảm ơn hiện không hiển thị ảnh |

Banner cố định Tuấn Anh bên trái, Ngọc Anh bên phải. Các phần gia đình, chân dung, phong bì và lời cảm ơn ưu tiên bên mời theo đường dẫn. Ảnh nguồn được giữ nguyên; khi thay ảnh cần đưa tệp vào Git và dùng tên đúng chữ hoa/thường trong cấu hình.

## Tránh thiếu ảnh trên Cloudflare

Thư mục `anhcuoi` phải được theo dõi bằng Git. Trước đây quy tắc bỏ qua `*.JPG` khiến ảnh chỉ có trên máy local, Cloudflare không nhận được ảnh khi build từ GitHub. `npm run build` hiện kiểm tra mọi đường dẫn ảnh trong cấu hình và dừng nếu thiếu tệp hoặc sai chữ hoa/thường. Không nén lại ảnh trong quá trình build.

## Thêm ảnh vào album

Chép ảnh JPG, JPEG, PNG, WebP hoặc AVIF vào `public/images/khoanhkhac`. Album tự đọc toàn bộ ảnh trực tiếp trong thư mục này, không giới hạn 4 hoặc 9 ảnh và không cần sửa JSON. Đặt tên có số (ví dụ `anh-01.jpg`, `anh-02.jpg`) để chọn thứ tự. File mới phải được đưa vào Git cùng lần push để Cloudflare build nhận được. Khi chạy dev, thêm/xóa ảnh sẽ tự tải lại trang.

Album xếp lớp xòe hai bên, chỉ chuyển bằng nút mũi tên, vuốt ngang hoặc phím mũi tên khi tập trung vào album. Không tự chuyển, không hiện số ảnh và không mở ảnh lớn khi bấm vào ảnh. Chế độ giảm chuyển động của thiết bị sẽ tắt hiệu ứng chuyển cảnh.
