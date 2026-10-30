# KAS App

Web app quản lý công trình cho KAS Houzing: lập kế hoạch trên máy tính, cập nhật tiến độ trên điện thoại, link riêng cho chủ nhà và nhà thầu.

Thiết kế và quyết định: [doc phân tích nhu cầu & kiến trúc](https://claude.ai/artifact/3LezeqPdtDKAZynXJcMR1x).

## Cấu trúc

| Thư mục | Nội dung |
| --- | --- |
| `web/` | App chạy trên trình duyệt (PWA), HTML/JS thuần, không cần build |
| `web/js/schedule.js` | Bộ xếp lịch: lịch nghỉ, ngày lễ, ràng buộc trước–sau |
| `web/js/store.js` | Dữ liệu + hàng chờ khi mất sóng |
| `web/data/thu-vien-v1.json` | Thư viện hạng mục (bản nháp v1, chờ Thầy và Đức duyệt) |
| `gas/` | Máy chủ Apps Script: Sheets làm kho dữ liệu, ảnh vào Drive |
| `test/` | Kiểm tra bộ xếp lịch: `npm test` |

## Chạy thử trên máy

```
cd web && python3 -m http.server 8765
```

Mở http://localhost:8765. Bản hiện tại lưu dữ liệu trong trình duyệt, chưa nối Sheets.

## Tình trạng

- [x] Bộ xếp lịch + kiểm tra
- [x] Giao diện: Hôm nay, cập nhật %, báo chậm (xem trước việc bị lùi), ghi chú/phát sinh, Gantt có kế hoạch gốc, bảng tổng, link chủ nhà
- [ ] Nối Apps Script (đăng nhập Gmail, đồng bộ, ảnh lên Drive)
- [ ] Link thầu, đánh giá thầu, bật công khai lý do chậm
- [ ] Sửa kế hoạch trên máy tính (số ngày, khối lượng, thầu, thêm/bớt việc)
