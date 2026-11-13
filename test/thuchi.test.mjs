import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rong, taoCongTrinh, capNhatTienDo } from '../web/js/store.js';
import { taoHopDong, ghiThu } from '../web/js/hopdong.js';
import {
  CTY, docTien, ghiKhoan, xoaKhoan, themDotTra, xacNhanKL, trangThaiTra, canXacNhanKL, tongThang, congNoThau, laiGop, goiYMaDot, daTra,
} from '../web/js/thuchi.js';

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
const HN = '2026-11-13';
const moi = () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Thử', loai: 'NTCT', khoiCong: '2026-11-02', lich: { kieu: 'NGHI_CN', nghi: [], daHoi: [] } });
  db.outbox = [];
  return { db, ct };
};

test('đọc số tiền gõ nhanh: 12tr, 1,5tr, 500k, 12.000.000, 1.2 tỷ', () => {
  assert.equal(docTien('12tr'), 12e6);
  assert.equal(docTien('1,5tr'), 1.5e6);
  assert.equal(docTien('1.5 tr'), 1.5e6);
  assert.equal(docTien('500k'), 5e5);
  assert.equal(docTien('12.000.000'), 12e6);
  assert.equal(docTien('12,000,000đ'), 12e6);
  assert.equal(docTien('1.2 tỷ'), 1.2e9);
  assert.ok(Number.isNaN(docTien('mười triệu')));
});

test('đợt trả thầu: chưa nghiệm thu → giám sát xác nhận → đến hạn → trả đủ', () => {
  const { db, ct } = moi();
  const v = ct.viec[2];
  const t = themDotTra(db, { maCongTrinh: 'NT-A', thau: 'Thầu Tâm', hangMuc: 'Điện nước', dot: 'DN1', soTien: 12e6, dieuKien: 'Đi ống xong', viecMoc: v.id, hanTra: '2026-12-01' }, 'THAY');
  assert.equal(trangThaiTra(db, t, HN).tt, 'CHUA');
  assert.equal(canXacNhanKL(db, HN).length, 0);
  capNhatTienDo(db, ct, v.id, 100, 'KHA', HN);
  assert.equal(canXacNhanKL(db, HN)[0].t, t); // xong việc mốc → nhắc giám sát
  db.outbox = [];
  xacNhanKL(db, t, { ngay: HN, ghiChu: 'đủ' }, 'KHA');
  assert.deepEqual(db.outbox.map((o) => o.loai), ['XAC_NHAN_KL', 'LICH_SU']);
  assert.ok(!JSON.stringify(db.outbox).includes('12000000')); // giám sát gửi lên không có tiền
  assert.equal(canXacNhanKL(db, HN).length, 0);
  assert.deepEqual(congNoThau(db, HN).denHan, 12e6);
  ghiKhoan(db, { ngay: HN, ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi thầu phụ', thamChieu: t.id, doiTuong: 'Thầu Tâm', soTien: 5e6 }, 'THAY');
  assert.deepEqual([trangThaiTra(db, t, HN).tt, trangThaiTra(db, t, HN).con], ['DEN_HAN', 7e6]);
  const e = ghiKhoan(db, { ngay: HN, ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi thầu phụ', thamChieu: t.id, soTien: 7e6 }, 'THAY');
  assert.equal(trangThaiTra(db, t, HN).tt, 'DU');
  xoaKhoan(db, e, 'THAY', 'ghi nhầm');
  assert.equal(daTra(db, t.id), 5e6);
  assert.match(db.lichSu.at(-1).ma, /^TC-/); // nhật ký xoá khoản tiền: mã riêng tư
});

test('quá hạn chưa nghiệm thu; mã đợt gợi ý theo chữ đầu hạng mục', () => {
  const { db } = moi();
  const t = themDotTra(db, { maCongTrinh: 'NT-A', thau: 'X', hangMuc: 'Điện nước', dot: goiYMaDot(db, 'NT-A', 'Điện nước'), soTien: 1e6, hanTra: '2026-11-10' }, 'THAY');
  assert.equal(t.dot, 'DN1');
  assert.equal(goiYMaDot(db, 'NT-A', 'điện nước'), 'DN2');
  assert.equal(goiYMaDot(db, 'NT-A', 'Gỗ'), 'G1');
  assert.equal(trangThaiTra(db, t, HN).tt, 'QUA');
  assert.equal(canXacNhanKL(db, HN).length, 1); // quá hạn trả thì cũng nhắc giám sát
});

test('tổng tháng gồm thu HĐ + thu ngoài HĐ; chi công ty tách riêng; khoản xoá không tính', () => {
  const { db } = moi();
  const hd = taoHopDong(db, { dang: 'NT', tenKhach: 'Chị A', maCongTrinh: 'NT-A', ngayKy: '2026-11-01', giaTri: 100e6 }, 'THAY');
  ghiThu(db, hd, hd.dot[0].id, { ngay: '2026-11-02', soTien: 50e6 }, 'THAY');
  ghiThu(db, hd, hd.dot[1].id, { ngay: '2026-10-30', soTien: 1e6 }, 'THAY');
  ghiKhoan(db, { ngay: '2026-11-05', ma: '', loai: 'THU', hangMuc: 'Thu dịch vụ phong thủy', soTien: 3e6 }, 'THAY');
  ghiKhoan(db, { ngay: '2026-11-06', ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi vật tư', soTien: 10e6 }, 'THAY');
  ghiKhoan(db, { ngay: '2026-11-07', ma: CTY, loai: 'CHI', hangMuc: 'CTY - Marketing', soTien: 2e6 }, 'THAY');
  const x = ghiKhoan(db, { ngay: '2026-11-08', ma: CTY, loai: 'CHI', hangMuc: 'CTY - Khác', soTien: 9e6 }, 'THAY');
  xoaKhoan(db, x, 'THAY');
  assert.deepEqual(tongThang(db, '2026-11'), { thu: 53e6, chi: 12e6, chiCty: 2e6, chenh: 41e6 });
});

test('lãi gộp công trình: doanh thu − chi dự kiến, cảnh báo vượt chi và lãi thấp', () => {
  const { db } = moi();
  const hd = taoHopDong(db, { dang: 'NT', tenKhach: 'Chị A', maCongTrinh: 'NT-A', ngayKy: '2026-11-01', giaTri: 100e6, chiDuKien: 85e6 }, 'THAY');
  ghiThu(db, hd, hd.dot[0].id, { ngay: '2026-11-02', soTien: 50e6 }, 'THAY');
  ghiKhoan(db, { ngay: '2026-11-06', ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi vật tư', soTien: 30e6 }, 'THAY');
  let lg = laiGop(db, 'NT-A', 20);
  assert.equal(lg.doanhThu, 100e6);
  assert.equal(lg.laiDuKien, 15e6);
  assert.equal(lg.pctDuKien, 15);
  assert.equal(lg.laiThucTe, 20e6);
  assert.deepEqual(lg.canhBao, ['Lãi gộp dự kiến dưới 20%']);
  ghiKhoan(db, { ngay: '2026-11-07', ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi thầu phụ', soTien: 60e6 }, 'THAY');
  lg = laiGop(db, 'NT-A', 0);
  assert.deepEqual(lg.canhBao, ['Vượt chi dự kiến']);
  assert.equal(laiGop(db, 'NT-B').chiDuKien, 0);
});
