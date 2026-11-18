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

## Bước 5. Bật đăng nhập bằng Gmail (mặc định, làm 1 lần, 0đ)

Mỗi người đăng nhập bằng Gmail của mình, máy chủ ghi Gmail người làm vào tab `NhatKy` cho mọi thao tác ghi và mỗi lần đăng nhập. Cần 1 mã "Client ID" của Google (miễn phí, không bí mật):

1. Vào **console.cloud.google.com** bằng Gmail của Thầy → chọn hoặc tạo dự án (vd "KAS App").
2. Menu **Google Auth Platform** (hoặc *API và dịch vụ → Màn hình đồng ý OAuth*) → **Bắt đầu**: tên ứng dụng `KAS App`, email hỗ trợ là Gmail của Thầy, đối tượng **Bên ngoài (External)**, đồng ý điều khoản → **Tạo**.
3. Mục **Đối tượng (Audience)** → **Xuất bản ứng dụng (Publish app)**. App chỉ xin tên + email nên Google không bắt xét duyệt. (Không muốn xuất bản thì thêm Gmail từng người vào **Người dùng thử**.)
4. Mục **Ứng dụng khách (Clients)** → **Tạo ứng dụng khách** → loại **Ứng dụng web** → *Nguồn gốc JavaScript được phép* thêm `https://leonidas1431.github.io` (không có dấu / cuối, không có /Kas-App) → **Tạo**.
5. Chép **Client ID** (đuôi `.apps.googleusercontent.com`). Mở app → tab **Người dùng** → **Cài đăng nhập Google** → dán → **Lưu Client ID**.
6. Nếu dòng Gmail của Thầy trống: bấm **Sửa Gmail** ở thẻ của Thầy, điền Gmail. Rồi vào màn Đăng nhập (`#ket-noi`), bấm **Đăng nhập bằng Google** để thử.

Tên mục trong Google Cloud có thể khác chút theo thời điểm.

## Bước 6. Thêm anh em

1. Tab **Người dùng** → điền tên, **Gmail người đó dùng**, vai trò. Với Kha, tích các công trình được giao.
2. Bấm **Thêm và gửi link** → chọn Zalo. Link này không chứa khoá; người nhận mở bằng Chrome, bấm **Đăng nhập bằng Google**, chọn đúng Gmail đã thêm. Gmail khác bị từ chối.
3. Trên điện thoại: menu → **Thêm vào màn hình chính** để có biểu tượng như app thật.
4. Mất máy hoặc nghỉ việc: bấm **Thu hồi** (bấm 2 lần để chắc), cả đăng nhập Gmail lẫn link khoá cũ hết tác dụng ngay.
5. Dự phòng: nút **Link khoá (dự phòng)** gửi link đăng nhập không cần Google (cho máy không có tài khoản Google). Khi ai cũng đã đăng nhập Gmail (thẻ hiện "Đã đăng nhập Gmail"), tích **Chỉ cho đăng nhập bằng Gmail** để tắt hết link khoá cũ. Thầy phải đang vào bằng Gmail mới tích được.

## Ảnh tiến độ đi đâu

- Lúc tạo công trình, dán link thư mục Drive của công trình vào ô **Link thư mục Drive của công trình** → ảnh vào thư mục con `Ảnh tiến độ` trong đó.
- Không dán thì ảnh vào `KAS App – Ảnh/<Mã công trình>` trong Drive của Thầy.
- Tên ảnh: `MãCT_NămThángNgày_GiờPhút_MãViệc_01.jpg`. Ảnh được nén ~1600px trên điện thoại trước khi gửi, mất sóng thì nằm chờ trên máy, có sóng tự gửi.

## Báo cáo công trường

