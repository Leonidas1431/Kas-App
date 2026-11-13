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
- [x] Phát sinh 4 bước: giám sát báo (không thấy giá) → văn phòng báo giá → khách đồng ý trên link hoặc Zalo → giám sát thấy "Được làm"; thu phát sinh theo mã PS, cảnh báo phát sinh vượt ngưỡng % HĐ
- [x] Duyệt mẫu vật liệu: tên mẫu, người bán, việc dùng mẫu, hạn chốt trước ngày làm, khách chốt hoặc đổi trên link
- [x] Nhà thầu: danh bạ (giám sát thấy tên, số; không thấy ghi chú nội bộ), việc theo công trình, ngày chậm do thầu, chấm 1–5 (chất lượng, tiến độ, phối hợp) khi thầu xong việc; link riêng cho thầu xem lịch việc của mình + mẫu đã chốt, không tiền, không việc thầu khác
- [x] Nhắc ảnh 16h: sau 16h, công trình đang thi công chưa có ảnh hôm nay hiện đỏ đầu màn Hôm nay, bấm chụp luôn
- [x] Sửa kế hoạch (bảng sửa nhanh trên máy tính, sửa từng việc trên điện thoại): số ngày, khối lượng, thầu, việc đi trước, thêm/xoá việc, khởi công, ngày nghỉ Tết, chốt lại kế hoạch gốc
