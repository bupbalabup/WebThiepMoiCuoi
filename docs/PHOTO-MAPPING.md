# Vị trí ảnh cưới

Ảnh nguồn nằm trong `public/images/anhcuoi`. Bản tối ưu dùng trên web nằm trong `public/images/optimized`, đường dẫn tập trung trong `src/config/photos.json`.

| Ảnh nguồn | Vị trí |
| --- | --- |
| hero-banner-mobile.jpg | Banner dưới 768px |
| hero-banner-pc.JPG | Banner ngang từ 768px |
| anhlich.jpg | Ảnh cạnh lịch và thẻ sự kiện |
| chure.JPG / codau.JPG | Thẻ chú rể / cô dâu |
| Toàn bộ ảnh trong `public/images/khoanhkhac` | Album xếp lớp 3D, tự sắp xếp theo tên và số |
| demnguoc.JPG | Đếm ngược |
| camon.JPG | Cảm ơn |

Banner cố định Tuấn Anh bên trái, Ngọc Anh bên phải. Các phần gia đình, chân dung, phong bì và lời cảm ơn ưu tiên bên mời theo đường dẫn. Ảnh nguồn được giữ nguyên; khi thay ảnh nguồn cần cập nhật bản tối ưu tương ứng hoặc đổi đường dẫn trong cấu hình ảnh.

## Thêm ảnh vào album

Chép ảnh JPG, JPEG, PNG, WebP hoặc AVIF vào `public/images/khoanhkhac`. Album tự đọc toàn bộ ảnh trực tiếp trong thư mục này, không giới hạn 4 hoặc 9 ảnh và không cần sửa JSON. Đặt tên có số (ví dụ `anh-01.jpg`, `anh-02.jpg`) để chọn thứ tự. File mới phải được đưa vào Git cùng lần push để Cloudflare build nhận được. Khi chạy dev, thêm/xóa ảnh sẽ tự tải lại trang.

Album xếp lớp xòe hai bên, chỉ chuyển bằng nút mũi tên, vuốt ngang hoặc phím mũi tên khi tập trung vào album. Không tự chuyển, không hiện số ảnh và không mở ảnh lớn khi bấm vào ảnh. Chế độ giảm chuyển động của thiết bị sẽ tắt hiệu ứng chuyển cảnh.