- Giám sát làm **phiếu báo cáo ngày** ở màn Hôm nay (hoặc nút 📋 trong màn công trình): thầu nào làm, xong gì (bấm % là cập nhật kế hoạch), thiếu/phát sinh, ảnh hưởng hạng mục khác, ngày mai có đổi kế hoạch không, tối thiểu 6 ảnh. Nộp xong có nút gửi nhóm Zalo nội bộ. Sửa được trong ngày; ngày đã qua chỉ Thầy/Đức sửa.
- Chưa nộp thì màn Hôm nay báo đỏ lúc 16h, 17h, 17h30 (chỉ trong app, không email).
- Thầu **công nhật**: tick ô "Công nhật" ở hồ sơ thầu → mỗi ngày thầu có việc theo lịch, màn Hôm nay hiện nút chấm công. Bảng công theo tháng nằm trong hồ sơ thầu.
- Thầy/Đức báo chậm = **đề xuất**; giám sát bấm xác nhận / sửa / không lùi thì lịch mới đổi. Tick "Đã thống nhất với giám sát" để lùi ngay.
- **Tổng hợp tuần**: từ trưa thứ 7, màn Hôm nay của Thầy/Đức nhắc từng công trình. App gom sẵn tiến độ, việc xong, việc tuần sau, vướng mắc cần chủ nhà, chọn sẵn 9 ảnh mới nhất; Thầy sửa rồi bấm **Gửi chủ nhà** → hiện trên link chủ nhà và mở Zalo gửi tin. Chủ nhà chỉ xem được đúng ảnh đã chọn, không cần chia sẻ thư mục Drive.

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
| `IG_TOKEN` | **Cách nên dùng.** Mã Instagram lấy theo cách "Instagram API with Instagram login", không cần nối Fanpage. Xem mục *Nối Instagram không qua Fanpage* bên dưới | Đăng Instagram |
| `IG_USER_ID` | Có `IG_TOKEN` thì máy chủ tự điền. Chỉ cần tự điền khi Instagram nối với Fanpage (gọi `/{FB_PAGE_ID}?fields=instagram_business_account`) | Đăng Instagram |
| `WP_URL` | `https://noithatkas.com` (không có www, đúng địa chỉ chính của web) | Đăng website |
| `WP_USER` | Tên đăng nhập WordPress của người đăng | Đăng website |
| `WP_APP_PASSWORD` | WordPress → Người dùng → Hồ sơ → **Mật khẩu ứng dụng** → đặt tên "KAS App" → Thêm. Không dùng mật khẩu đăng nhập | Đăng website |
| `GEMINI_API_KEY`, `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`, `PT_FOLDER_ID` | Xem các mục Gemini, Canva, Thư viện phong thủy bên dưới | Ảnh bìa, tài liệu phong thủy |

Phần lấy mã Facebook/Instagram em chưa chạy thử với trang thật, lúc Thầy làm em hướng dẫn từng bước theo màn hình Thầy thấy.

**Instagram phải là tài khoản chuyên nghiệp** thì mới tự đăng được. Trong app Instagram: Trang cá nhân → menu ☰ → Cài đặt → *Loại tài khoản và công cụ* → *Chuyển sang tài khoản chuyên nghiệp* → chọn *Doanh nghiệp*. Tên mục có thể khác chút tuỳ bản app. Chưa chuyển thì bỏ tick Instagram ở bài, các kênh khác vẫn đăng bình thường.

### Nối Instagram không qua Fanpage (khi Fanpage vướng Business cũ)

App Meta "KAS App" dùng cách "Instagram API with Unified login": đăng thẳng bằng tài khoản Instagram, **không cần nối Fanpage** ([tài liệu Meta](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login)). App Meta mới không dùng được cách "Instagram login" cũ nữa.

