# Cài máy chủ KAS App (khoảng 10 phút, làm 1 lần)

Làm trên **máy tính**, đăng nhập đúng Gmail của Thầy (tài khoản giữ Drive công ty). Dữ liệu và ảnh nằm trong Drive của Thầy, app chỉ là cửa sổ để nhập và xem.

## Bước 1. Tạo máy chủ Apps Script

1. Mở https://script.google.com → **Dự án mới** (New project).
2. Đổi tên dự án (góc trái trên) thành `KAS App – Máy chủ`.
3. Xoá hết chữ trong file `Code.gs`, dán toàn bộ nội dung file [`gas/Code.gs`](../gas/Code.gs).
4. Bấm biểu tượng bánh răng **Cài đặt dự án** → tích ô **Hiển thị tệp kê khai "appsscript.json"**.
5. Quay lại **Trình chỉnh sửa**, mở `appsscript.json`, xoá hết, dán nội dung file [`gas/appsscript.json`](../gas/appsscript.json).
6. Bấm **Lưu** (Ctrl+S).

## Bước 2. Chạy cài đặt lần đầu

1. Trên thanh công cụ, chọn hàm **setup** → bấm **Chạy**.
2. Google hỏi quyền: chọn tài khoản Thầy → **Nâng cao** → **Đi tới KAS App (không an toàn)** → **Cho phép**.
   (Cảnh báo này xuất hiện vì đây là script Thầy tự viết, chưa đăng ký với Google. Script chỉ đọc/ghi Sheets và Drive của chính Thầy.)
3. Xem **Nhật ký thực thi** bên dưới, có dòng:
   `KHOÁ CỦA THẦY (dán vào app lần đầu): xxxxxxxx`
   → Copy dãy khoá đó, giữ riêng, **không gửi ai**.
4. Trong Drive sẽ có file Sheets mới tên **KAS App – Dữ liệu**. Không cần mở, không sửa tay tên tab hay tên cột.

## Bước 3. Đưa máy chủ lên mạng

1. Bấm **Triển khai** (Deploy) → **Tùy chọn triển khai mới** (New deployment).
2. Bánh răng cạnh "Chọn loại" → **Ứng dụng web** (Web app).
3. Điền:
   - Thực thi dưới dạng (Execute as): **Tôi** (Me)
   - Người có quyền truy cập (Who has access): **Bất kỳ ai** (Anyone)
4. Bấm **Triển khai** → copy **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).

"Bất kỳ ai" nghĩa là ai cũng gọi được địa chỉ này, nhưng không có khoá đúng thì máy chủ từ chối. Chủ nhà chỉ xem được tiến độ công trình của mình qua link riêng.

## Bước 4. Mở app và nối

1. Mở app: **https://leonidas1431.github.io/kas-app/**
2. Màn hình **Kết nối máy chủ**: dán URL ở bước 3 và khoá ở bước 2 → **Kết nối**.
3. Góc trên hiện tên **Thầy** và chữ **Đã lưu** là xong.

## Bước 5. Thêm anh em

1. Tab **Người dùng** → điền tên, Gmail, vai trò. Với Kha, tích các công trình được giao.
2. Bấm **Tạo link** → điện thoại mở bảng chia sẻ, chọn Zalo (trên máy tính thì link được chép sẵn, dán vào Zalo). Người nhận mở link 1 lần là điện thoại nhớ luôn.
3. Trên điện thoại: mở link bằng Chrome (Android) hoặc Safari (iPhone) → menu → **Thêm vào màn hình chính** để có biểu tượng như app thật.
4. Mất máy hoặc nghỉ việc: bấm **Thu hồi** (bấm 2 lần để chắc), link cũ hết tác dụng ngay.

## Ảnh tiến độ đi đâu

- Lúc tạo công trình, dán link thư mục Drive của công trình vào ô **Link thư mục Drive của công trình** → ảnh vào thư mục con `Ảnh tiến độ` trong đó.
- Không dán thì ảnh vào `KAS App – Ảnh/<Mã công trình>` trong Drive của Thầy.
- Tên ảnh: `MãCT_NămThángNgày_GiờPhút_MãViệc_01.jpg`. Ảnh được nén ~1600px trên điện thoại trước khi gửi, mất sóng thì nằm chờ trên máy, có sóng tự gửi.

## Khi sửa code máy chủ

Dán `Code.gs` mới → **Triển khai** → **Quản lý triển khai** → bút chì → Phiên bản: **Phiên bản mới** → **Triển khai**. Giữ nguyên URL, anh em không phải làm lại gì.

## Lỗi hay gặp

| Hiện tượng | Cách xử lý |
| --- | --- |
| App báo "Khoá không đúng hoặc đã bị thu hồi" | Thầy vào Người dùng → Gửi lại link cho người đó |
| Chữ **Mất mạng · chờ gửi N** không mất | Bình thường khi mất sóng. Có sóng lại app tự gửi; đừng xoá dữ liệu trình duyệt khi còn chờ |
| Quên khoá của Thầy | Mở Sheets **KAS App – Dữ liệu** → tab `NguoiDung` → cột `khoa` dòng của Thầy |
