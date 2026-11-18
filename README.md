# KAS App

Web app quản lý công trình cho KAS Houzing: lập kế hoạch trên máy tính, cập nhật tiến độ trên điện thoại, link riêng cho chủ nhà và nhà thầu.

Thiết kế và quyết định: [doc phân tích nhu cầu & kiến trúc](https://claude.ai/artifact/3LezeqPdtDKAZynXJcMR1x).

## Cấu trúc

| Thư mục | Nội dung |
| --- | --- |
| `web/` | App chạy trên trình duyệt (PWA), HTML/JS thuần, không cần build |
| `web/js/schedule.js` | Bộ xếp lịch: lịch nghỉ, ngày lễ, ràng buộc trước–sau |
| `web/js/store.js` | Dữ liệu + hàng chờ khi mất sóng |
| `web/js/hopdong.js`, `web/js/thietke.js`, `web/js/kehoach.js`, `web/js/thuchi.js`, `web/js/phatsinh.js`, `web/js/mauvl.js` | Hợp đồng (số HĐ, đợt thu, phụ lục, khấu trừ phí TK), tiến độ thiết kế (phương án gửi khách, lần sửa, giám sát tác giả), sửa kế hoạch công trình, thu chi, trả thầu, phát sinh và mẫu vật liệu |
| `web/js/khach.js` | Sổ khách: trạng thái, nhắc gọi lại, báo giá, người giới thiệu, chăm sóc sau bàn giao |
| `web/js/lead.js`, `web/dang-ky.html` | Lead: form đăng ký Tên + SĐT theo link nguồn, hạn gọi 2 giờ làm việc, nóng/ấm/lạnh, các bước A→C, 5 mẫu tin Zalo, link giới thiệu, hoa hồng tự cập nhật, thông tin phong thủy (chỉ lưu) |
| `web/data/thu-vien-v1.json` | Thư viện hạng mục (bản nháp v1, chờ Thầy và Đức duyệt) |
| `gas/` | Máy chủ Apps Script: Sheets làm kho dữ liệu, ảnh vào Drive |
| `web/js/api.js`, `web/js/anh.js` | Đồng bộ với máy chủ, hàng chờ ảnh |
| `test/` | Kiểm tra bộ xếp lịch và máy chủ (giả lập Google): `npm test` |

## Chạy thử trên máy

```
cd web && python3 -m http.server 8765
```

Mở http://localhost:8765, bấm "Dùng thử không kết nối" để chạy với dữ liệu mẫu trên máy.

## Cài thật

App: https://leonidas1431.github.io/Kas-App/ (tự đăng lại mỗi lần gộp vào `main`).
Máy chủ Google: xem [docs/CAI-DAT.md](docs/CAI-DAT.md).

## Tình trạng

- [x] Bộ xếp lịch + kiểm tra
- [x] Giao diện: Hôm nay, cập nhật %, báo chậm (xem trước việc bị lùi), ghi chú/phát sinh, Gantt có kế hoạch gốc, bảng tổng, link chủ nhà
- [x] Nối Apps Script: khoá riêng từng người, đồng bộ khi có sóng, ảnh lên Drive, bật công khai lý do chậm
- [x] Khách hàng (A–C): sổ khách, nhắc gọi lại 2/7 ngày, tạm hoãn 30 ngày, báo giá nhiều bản, hoa hồng người giới thiệu, ký → tạo công trình (dùng chung thư mục ảnh khảo sát), chăm sóc 1/3/6/12 tháng, bảo hành 12 tháng
- [x] Vai trò: Thầy, Đức (toàn quyền), Giám sát, Quyền tạm có hạn
- [x] Hợp đồng: số HĐ YYMM31/TÊN-KAS/dạng, đợt thu (thiếu dồn sang đợt sau), phụ lục, khấu trừ phí TK vào đợt cuối HĐ thi công, nhắc thu khi xong mốc, dừng/hoàn thành
- [x] Tiến độ thiết kế: gửi phương án → khách đồng ý/cần sửa trên link chủ nhà, đếm lần sửa, phí sửa vượt 5%, nhắc khách sau 3 ngày, file xác nhận để ký, buổi giám sát tác giả
- [x] Thu chi (theo Sổ cái): ghi chi công trình / chi công ty / thu ngoài HĐ, gõ nhanh "12tr", ảnh chứng từ để riêng; đợt trả thầu, giám sát xác nhận khối lượng (không thấy tiền), đến hạn trả; chi dự kiến, lãi gộp, cảnh báo vượt chi
- [x] Công nợ và dòng tiền (17/11): nhiều tài khoản (tài khoản công ty / tài khoản tiền mặt), số dư từng tài khoản, chuyển tiền và tạm ứng; nợ nhà cung cấp (mua chịu); màn Công nợ gộp (khách quá hạn, thầu, nhà cung cấp) gửi Zalo nhắc / đối chiếu; dự báo dòng tiền 4–8 tuần; giám sát ghi chi ở công trường (chỉ khoản của mình, không thấy tổng), văn phòng kiểm
- [x] Phát sinh 4 bước: giám sát báo (không thấy giá) → văn phòng báo giá → khách đồng ý trên link hoặc Zalo → giám sát thấy "Được làm"; thu phát sinh theo mã PS, cảnh báo phát sinh vượt ngưỡng % HĐ
- [x] Duyệt mẫu vật liệu: tên mẫu, người bán, việc dùng mẫu, hạn chốt trước ngày làm, khách chốt hoặc đổi trên link
- [x] Nhà thầu: danh bạ (giám sát thấy tên, số; không thấy ghi chú nội bộ), việc theo công trình, ngày chậm do thầu, chấm 1–5 (chất lượng, tiến độ, phối hợp) khi thầu xong việc; link riêng cho thầu xem lịch việc của mình + mẫu đã chốt, không tiền, không việc thầu khác
- [x] Nghiệm thu: thầu xong việc → nhắc nghiệm thu theo checklist (lấy từ tab Nghiệm thu của Hồ sơ thi công, mục em đề xuất có dấu *), bắt buộc ảnh; mục lỗi thành tồn tại có hạn sửa, đánh dấu đã sửa kèm ảnh; trả thầu cảnh báo khi việc mốc còn tồn tại
- [x] Nhắc đo sản xuất nội thất khi xong thạch cao, sơn bả (hoặc trát tường) và cán nền/lát sàn
- [x] Lead (19/11, tab Khách → Form, mẫu tin): form đăng ký Tên + SĐT gắn website / fanpage / sự kiện, nguồn tự ghi theo link, khách cũ đăng ký lại không tạo trùng; lead mới hiện đầu Hôm nay của Thầy, gọi trong 2 giờ làm việc (8h–20h, lead đêm hạn 10h sáng); AI tách tin Zalo thành khách; nóng/ấm/lạnh tự gợi ý; phụ trách Thầy/Đức, nút báo Đức tham gia; các bước A→C; 5 mẫu tin Zalo sửa được; link giới thiệu riêng của khách cũ (gửi tay); hoa hồng tự chuyển Đã trả khi ghi khoản chi "CTY - Hoa hồng giới thiệu"; thông tin phong thủy chỉ lưu
- [x] Marketing (tab Khách → Marketing): khách mới, đã ký, tỉ lệ chốt, giá trị HĐ theo nguồn và theo kỳ; chi quảng cáo theo kênh (khoản "CTY - Marketing"), chi phí trên mỗi khách / khách ký; phễu, lý do mất; người giới thiệu + hoa hồng chưa trả; mục tiêu tháng (lead, khách ký, tỉ lệ chốt, ngân sách quảng cáo theo nhịp), hoa hồng gợi ý 5% HĐ thiết kế / 2% HĐ thi công
- [x] Đăng bài (Khách → Đăng bài): lịch tuần theo mục tiêu từng kênh, AI (Sonnet) tìm chủ đề và viết bài riêng cho Facebook/Instagram/TikTok/website, ảnh công trình thật (chủ nhà cho đăng), ảnh bìa dựng trên máy hoặc Gemini làm từ ảnh thật, đưa sang Canva sửa rồi lấy về; bài phong thủy lấy đoạn nguyên văn từ thư viện tài liệu trên Drive; chỉ Thầy duyệt; Facebook, Instagram, website tự đăng theo giờ hẹn, TikTok đăng tay; chi phí AI theo tháng
- [x] Bàn giao – bảo hành (18/11): biên bản bàn giao (bảo hành 12 tháng, sửa riêng từng hạng mục; thiết bị kèm hạn bảo hành hãng; chìa khoá, giấy tờ; tồn tại còn lại), chủ nhà bấm "Đồng ý bàn giao" trên link hoặc ký bản in; chủ nhà báo lỗi bảo hành kèm ảnh trên link, văn phòng/giám sát ghi hộ; lỗi khẩn hạn 24 giờ, thường 3 ngày, giao thầu đã làm hạng mục, xong phải có ảnh; trong hạn không tính phí, tuỳ chọn tính phí (giám sát không thấy tiền); nhắc trước 30 ngày khi hết bảo hành, gộp chăm sóc tháng 12; tổng kết nghiệm thu + phát sinh → biên bản quyết toán, thanh lý hợp đồng
- [x] Nhắc ảnh 16h: sau 16h, công trình đang thi công chưa có ảnh hôm nay hiện đỏ đầu màn Hôm nay, bấm chụp luôn
- [x] Sửa kế hoạch (bảng sửa nhanh trên máy tính, sửa từng việc trên điện thoại): số ngày, khối lượng, thầu, việc đi trước, thêm/xoá việc, khởi công, ngày nghỉ Tết, chốt lại kế hoạch gốc
- [x] Dự báo theo hôm nay: việc quá hạn chưa xong đẩy các việc sau và ngày xong công trình; việc đi sau một việc đang làm dở hiện "Chờ việc trước", không tính trễ; cuốn chiếu không xong trước việc đi trước; nhà xây mới nhập số tầng, phần thân tự lặp theo từng tầng