1. Instagram chuyển sang tài khoản chuyên nghiệp (Doanh nghiệp) như trên.
2. developers.facebook.com → "KAS App" → Trường hợp sử dụng → Instagram → *API setup with Unified login* → mục **2. Tạo mã truy cập** → *Thêm tài khoản*, mời Instagram KAS làm **Người thử nghiệm Instagram**.
3. Trong app Instagram chấp nhận lời mời (Cài đặt → Quyền đối với trang web → Ứng dụng và trang web → Lời mời thử nghiệm). Tên mục có thể khác chút.
4. Quay lại trang Meta → **Tạo mã**. Mã chỉ hiện 1 lần: Thầy tự chép, dán vào Thuộc tính tập lệnh tên `IG_TOKEN`.
5. Trong trình soạn thảo chọn hàm `kiemTraIG` → Chạy. Nhật ký hiện tên tài khoản Instagram là xong, máy chủ tự điền `IG_USER_ID`.

Máy chủ tự nhận loại mã: mã bắt đầu bằng `IG` (Instagram login) gọi graph.instagram.com và tự gia hạn 7 ngày/lần; mã khác (Unified login) gọi graph.facebook.com, hết hạn theo cấu hình. Khi Instagram báo lỗi mã thì tạo lại mã ở bước 4.

Ảnh lên Instagram vẫn lấy từ ảnh đã tải lên Fanpage (dạng ẩn), nên `FB_PAGE_TOKEN` phải còn chạy.

### Khi Meta báo "Error validating access token" (mã Facebook hết hiệu lực)

Mã Trang mất hiệu lực khi đổi mật khẩu Facebook hoặc Meta đặt lại phiên đăng nhập. Facebook và cả Instagram (mượn chỗ lưu ảnh của Trang) đều dừng. Cách lấy lại:

1. Lần đầu: developers.facebook.com → "KAS App" → Cài đặt ứng dụng → Thông tin cơ bản → **Khoá bí mật** → Hiển thị. Thầy tự chép, dán vào Thuộc tính tập lệnh tên `FB_APP_SECRET`.
2. developers.facebook.com/tools/explorer → chọn ứng dụng "KAS App", Người dùng → thêm quyền `pages_manage_posts`, `pages_read_engagement`, `pages_show_list` → **Generate Access Token** → cho phép, chọn Trang KAS Houzing.
3. Thầy tự chép mã, dán vào Thuộc tính tập lệnh tên `FB_USER_TOKEN_TAM`.
4. Trình soạn thảo → chọn hàm `doiMaFacebook` → Chạy. Nhật ký báo "Đã thay FB_PAGE_TOKEN" là xong; máy chủ tự xoá mã tạm.

### Gemini làm ảnh bìa

| Thuộc tính | Lấy ở đâu |
| --- | --- |
| `GEMINI_API_KEY` | aistudio.google.com → Get API key → Create API key. Phải bật thanh toán (Billing) cho dự án của khoá: ảnh của Gemini không có gói miễn phí |

Nếu app báo **"Gemini chưa bật thanh toán"** (Google báo lỗi 429, "limit: 0 ... Free Tier"): vào aistudio.google.com → mục Billing / API keys → bấm thiết lập thanh toán cho dự án của khoá, thêm thẻ. Nên đặt ngân sách cảnh báo (vd 100.000đ/tháng) trong Google Cloud Billing → Budgets & alerts. Tên mục có thể khác chút.

- Gói Gemini Pro Thầy đang dùng là gói cá nhân trong app Gemini. Trang giới thiệu gói của Google không ghi có tiền dùng API, nên tiền API tính riêng: khoảng 0,067 USD/ảnh (Gemini 3.1 Flash Image) hoặc 0,134 USD/ảnh (Gemini 3 Pro Image, chữ trên ảnh đẹp hơn). Chọn trong Cài đặt đăng bài.
- Ảnh Gemini làm có dấu SynthID ẩn của Google (không thấy bằng mắt).
- Hai kiểu: *Giữ ảnh thật, chỉ chỉnh sáng* (để chữ thêm sau bằng Canva hoặc mẫu trong app), hoặc *In chữ trên bìa lên ảnh*. Lời nhắn cho Gemini cấm thêm, bớt, đổi đồ đạc, vật liệu của công trình, nhưng Thầy vẫn soi lại ảnh trước khi duyệt: ảnh dự án phải đúng công trình thật.

