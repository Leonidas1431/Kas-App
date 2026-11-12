import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rong } from '../web/js/store.js';
import { taoKhach, taoMaKhach, doiTrangThai, daGoi, themBaoGia, banGiao, viecKhachHomNay, addMonths, timTheoSdt, ganCongTrinh, xongChamSoc, thongKe } from '../web/js/khach.js';

const HN = '2026-11-13';

test('mã khách bỏ dấu, bỏ xưng hô, không trùng', () => {
  assert.equal(taoMaKhach([], 'Chị Xuân Xa La', HN), 'KH-2611-XUANXALA');
  assert.equal(taoMaKhach([], 'anh Đôn', HN), 'KH-2611-DON');
  assert.equal(taoMaKhach([{ ma: 'KH-2611-DON' }], 'Anh Đôn', HN), 'KH-2611-DON-2');
});

test('khách mới: gọi ngay hôm nay; đổi trạng thái thì nhắc sau 2 ngày', () => {
  const db = rong();
  const kh = taoKhach(db, { ten: 'Chị Xuân', sdt: '0912 345 678', tomTat: 'Căn hộ 90m2' }, 'THAY', HN);
  assert.equal(kh.sdt, '0912345678');
  assert.equal(kh.nhacGoi, HN);
  assert.deepEqual(viecKhachHomNay(db, HN).goi.map((k) => k.ma), [kh.ma]);
  doiTrangThai(db, kh, 'LIEN_HE', 'THAY', HN);
  assert.equal(kh.nhacGoi, '2026-11-15');
  assert.equal(viecKhachHomNay(db, HN).goi.length, 0);
  assert.ok(db.outbox.some((o) => o.loai === 'KHACH'));
  assert.ok(db.lichSu.some((e) => e.loai === 'KH_GHI' && e.ghiChu === 'Căn hộ 90m2'));
  assert.equal(timTheoSdt(db, '+84 912 345 678').ma, kh.ma);
});

test('gọi không phản hồi: lần 2 sau 1 tuần, lần nữa thì Tạm hoãn và nhắc lại sau 30 ngày', () => {
  const db = rong();
  const kh = taoKhach(db, { ten: 'Anh Tú' }, 'DUC', HN);
  assert.equal(daGoi(db, kh, false, 'Không nghe máy', 'DUC', HN), 'NHAC');
  assert.equal(kh.nhacGoi, '2026-11-20');
  assert.equal(daGoi(db, kh, false, 'Vẫn chưa trả lời', 'DUC', '2026-11-20'), 'TAM_HOAN');
  assert.equal(kh.trangThai, 'TAM_HOAN');
  assert.equal(kh.nhacGoi, '2026-12-20');
  daGoi(db, kh, true, 'Khách hẹn tuần sau gặp', 'DUC', '2026-12-20');
  assert.equal(kh.soLanNhac, 0);
});

test('báo giá giữ từng bản, tự chuyển sang Đã báo giá', () => {
  const db = rong();
  const kh = taoKhach(db, { ten: 'Chị Lan' }, 'THAY', HN);
  doiTrangThai(db, kh, 'KHAO_SAT', 'THAY', HN);
  themBaoGia(db, kh, { giaTri: 30000000, link: 'https://drive/x' }, 'THAY', HN);
  themBaoGia(db, kh, { giaTri: 27000000 }, 'THAY', '2026-11-16');
  assert.equal(kh.trangThai, 'BAO_GIA');
  assert.deepEqual(kh.baoGia.map((b) => [b.phienBan, b.giaTri]), [[1, 30000000], [2, 27000000]]);
});

test('ký và bàn giao: lịch chăm sóc 1/3/6/12 tháng, bảo hành 12 tháng, nhắc hoa hồng chưa trả', () => {
  const db = rong();
  const kh = taoKhach(db, { ten: 'Chị Xuân', nguoiGioiThieu: 'Anh Tú' }, 'THAY', HN);
  ganCongTrinh(db, kh, 'NT-2611-XUAN', 'THAY', HN);
  assert.equal(kh.trangThai, 'KY');
  assert.equal(kh.nhacGoi, '');
  assert.deepEqual(viecKhachHomNay(db, HN).hoaHong.map((k) => k.ma), [kh.ma]);
  banGiao(db, kh, '2027-01-31', 'THAY', HN);
  assert.deepEqual(kh.chamSoc.map((c) => c.han), ['2027-02-28', '2027-04-30', '2027-07-31', '2028-01-31']);
  assert.equal(kh.baoHanhDen, '2028-01-31');
  assert.equal(viecKhachHomNay(db, '2027-02-25').chamSoc.length, 1);
  xongChamSoc(db, kh, 1, 'Khách hài lòng, giới thiệu chị Hoa', 'THAY', '2027-02-26');
  assert.equal(viecKhachHomNay(db, '2027-02-27').chamSoc.length, 0);
  assert.equal(thongKe(db).theoNguon['Người quen giới thiệu'].ky, 1);
});

test('cộng tháng giữ ngày cuối tháng', () => {
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(addMonths('2026-11-13', 12), '2027-11-13');
});
