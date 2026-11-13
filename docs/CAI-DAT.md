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

1. Mở app: **https://leonidas1431.github.io/Kas-App/**
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

Dán `Code.gs` mới → **Lưu** → **Triển khai** → **Quản lý triển khai** → bút chì → Phiên bản: **Phiên bản mới** → **Triển khai**. Giữ nguyên URL, anh em không phải làm lại gì. Tab mới trong Sheets (vd `HopDong`) máy chủ tự tạo, không cần chạy lại setup.

Nếu góc trên app hiện **Cần cập nhật máy chủ**: app đã có tính năng mới nhưng máy chủ còn bản cũ. Dữ liệu vẫn nằm chờ trên máy, cập nhật máy chủ xong app tự gửi.

## Bật đăng bài tự động (làm khi cần, từng phần độc lập)

Không có khoá nào thì app vẫn chạy bình thường, chỉ nút AI viết và đăng báo "chưa có ...". Mọi khoá đặt ở **Apps Script → Cài đặt dự án (bánh răng) → Thuộc tính tập lệnh → Thêm thuộc tính**. Không dán khoá vào Sheets, Zalo hay code (repo công khai).

**0. Cấp quyền mới (bắt buộc 1 lần).** Dán `Code.gs` và `appsscript.json` mới → Lưu → chọn hàm `caiHenGio` → **Chạy** → cho phép. Quyền mới: gọi ra ngoài (Claude, Facebook, website) và hẹn giờ. `caiHenGio` đặt lịch 15 phút kiểm bài đến giờ đăng. Sau đó **Triển khai phiên bản mới** như mục dưới.

| Thuộc tính | Lấy ở đâu | Dùng cho |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys → Create Key. Nạp tiền trước (Billing). Nên đặt hạn mức chi tháng trong Limits | AI tìm chủ đề, viết bài |
| `FB_PAGE_ID` | Trang Facebook → Giới thiệu → Minh bạch trang → ID trang | Đăng Facebook |
| `FB_PAGE_TOKEN` | Mã truy cập của Trang (Page access token), cần quyền `pages_manage_posts`, `pages_read_engagement`, và cho Instagram thêm `instagram_basic`, `instagram_content_publish`. Lấy qua ứng dụng Meta (developers.facebook.com) hoặc người dùng hệ thống trong Meta Business | Đăng Facebook, Instagram |
| `IG_USER_ID` | ID tài khoản Instagram chuyên nghiệp đã nối với Trang (gọi `/{FB_PAGE_ID}?fields=instagram_business_account` bằng mã trên) | Đăng Instagram |
| `WP_URL` | `https://www.noithatkas.com` | Đăng website |
| `WP_USER` | Tên đăng nhập WordPress của người đăng | Đăng website |
| `WP_APP_PASSWORD` | WordPress → Người dùng → Hồ sơ → **Mật khẩu ứng dụng** → đặt tên "KAS App" → Thêm. Không dùng mật khẩu đăng nhập | Đăng website |

Phần lấy mã Facebook/Instagram em chưa chạy thử với trang thật, lúc Thầy làm em hướng dẫn từng bước theo màn hình Thầy thấy.

**Trong app (Khách → Đăng bài → Cài đặt đăng bài):**
- Số bài mỗi tuần, giờ đăng (mặc định 19:30), model AI (mặc định Sonnet).
- Website: trạng thái **Nháp** (mặc định, Thầy vào WordPress xem rồi bấm Đăng) hoặc **Đăng luôn**. Mã chuyên mục "Chia sẻ": WordPress → Bài viết → Chuyên mục → di chuột vào "Chia sẻ", số sau `tag_ID=` trên đường dẫn là mã.
- Từng công trình: Sửa công trình → tick **Chủ nhà cho đăng ảnh**. Chỉ công trình có tick mới hiện trong gợi ý và chọn ảnh.

**Quy tắc khoá ở máy chủ:** chỉ tài khoản Thầy bấm được Duyệt; bài chưa duyệt không lên mạng; sửa chữ hoặc ảnh sau khi duyệt thì bài về chờ duyệt. AI không nhận tên chủ nhà, địa chỉ, giá; bài phong thủy bắt buộc dán đoạn tài liệu và tên nguồn. TikTok đăng tay: đến ngày app nhắc, bấm Chép chữ, tải ảnh, đăng xong dán link vào app.

## Lỗi hay gặp

| Hiện tượng | Cách xử lý |
| --- | --- |
| App báo "Khoá không đúng hoặc đã bị thu hồi" | Thầy vào Người dùng → Gửi lại link cho người đó |
| Chữ **Mất mạng · chờ gửi N** không mất | Bình thường khi mất sóng. Có sóng lại app tự gửi; đừng xoá dữ liệu trình duyệt khi còn chờ |
| Góc trên hiện **Cần cập nhật máy chủ** | Làm theo mục "Khi sửa code máy chủ" ở trên |
| Đăng bài báo lỗi một kênh | Xem dòng lỗi đỏ trong bài. Sửa khoá rồi bấm **Đăng ngay**: chỉ đăng lại kênh còn thiếu. Hẹn giờ thử tối đa 3 lần |
| Quên khoá của Thầy | Mở Sheets **KAS App – Dữ liệu** → tab `NguoiDung` → cột `khoa` dòng của Thầy |