### Canva (gói Pro/Teams, không tốn thêm tiền)

Đã nối thật ngày 14/11/2026. Canva nay gọi "tích hợp" là "app": canva.com/developers/apps.

1. Bật **xác thực 2 lớp** cho tài khoản Canva (Cài đặt → Tài khoản và bảo mật → Ứng dụng xác thực). Canva bắt buộc mới mở phần REST API.
2. *Create an app* → tên "KAS App" → chọn **Anyone on Canva** (loại "Restricted to your Canva team" chỉ cho gói Enterprise). Không cần gửi Canva duyệt.
3. *Outside Canva* → *Start integrating* → mục *Configuration*: chép **Client ID**, bấm **Generate secret** → dán vào Thuộc tính tập lệnh `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`.
4. Mục *Scopes*: tick asset (read, write), design:content (read, write), design:meta (read).
5. Mục *Redirect URLs*: dán **cả 2** link `/exec` của 2 bản triển khai (Apps Script → Triển khai → Quản lý tùy chọn triển khai).
6. Trong app bấm **Nối Canva** → đăng nhập Canva → **Allow**. Thấy chữ "Đã nối Canva" là xong.

Dùng (trong bài, mục **Ảnh bìa → Cách 1. Sửa trong Canva**):
1. **Đưa ảnh sang Canva**: app cắt ảnh bìa đang dùng (chưa có thì ảnh đầu) đúng khổ 1080×1350 rồi mở Canva.
2. Sửa trên Canva, chờ vài giây cho Canva tự lưu.
3. Quay lại bài bấm **Lấy ảnh từ Canva làm ảnh bìa**. Khung "Ảnh bìa đang dùng" đổi sang ảnh mới, ghi "lấy từ Canva lúc …".

Điền chữ tự động vào mẫu Canva (autofill) cần gói Enterprise, nên chữ trên Canva Thầy tự sửa. Gói Canva hết hạn thì phần nối vẫn chạy (API tải ảnh, tạo thiết kế, xuất ảnh hiện miễn phí theo trang Credit rates của Canva).

### Thư viện phong thủy

Máy chủ tự tìm thư mục `My Drive/LeonidasProject/_shared/phong-thuy-core/_private` (đọc Google Docs, Word, PDF, .md, .txt; Word và PDF được Drive chuyển tạm sang chữ rồi xoá bản tạm). Để chỗ khác thì đặt `PT_FOLDER_ID` = mã thư mục (đoạn sau `folders/` trên link thư mục). Trong bài phong thủy bấm **Lấy từ thư viện phong thủy** → chọn tài liệu → *AI tìm đoạn liên quan* (AI chỉ được chép nguyên văn; đoạn nào không khớp tài liệu máy chủ tự bỏ) hoặc *Xem toàn văn, tự chọn*. Đoạn được chọn và tên tài liệu (chương) điền vào bài; trang sách Thầy ghi thêm nếu cần. Khi AI tìm đoạn, toàn văn tài liệu được gửi tới Claude API.

**Trong app (Khách → Đăng bài → Cài đặt đăng bài):**
- Số bài mỗi tuần, giờ đăng (mặc định 19:30), model AI (mặc định Sonnet).
- Website: trạng thái **Nháp** (mặc định, Thầy vào WordPress xem rồi bấm Đăng) hoặc **Đăng luôn**. Chuyên mục mặc định chọn trong Cài đặt đăng bài (app tự lấy danh sách từ web, chưa chọn thì dùng "Chia sẻ"). Từng bài chọn lại chuyên mục và thẻ được, ở mục Nội dung → Website.
- Ảnh: Facebook, Instagram dùng ảnh dọc 1080×1350 (4:5); website dùng ảnh đại diện ngang 1200×675 (16:9). Bài có cả hai thì mục Ảnh bìa có nút đổi kênh, mỗi kênh làm 1 ảnh (Canva, Gemini hoặc dựng trên máy).

