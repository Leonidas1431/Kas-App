# KAS App

Web app quản lý công trình cho KAS Houzing: lập kế hoạch trên máy tính, cập nhật tiến độ trên điện thoại, link riêng cho chủ nhà và nhà thầu.

Thiết kế và quyết định: [doc phân tích nhu cầu & kiến trúc](https://claude.ai/artifact/3LezeqPdtDKAZynXJcMR1x).

## Cấu trúc

| Thư mục | Nội dung |
| --- | --- |
| `web/` | App chạy trên trình duyệt (PWA), HTML/JS thuần, không cần build |
| `web/js/schedule.js` | Bộ xếp lịch: lịch nghỉ, ngày lễ, ràng buộc trước–sau |
| `web/js/store.js` | Dữ liệu + hàng chờ khi mất sóng |
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

App: https://leonidas1431.github.io/kas-app/ (tự đăng lại mỗi lần gộp vào `main`).
Máy chủ Google: xem [docs/CAI-DAT.md](docs/CAI-DAT.md).

## Tình trạng

- [x] Bộ xếp lịch + kiểm tra
- [x] Giao diện: Hôm nay, cập nhật %, báo chậm (xem trước việc bị lùi), ghi chú/phát sinh, Gantt có kế hoạch gốc, bảng tổng, link chủ nhà
- [x] Nối Apps Script: khoá riêng từng người, đồng bộ khi có sóng, ảnh lên Drive, bật công khai lý do chậm
- [x] Khách hàng (A–C): sổ khách, nhắc gọi lại 2/7 ngày, tạm hoãn 30 ngày, báo giá nhiều bản, hoa hồng người giới thiệu, ký → tạo công trình (dùng chung thư mục ảnh khảo sát), chăm sóc 1/3/6/12 tháng, bảo hành 12 tháng
- [x] Vai trò: Thầy, Đức (toàn quyền), Giám sát, Quyền tạm có hạn
- [ ] Theo dõi hợp đồng (số HĐ, đợt thanh toán, phí sửa thêm, file xác nhận ký)
- [ ] Tiến độ thiết kế
- [ ] Link thầu, đánh giá thầu
- [ ] Sửa kế hoạch trên máy tính (số ngày, khối lượng, thầu, thêm/bớt việc)