### WordPress báo "không được phép tạo bài viết" hoặc "không nhận được mật khẩu ứng dụng"

Nghĩa là hosting đã bỏ mất phần mật khẩu (header `Authorization`) trước khi tới WordPress. Kiểm tra: Cài đặt đăng bài → **Kiểm tra kết nối website**. Cách sửa:

1. Vào trình quản lý file của hosting (cPanel → File Manager), mở thư mục web (thường là `public_html`), bật hiện file ẩn, mở file `.htaccess`.
2. Thêm dòng này lên **đầu file** (trên dòng `# BEGIN WordPress`), rồi lưu:
   ```
   SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
   ```
3. Bấm lại **Kiểm tra kết nối website**. Vẫn lỗi (noithatkas.com rơi vào trường hợp này, thử ngày 16/11) thì cài plugin nhỏ của app:
   - Tải file [`wordpress/kas-auth.php`](../wordpress/kas-auth.php) trong repo về máy.
   - File Manager → `public_html/wp-content/` → mở thư mục `mu-plugins` (chưa có thì bấm *+ Folder* tạo tên `mu-plugins`) → *Upload* file `kas-auth.php` vào.
   - Không cần bật gì: WordPress tự chạy file trong `mu-plugins`. Kiểm tra lại bằng nút ở bước 3.
   - App gửi kèm mật khẩu ở header `X-KAS-Auth`, file này chuyển lại cho WordPress tự kiểm tra; sai mật khẩu vẫn bị từ chối.
4. Tài khoản `WP_USER` cần vai trò **Biên tập viên** hoặc **Quản trị viên** để đăng bài, tải ảnh, tạo thẻ mới.
- Từng công trình: Sửa công trình → tick **Chủ nhà cho đăng ảnh**. Chỉ công trình có tick mới hiện trong gợi ý và chọn ảnh.

**Quy tắc khoá ở máy chủ:** chỉ tài khoản Thầy bấm được Duyệt; bài chưa duyệt không lên mạng; sửa chữ hoặc ảnh sau khi duyệt thì bài về chờ duyệt. AI không nhận tên chủ nhà, địa chỉ, giá; bài phong thủy bắt buộc dán đoạn tài liệu và tên nguồn. TikTok đăng tay: đến ngày app nhắc, bấm Chép chữ, tải ảnh, đăng xong dán link vào app.

## Lỗi hay gặp

| Hiện tượng | Cách xử lý |
| --- | --- |
| App báo "Khoá không đúng hoặc đã bị thu hồi" | Người đó vào màn Đăng nhập, bấm **Đăng nhập bằng Google**. Nếu báo "Gmail chưa được thêm": Thầy kiểm Gmail ở tab Người dùng (Sửa Gmail) |
| Bấm Đăng nhập bằng Google báo lỗi "origin" / không hiện nút | Kiểm bước 5 mục 4: nguồn gốc phải đúng `https://leonidas1431.github.io`. Client ID mới tạo có thể mất vài phút mới chạy |
| Xem ai làm gì | Sheets **KAS App – Dữ liệu** → tab `NhatKy`: giờ, Gmail, vai trò, cách đăng nhập (GMAIL/LINK), thao tác, mã công trình/khách/HĐ |
| Chữ **Mất mạng · chờ gửi N** không mất | Bình thường khi mất sóng. Có sóng lại app tự gửi; đừng xoá dữ liệu trình duyệt khi còn chờ |
| Góc trên hiện **Cần cập nhật máy chủ** | Làm theo mục "Khi sửa code máy chủ" ở trên |
| Đăng bài báo lỗi một kênh | Xem dòng lỗi đỏ trong bài. Sửa khoá rồi bấm **Đăng ngay**: chỉ đăng lại kênh còn thiếu. Hẹn giờ thử tối đa 3 lần |
| Quên khoá của Thầy | Mở Sheets **KAS App – Dữ liệu** → tab `NguoiDung` → cột `khoa` dòng của Thầy |
